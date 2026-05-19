;(function() {
  'use strict';

  const board = document.getElementById('memory-board');
  const movesEl = document.getElementById('memory-moves');
  const pairsEl = document.getElementById('memory-pairs');
  const result = document.getElementById('memory-result');
  const message = document.getElementById('memory-message');
  const adBtn = document.getElementById('memory-ad-btn');

  const emojis = ['🍎','🍊','🍋','🍇','🍓','🍒','🍑','🥝'];
  let cards = [];
  let flipped = [];
  let matched = 0;
  let moves = 0;
  let locked = false;

  function init() {
    cards = [...emojis, ...emojis];
    shuffle(cards);
    flipped = [];
    matched = 0;
    moves = 0;
    locked = false;
    result.classList.add('hidden');
    adBtn.classList.add('hidden');
    updateStats();
    render();
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function render() {
    board.innerHTML = '';
    cards.forEach((emoji, i) => {
      const div = document.createElement('div');
      div.className = 'memory-card';
      div.dataset.index = i;
      if (flipped.includes(i)) {
        div.classList.add('flipped');
        div.textContent = emoji;
      }
      if (cards[i] === null) {
        div.classList.add('matched');
        div.textContent = emoji;
      }
      board.appendChild(div);
    });
  }

  function updateStats() {
    movesEl.textContent = `Movimientos: ${moves}`;
    pairsEl.textContent = `Pares: ${matched}/${emojis.length}`;
  }

  function handleClick(e) {
    const card = e.target.closest('.memory-card');
    if (!card || locked) return;
    const idx = parseInt(card.dataset.index);
    if (cards[idx] === null || flipped.includes(idx)) return;

    if (flipped.length === 2) return;

    flipped.push(idx);
    render();

    if (flipped.length === 2) {
      locked = true;
      moves++;
      updateStats();
      const [a, b] = flipped;
      if (cards[a] === cards[b]) {
        cards[a] = null;
        cards[b] = null;
        matched++;
        updateStats();
        flipped = [];
        locked = false;
        render();
        if (matched === emojis.length) {
          message.textContent = `¡Ganaste en ${moves} movimientos! 🎉`;
          adBtn.classList.remove('hidden');
          result.classList.remove('hidden');
        }
      } else {
        setTimeout(() => {
          flipped = [];
          locked = false;
          render();
        }, 800);
      }
    }
  }

  document.addEventListener('adReward', e => {
    if (e.detail === 'memory') {
      adBtn.classList.add('hidden');
      message.textContent = '¡Bonus activado! +50 puntos 🎉';
    }
  });

  board.addEventListener('click', handleClick);

  document.addEventListener('resetGame', e => {
    if (e.detail === 'memory') init();
  });

  init();
})();
