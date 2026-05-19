;(function() {
  'use strict';

  const SDK_NAME = 'show_11025846';

  function waitForSDK(retries = 20) {
    return new Promise((resolve, reject) => {
      function check(n) {
        if (typeof window[SDK_NAME] === 'function') {
          resolve(true);
        } else if (n <= 0) {
          reject(new Error('SDK timeout'));
        } else {
          setTimeout(() => check(n - 1), 500);
        }
      }
      check(retries);
    });
  }

  let interstitialTimer = null;

  function startInterstitialTimer() {
    stopInterstitialTimer();
    interstitialTimer = setInterval(() => {
      showInterstitial();
    }, 30000);
  }

  function stopInterstitialTimer() {
    if (interstitialTimer) {
      clearInterval(interstitialTimer);
      interstitialTimer = null;
    }
  }

  async function showInterstitial() {
    try {
      await waitForSDK(5);
      window[SDK_NAME]({
        type: 'inApp',
        inAppSettings: {
          frequency: 5,
          capping: 0.02,
          interval: 8,
          timeout: 1,
          everyPage: false
        }
      });
    } catch (e) {}
  }

  window.Ads = {
    async rewarded() {
      try {
        await waitForSDK();
        const result = await window[SDK_NAME]();
        return result;
      } catch (e) {
        await new Promise(r => setTimeout(r, 600));
        return 'fallback';
      }
    },

    interstitial() {
      showInterstitial();
    },

    startTimer() {
      startInterstitialTimer();
    },

    stopTimer() {
      stopInterstitialTimer();
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
})();
