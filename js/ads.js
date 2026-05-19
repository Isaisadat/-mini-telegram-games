;(function() {
  'use strict';

  window.Ads = {
    rewarded() {
      if (typeof show_11025846 !== 'function') {
        return Promise.reject('SDK not loaded');
      }
      return show_11025846();
    },

    interstitial() {
      if (typeof show_11025846 !== 'function') return;
      show_11025846({
        type: 'inApp',
        inAppSettings: {
          frequency: 2,
          capping: 0.1,
          interval: 30,
          timeout: 5,
          everyPage: false
        }
      });
    }
  };
})();
