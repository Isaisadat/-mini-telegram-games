;(function() {
  'use strict';

  const SDK_NAME = 'show_11025846';

  function waitForSDK(retries = 20) {
    return new Promise((resolve, reject) => {
      function check(n) {
        if (typeof window[SDK_NAME] === 'function') {
          console.log('[Ads] SDK loaded');
          resolve(true);
        } else if (n <= 0) {
          console.warn('[Ads] SDK not loaded after retries');
          reject(new Error('SDK timeout'));
        } else {
          setTimeout(() => check(n - 1), 500);
        }
      }
      check(retries);
    });
  }

  window.Ads = {
    async rewarded() {
      try {
        await waitForSDK();
        console.log('[Ads] Showing rewarded ad');
        const result = await window[SDK_NAME]();
        console.log('[Ads] Ad completed', result);
        return result;
      } catch (e) {
        console.warn('[Ads] SDK unavailable, using fallback:', e.message);
        await new Promise(r => setTimeout(r, 800));
        return 'fallback';
      }
    },

    async interstitial() {
      try {
        await waitForSDK();
        console.log('[Ads] Showing interstitial');
        window[SDK_NAME]({
          type: 'inApp',
          inAppSettings: {
            frequency: 5,
            capping: 0.03,
            interval: 10,
            timeout: 2,
            everyPage: false
          }
        });
      } catch (e) {
        console.warn('[Ads] Interstitial unavailable:', e.message);
      }
    },

    async dailyBonus() {
      const today = new Date().toDateString();
      const claimed = localStorage.getItem('adDailyBonus');
      if (claimed === today) return false;
      try {
        await this.rewarded();
        localStorage.setItem('adDailyBonus', today);
        return true;
      } catch (e) {
        return false;
      }
    }
  };

  console.log('[Ads] Module ready');
})();
