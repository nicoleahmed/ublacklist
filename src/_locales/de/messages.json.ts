import { exportAsMessages } from "../helpers.ts";

export default exportAsMessages({
  extensionName: "uBlacklist",
  extensionDescription:
    "Blockiert Seiten damit diese nicht in den Suchergebnissen von Google auftauchen",
  lang: "de",
  error: "Fehler: $1",
  unauthorizedError:
    "Nicht autorisiert. Bitte Synchronisation aus- und wieder einschalten.",
  cancelButton: "Abbrechen",
  okButton: "OK",
  content_singleSiteBlocked: "uBlacklist hat eine Seite blockiert",
  content_multipleSitesBlocked: "uBlacklist hat $1 Seiten blockiert",
  content_showBlockedSitesLink: "Anzeigen",
  content_hideBlockedSitesLink: "Ausblenden",
  content_blockSiteLink: "Diese Seite blockieren",
  content_unblockSiteLink: "Diese Seite nicht blockieren",
  popup_blockSiteTitle: "Diese Seite blockieren",
  popup_unblockSiteTitle: "Diese Seite nicht blockieren",
  popup_details: "Details",
  popup_pageURLLabel: "Seiten-URL",
  popup_pathDepth: "Pfadtiefe",
  popup_pageTitleLabel: "Seitentitel",
  popup_addedRulesLabel: "Regeln die hinzugefügt werden",
  popup_removedRulesLabel: "Regeln die entfernt werden",
  popup_blockSiteButton: "Blockieren",
  popup_unblockSiteButton: "Aufheben",
  popup_openOptionsLink: "Optionen",
  popup_active: "uBlacklist ist aktiv",
  popup_inactive: "uBlacklist ist inaktiv",
  popup_activateButton: "Aktivieren",
  options_generalTitle: "Allgemein",
  options_blacklistLabel:
    "Seiten die in den Suchergebnissen von Google blockiert sind",
  options_blacklistHelper:
    "Sie können [Muster](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns) oder [reguläre Ausdrücke](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) verwenden.",
  options_blacklistExample: "Beispiel: $1",
  options_blockByTitle:
    'Um Seiten über deren Seitentitel zu blockieren, müssen Sie "title" vor reguläre Ausdrücke voranstellen.',
  options_blacklistUpdated: "Aktualisiert",
  options_reloadBlacklistButton: "Neu laden",
  options_importBlacklistButton: "Importieren",
  options_exportBlacklistButton: "Exportieren",
  options_saveBlacklistButton: "Speichern",
  options_importBlacklistDialog_title: "Importieren",
  options_importBlacklistDialog_fromFile: "Aus Datei importieren",
  options_importBlacklistDialog_selectFile: "Datei auswählen",
  options_importBlacklistDialog_fromPB:
    "Von persönlicher Sperrliste importieren",
  options_importBlacklistDialog_pbLabel: "Domänen",
  options_importBlacklistDialog_append: "An existierende Liste anhängen",
  options_importBlacklistDialog_importButton: "Importieren",
  options_importBlacklistDialog_helper:
    "Einfügen der von der persönlichen Sperrliste exportierten Domänen.",
  options_otherSearchEngines: "Andere Suchmaschinen",
  options_otherSearchEnginesDescription:
    "Sie können diese Erweiterung auf den nachfolgenden Suchmaschinen verwenden.",
  options_registerSearchEngine: "Aktivieren",
  options_searchEngineRegistered: "Aktiviert",
  options_skipBlockDialogLabel: '"Diese Seite blockieren"-Dialog überspringen',
  options_hideBlockLinksLabel: '"Diese Seite blockieren"-Links ausblenden',
  options_hideControlLabel:
    'Anzahl der blockierten Seiten und den "Anzeigen"-Link ausblenden',
  options_blockWholeSiteLabel:
    "Regeln hinzufügen, komplette Seiten standardmäßig zu blockieren",
  options_blockWholeSiteDescription:
    'Beispiel: Um die Seite "https://a.b.example.uk.com/" zu blockieren, wird die Regel "*://*.example.uk.com/*" hinzugefügt.',
  options_appearanceTitle: "Aussehen",
  options_linkColor: "Die Farbe von Links",
  options_blockColor: "Die Farbe von blockierten Suchergebnissen",
  options_colorUseDefault: "Standard",
  options_colorSpecify: "Benutzerdefiniert",
  options_highlightColors: "Die Farbe von hervorgehobenen Suchergebnissen",
  options_highlightDescription:
    'Um Suchergebnisse mit der Farbe N hervorzuheben, müssen Sie "@N" der Regel voranstellen.',
  options_highlightColorNth: "Farbe $1",
  options_highlightColorAdd: "Hinzufügen",
  options_highlightColorRemove: "Entfernen",
  options_dialogTheme:
    'Das Thema des "Diese Seite blockieren"-Dialog in den Suchergebnissen',
  options_dialogThemeDefault: "Standard",
  options_dialogThemeLight: "Hell",
  options_dialogThemeDark: "Dunkel",
  options_syncTitle: "Synchronisieren",
  options_syncFeatureUpdated:
    'Die Funktion für das Synchronisieren wurde aktualisiert. Um die Synchronisation weiter verwenden zu können, drücken Sie auf "Synchronisation einschalten".',
  options_syncFeature: "Mit Cloud synchronisieren",
  options_syncFeatureDescription:
    "Sie können Ihre Sperrlisten über die Cloud mit all Ihren Geräte synchronisieren.",
  options_turnOnSync: "Synchronisation einschalten",
  options_turnOnSyncDialog_title: "Synchronisation einschalten",
  options_turnOnSyncDialog_turnOnSyncButton: "Einschalten",
  options_turnOnSyncDialog_useAltFlow:
    "Authentifizierungsseite in neuem Tab öffnen",
  options_turnOnSyncDialog_altFlowDescription:
    "Sie werden vor der Authentifizierung möglicherweise nach Berechtigungen für den Zugriff auf $1 geafragt. Ihre persönlichen Daten werden jedoch NICHT unter der Domäne gespeichert.",
  options_turnOnSyncDialog_altFlowAuthCodeLabel: "Autorisationsschlüssel",
  options_turnOffSync: "Ausschalten",
  options_syncResult: "Letzte Synchronisation",
  options_syncNever: "Noch nie synchronisiert",
  options_syncRunning: "Synchronisiere...",
  options_syncReloadButton: "Neu laden",
  options_syncNowButton: "Jetzt synchronisieren",
  options_syncCategories: "Was synchronisiert wird",
  options_syncBlocklist: "Blockierte Seiten",
  options_syncGeneral: "Allgemeine Einstellungen",
  options_syncAppearance: "Aussehen",
  options_syncSubscriptions: "Abonnements",
  options_syncInterval: "Synchronisationsintervall",
  options_subscriptionTitle: "Abonnement",
  options_subscriptionFeature: "Sperrlisten abonnieren",
  options_subscriptionFeatureDescription:
    "Wenn Sie ein Abonnement hinzufügen, werden die Sperrlisten regelmäßig von der festgelegten URL heruntergeladen.",
  options_addSubscriptionButton: "Abonnement hinzufügen",
  options_subscriptionNameHeader: "Name",
  options_subscriptionURLHeader: "URL",
  options_subscriptionUpdateResultHeader: "Letzte Aktualisierung",
  options_subscriptionCheckBoxLabel: "Aktiviert",
  options_subscriptionMenuButtonLabel: "Menü",
  options_noSubscriptionsAdded: "Keine Abonnements hinzugefügt",
  options_subscriptionUpdateRunning: "Aktualisiere...",
  options_showSubscriptionMenu: "Anzeigen",
  options_updateSubscriptionNowMenu: "Jetzt aktualisieren",
  options_removeSubscriptionMenu: "Entfernen",
  options_updateAllSubscriptionsNowButton: "Jetzt aktualisieren",
  options_addSubscriptionDialog_title: "Abonnement hinzufügen",
  options_addSubscriptionDialog_nameLabel: "Name",
  options_addSubscriptionDialog_urlLabel: "URL",
  options_addSubscriptionDialog_addButton: "Hinzufügen",
  options_showSubscriptionDialog_blacklistLabel: "Regeln",
  options_updateInterval: "Aktualisierungsintervall",
  options_backupRestoreTitle: "Sichern und Wiederherstellen",
  options_backupSettingsLabel: "Sicherungseinstellungen",
  options_backupSettingsButton: "Sichern",
  options_restoreSettingsLabel: "Einstellungen wiederherstellen",
  options_restoreSettingsButton: "Wiederherstellen",
  options_restoreSettingsInvalidFile: "Das Dateiformat ist ungültig.",
  options_initializeSettingsLabel: "Einstellungen initialisieren",
  options_initializeSettingsButton: "Initialisieren",
  options_initializeSettingsConfirmation:
    "Wollen Sie die Einstellungen wirklich initialisieren?",
  options_aboutTitle: "Über uBlacklist",
  options_aboutVersion: "Version",
  options_aboutDocumentation: "Dokumentation",
  options_aboutReleaseNotes: "Versionshinweise",
  options_aboutPrivacyPolicy: "Datenschutzbestimmungen",
  options_aboutThirdPartyNotices: "Hinweise von Drittanbietern",
  clouds_googleDriveSync: "Mit Google Drive synchronisieren",
  clouds_googleDriveSyncDescription:
    "Im Datenverzeichnis der Anwendung wird eine vor dem Benutzer versteckte Datei erstellt.",
  clouds_googleDriveSyncTurnedOn: "Mit Google Drive synchronisiert",
  clouds_dropboxSync: "Mit Dropbox synchronisieren",
  clouds_dropboxSyncDescription:
    'Unter "/Apps/uBlacklist/" wird eine Datei erstellt.',
  clouds_dropboxSyncTurnedOn: "Mit Dropbox synchronisiert",
  searchEngines_googleName: "Google",
  searchEngines_bingName: "Bing",
  searchEngines_bingDescription_firefox:
    '"Links aus Suchergebnissen in einem neuen Tab oder Fenster öffnen" deaktivieren.',
  searchEngines_braveName: "Brave",
  searchEngines_duckduckgoName: "DuckDuckGo",
  searchEngines_ecosiaName: "Ecosia",
  searchEngines_kagiName: "Kagi",
  searchEngines_qwantName: "Qwant",
  searchEngines_searxName: "SearX",
  searchEngines_qwantDescription:
    '"Immer Videos auf Qwant.com abspielen" deaktivieren.',
  searchEngines_startpageName: "Startpage.com",
  searchEngines_yahooJapanName: "Yahoo! JAPAN",
  searchEngines_yandexName: "Yandex",
});