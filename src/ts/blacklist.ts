import { lines, unlines, getOptions, sendMessage } from './common';
import blacklistUpdateStyle from '!!css-loader!sass-loader!../scss/blacklistUpdate.scss';

export class AltURL {
  scheme: string;
  host: string;
  path: string;

  constructor(url: string) {
    const u = new URL(url);
    this.scheme = u.protocol.slice(0, -1);
    this.host = u.hostname;
    this.path = `${u.pathname}${u.search}`;
  }

  toString(): string {
    return `${this.scheme}://${this.host}${this.path}`;
  }
}

const enum SchemeMatch {
  Any,
  Exact,
}
const enum HostMatch {
  Any,
  Partial,
  Exact,
}
const enum PathMatch {
  Any,
  Exact,
}

class MatchPattern {
  schemeMatch: SchemeMatch;
  scheme?: string;
  hostMatch: HostMatch;
  host?: string;
  pathMatch: PathMatch;
  path?: RegExp;

  constructor(scheme: string, host: string, path: string) {
    if (scheme === '*') {
      this.schemeMatch = SchemeMatch.Any;
    } else {
      this.schemeMatch = SchemeMatch.Exact;
      this.scheme = scheme;
    }
    if (host === '*') {
      this.hostMatch = HostMatch.Any;
    } else if (host.startsWith('*.')) {
      this.hostMatch = HostMatch.Partial;
      this.host = host.slice(2);
    } else {
      this.hostMatch = HostMatch.Exact;
      this.host = host;
    }
    if (path === '/*') {
      this.pathMatch = PathMatch.Any;
    } else {
      this.pathMatch = PathMatch.Exact;
      this.path = new RegExp(
        `^${path.replace(/[$^\\.+?()[\]{}|]/g, '\\$&').replace(/\*/g, '.*')}$`,
      );
    }
  }

  test(url: AltURL): boolean {
    if (this.hostMatch === HostMatch.Partial) {
      if (url.host !== this.host! && !url.host.endsWith(`.${this.host!}`)) {
        return false;
      }
    } else if (this.hostMatch === HostMatch.Exact) {
      if (url.host !== this.host!) {
        return false;
      }
    }
    if (this.schemeMatch === SchemeMatch.Any) {
      if (url.scheme !== 'http' && url.scheme !== 'https') {
        return false;
      }
    } else {
      if (url.scheme !== this.scheme!) {
        return false;
      }
    }
    if (this.pathMatch === PathMatch.Exact) {
      if (!this.path!.test(url.path)) {
        return false;
      }
    }
    return true;
  }
}

class RegularExpression {
  regExp: RegExp;

  constructor(pattern: string, flags: string) {
    this.regExp = new RegExp(pattern, flags);
    if (this.regExp.global || this.regExp.sticky) {
      this.regExp = new RegExp(this.regExp, flags.replace(/[gy]/g, ''));
    }
  }

  test(url: AltURL): boolean {
    return this.regExp.test(url.toString());
  }
}

interface CompiledRule {
  tester: MatchPattern | RegularExpression;
  rawRuleIndex: number;
}

class Blacklist {
  rawRules: (string | null)[] = [];
  blockRules: CompiledRule[] = [];
  unblockRules: CompiledRule[] = [];

  constructor(blacklist: string) {
    this.add(blacklist);
  }

