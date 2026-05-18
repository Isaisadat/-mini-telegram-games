;(function() {
  'use strict';

  const screens = document.querySelectorAll('.screen');

  function showScreen(id) {
    screens.forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
  }

  document.querySelector('.menu-grid').addEventListener('click', e => {
    const btn = e.target.closest('.menu-btn');
    if (!btn) return;
    showScreen(`game-${btn.dataset.game}`);
  });

  document.querySelectorAll('[data-back]').forEach(el => {
    el.addEventListener('click', () => {
      showScreen('menu-screen');
    });
  });

  document.querySelectorAll('[data-reset]').forEach(el => {
    el.addEventListener('click', () => {
      const game = el.dataset.reset;
      document.dispatchEvent(new CustomEvent('resetGame', { detail: game }));
    });
  });

  showScreen('menu-screen');
})();
