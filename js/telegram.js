;(function() {
  const tg = window.Telegram = window.Telegram || {};

  tg.WebApp = tg.WebApp || {};

  if (tg.WebApp.initData) {
    tg.WebApp.ready();
    tg.WebApp.expand();
  }

  document.documentElement.style.setProperty('--tg-theme-bg-color', tg.WebApp.backgroundColor || '#1a1a2e');
  document.documentElement.style.setProperty('--tg-theme-text-color', tg.WebApp.textColor || '#eee');
  document.documentElement.style.setProperty('--tg-theme-hint-color', tg.WebApp.hintColor || '#888');
  document.documentElement.style.setProperty('--tg-theme-button-color', tg.WebApp.buttonColor || '#2ea6ff');
  document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.WebApp.buttonTextColor || '#fff');
  document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', tg.WebApp.secondaryBackgroundColor || '#16213e');

  window.isTelegram = !!tg.WebApp.initData;
})();
