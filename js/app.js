;(function() {
  'use strict';

  const screens = document.querySelectorAll('.screen');
  let lastScreen = null;

  function showScreen(id) {
    screens.forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');

    if (lastScreen && lastScreen !== 'menu-screen' && id === 'menu-screen') {
      if (window.Ads) window.Ads.interstitial();
    }
    if (id !== 'menu-screen') {
      if (window.Ads) setTimeout(() => window.Ads.interstitial(), 800);
    }
    if (id === 'menu-screen') {
      if (window.Ads) window.Ads.startTimer();
    } else {
      if (window.Ads) window.Ads.stopTimer();
    }
    lastScreen = id;
  }

  function onTap(el, handler) {
    el.addEventListener('click', handler);
    el.addEventListener('touchend', e => {
      if (!e.changedTouches) return;
      const touch = e.changedTouches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (target && (target === el || el.contains(target))) {
        e.preventDefault();
        handler(e);
      }
    });
  }

  document.querySelector('.menu-grid').addEventListener('click', e => {
    const btn = e.target.closest('.menu-btn');
    if (!btn) return;
    if (window.Ads) window.Ads.interstitial();
    showScreen(`game-${btn.dataset.game}`);
  });

  document.querySelector('.menu-grid').addEventListener('touchend', e => {
    const btn = e.target.closest('.menu-btn');
    if (!btn) return;
    if (window.Ads) window.Ads.interstitial();
    showScreen(`game-${btn.dataset.game}`);
  });

  document.querySelectorAll('[data-back]').forEach(el => {
    onTap(el, () => {
      showScreen('menu-screen');
    });
  });

  document.querySelectorAll('[data-reset]').forEach(el => {
    onTap(el, () => {
      const game = el.dataset.reset;
      document.dispatchEvent(new CustomEvent('resetGame', { detail: game }));
      if (window.Ads) setTimeout(() => window.Ads.interstitial(), 400);
    });
  });

  document.querySelectorAll('[data-ad]').forEach(el => {
    onTap(el, async () => {
      const game = el.dataset.ad;
      el.disabled = true;
      el.textContent = 'Cargando...';
      try {
        await Ads.rewarded();
        document.dispatchEvent(new CustomEvent('adReward', { detail: game }));
        if (window.Ads) setTimeout(() => window.Ads.interstitial(), 1000);
      } catch (e) {
        console.log('[Ads] error:', e);
      }
      el.disabled = false;
      el.textContent = '🎬 Ver anuncio + bonus';
    });
  });

  showScreen('menu-screen');

  setTimeout(() => {
    if (window.Ads) {
      window.Ads.interstitial();
      window.Ads.dailyBonus().then(claimed => {
        if (claimed) alert('¡Bonus diario reclamado! 🎉');
      });
    }
  }, 2000);

  setTimeout(() => {
    if (window.Ads) window.Ads.interstitial();
  }, 15000);
})();