  add(blacklist: string): void {
    for (const rawRule of lines(blacklist)) {
      this.rawRules.push(rawRule);
      const m = /^(@?)(?:((\*|https?|ftp):\/\/(\*|(?:\*\.)?[^/*]+)(\/.*))|(\/((?:[^*\\/[]|\\.|\[(?:[^\]\\]|\\.)*\])(?:[^\\/[]|\\.|\[(?:[^\]\\]|\\.)*\])*)\/(.*)))$/.exec(
        rawRule.trim(),
      );
      if (!m) {
        continue;
      }
      try {
        (m[1] ? this.unblockRules : this.blockRules).push({
          // 'new RegularExpression()' may throw.
          tester: m[2] ? new MatchPattern(m[3], m[4], m[5]) : new RegularExpression(m[7], m[8]),
          rawRuleIndex: this.rawRules.length - 1,
        });
      } catch (e) {
        continue;
      }
    }
  }

  blocks(url: AltURL): boolean {
    return this.blockRules.some(({ tester }) => tester.test(url));
  }

  unblocks(url: AltURL): boolean {
    return this.unblockRules.some(({ tester }) => tester.test(url));
  }

  toString(): string {
    return unlines(this.rawRules.filter(rawRule => rawRule != null) as string[]);
  }
}

interface BlacklistUpdateParams {
  url: AltURL;
  unblock: boolean;
  added: string;
  removed: string;
  removedIndices: number[];
}

function acceptsAdded(params: BlacklistUpdateParams, added: string): boolean {
  const blacklist = new Blacklist(added);
  if (params.unblock) {
    return blacklist.unblocks(params.url) || (!params.added && !blacklist.blocks(params.url));
  } else {
    return !blacklist.unblocks(params.url) && (!params.added || blacklist.blocks(params.url));
  }
}

export class BlacklistAggregation {
  private user: Blacklist;
  private subscription: Blacklist;

  constructor(user: string, subscription: string[]) {
    this.user = new Blacklist(user);
    this.subscription = new Blacklist(subscription.join('\n'));
  }

  test(url: AltURL): boolean {
    if (this.user.unblocks(url)) {
      return false;
    }
    if (this.user.blocks(url)) {
      return true;
    }
    if (this.subscription.unblocks(url)) {
      return false;
    }
    if (this.subscription.blocks(url)) {
      return true;
    }
    return false;
  }

  preUpdate(url: AltURL): BlacklistUpdateParams {
    const params: BlacklistUpdateParams = {
      url,
      unblock: false,
      added: '',
      removed: '',
      removedIndices: [],
    };
    this.initializeRemoved(params, this.user.unblockRules);
    if (params.removedIndices.length) {
      if (
        !this.user.blocks(url) &&
        (this.subscription.unblocks(url) || !this.subscription.blocks(url))
      ) {
        params.added = `*://${url.host}/*`;
      }
    } else {
      this.initializeRemoved(params, this.user.blockRules);
      if (params.removedIndices.length) {
        params.unblock = true;
        if (!this.subscription.unblocks(url) && this.subscription.blocks(url)) {
          params.added = `@*://${url.host}/*`;
        }
      } else if (this.subscription.unblocks(url) || !this.subscription.blocks(url)) {
        params.added = `*://${url.host}/*`;
      } else {
        params.unblock = true;
        params.added = `@*://${url.host}/*`;
      }
    }
    return params;
  }

  update(params: BlacklistUpdateParams): void {
    if (params.unblock) {
      this.applyRemoved(params, this.user.blockRules);
    } else {
      this.applyRemoved(params, this.user.unblockRules);
    }
    this.user.add(params.added);
    sendMessage('setBlacklist', { blacklist: this.user.toString() });
  }

  private initializeRemoved(params: BlacklistUpdateParams, rules: CompiledRule[]): void {
    const removed: string[] = [];
    rules.forEach(({ tester, rawRuleIndex }, index) => {
      if (tester.test(params.url)) {
        removed.push(this.user.rawRules[rawRuleIndex]!);
        params.removedIndices.push(index);
      }
    });
    params.removed = unlines(removed);
  }

  private applyRemoved(params: BlacklistUpdateParams, rules: CompiledRule[]): void {
    for (let i = params.removedIndices.length - 1; i >= 0; --i) {
      this.user.rawRules[rules[i].rawRuleIndex] = null;
      rules.splice(i, 1);
    }
  }
}

export async function loadBlacklists(): Promise<BlacklistAggregation> {
  const { blacklist, subscriptions } = await getOptions('blacklist', 'subscriptions');
  return new BlacklistAggregation(
    blacklist,
    Object.keys(subscriptions).map(id => subscriptions[Number(id)].blacklist),
  );
}

export class BlacklistUpdate extends HTMLElement {
  blacklists: BlacklistAggregation | null = null;
  params: BlacklistUpdateParams | null = null;
  closeParent: (() => void) | null = null;
  $title: HTMLHeadingElement;
  $url: HTMLParagraphElement;
  $added: HTMLTextAreaElement;
  $removed: HTMLTextAreaElement;
  $update: HTMLButtonElement;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>
        ${blacklistUpdateStyle.toString()}
      </style>
      <div id="body">
        <h1 id="title" class="title"></h1>
        <p id="url"></p>
        <details>
          <summary>
            ${chrome.i18n.getMessage('popup_details')}
          </summary>
          <div class="field">
            <label class="label" for="added">
              ${chrome.i18n.getMessage('popup_addedRulesLabel')}
            </label>
            <div class="control">
              <textarea id="added" class="textarea has-fixed-size" rows="2"></textarea>
            </div>
          </div>
          <div class="field">
            <label class="label" for="removed">
              ${chrome.i18n.getMessage('popup_removedRulesLabel')}
            </label>
            <div class="control">
              <textarea id="removed" class="textarea has-fixed-size" readonly rows="2"></textarea>
            </div>
          </div>
        </details>
        <div class="field is-grouped is-grouped-right">
          <div class="control">
            <button id="cancel" class="button has-text-primary">
              ${chrome.i18n.getMessage('cancelButton')}
            </button>
          </div>
          <div class="control">
            <button id="update" class="button is-primary"></button>
          </div>
        </div>
      </div>
    `;
    this.$title = root.getElementById('title') as HTMLHeadingElement;
    this.$url = root.getElementById('url') as HTMLParagraphElement;
    this.$added = root.getElementById('added') as HTMLTextAreaElement;
    this.$removed = root.getElementById('removed') as HTMLTextAreaElement;
    this.$update = root.getElementById('update') as HTMLButtonElement;
    this.$added.addEventListener('input', () => {
      if (this.params) {
        this.$update.disabled = !acceptsAdded(this.params, this.$added.value);
      }
    });
    root.getElementById('cancel')!.addEventListener('click', () => {
      this.closeParent!();
    });
    this.$update.addEventListener('click', () => {
      if (this.params) {
        this.params.added = this.$added.value;
        this.blacklists!.update(this.params);
      }
      this.closeParent!();
    });
  }

  initialize(blacklists: BlacklistAggregation, url: AltURL, closeParent: () => void): void {
    if (/^https?|ftp$/.test(url.toString())) {
      this.blacklists = blacklists;
      this.params = blacklists.preUpdate(url);
      this.closeParent = closeParent;
      this.$title.textContent = chrome.i18n.getMessage(
        this.params!.unblock ? 'popup_unblockSiteTitle' : 'popup_blockSiteTitle',
      );
      this.$url.textContent = url.toString();
      this.$added.value = this.params!.added;
      this.$removed.value = this.params!.removed;
      this.$update.disabled = false;
      this.$update.textContent = chrome.i18n.getMessage(
        this.params!.unblock ? 'popup_unblockSiteButton' : 'popup_blockSiteButton',
      );
    } else {
      this.closeParent = closeParent;
      this.$title.textContent = chrome.i18n.getMessage('popup_blockSiteTitle');
      this.$url.textContent = url.toString();
      this.$added.value = '';
      this.$removed.value = '';
      this.$update.disabled = true;
      this.$update.textContent = chrome.i18n.getMessage('popup_blockSiteButton');
    }
  }
}
