;(function() {
  'use strict';

  const board = document.getElementById('g2048-board');
  const scoreEl = document.getElementById('g2048-score');
  const bestEl = document.getElementById('g2048-best');
  const result = document.getElementById('g2048-result');
  const message = document.getElementById('g2048-message');
  const adBtn = document.getElementById('g2048-ad-btn');

  let grid, score, best, gameOver, adCount;

  function init() {
    grid = Array(4).fill().map(() => Array(4).fill(0));
    score = 0;
    gameOver = false;
    adCount = 0;
    result.classList.add('hidden');
    adBtn.classList.add('hidden');
    best = parseInt(localStorage.getItem('g2048best') || '0');
    addRandom();
    addRandom();
    updateScore();
    render();
  }

  function addRandom() {
    const empty = [];
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 4; c++)
        if (grid[r][c] === 0) empty.push({r, c});
    if (!empty.length) return;
    const {r, c} = empty[Math.floor(Math.random() * empty.length)];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  function render() {
    board.innerHTML = '';
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const tile = document.createElement('div');
        tile.className = 'g2048-tile' + (grid[r][c] ? ' tile-' + grid[r][c] : '');
        tile.textContent = grid[r][c] || '';
        board.appendChild(tile);
      }
    }
  }

  function updateScore() {
    scoreEl.textContent = score;
    if (score > best) {
      best = score;
      localStorage.setItem('g2048best', best);
    }
    bestEl.textContent = best;
  }

  function slide(row) {
    let arr = row.filter(v => v);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i+1]) {
        arr[i] *= 2;
        score += arr[i];
        arr.splice(i+1, 1);
      }
    }
    while (arr.length < 4) arr.push(0);
    return arr;
  }

  function move(d) {
    if (gameOver) return;
    const old = JSON.stringify(grid);
    let rotated = false;

    if (d === 'up' || d === 'down') {
      grid = grid[0].map((_, c) => grid.map(r => r[c]));
      rotated = true;
    }

    if (d === 'right' || d === 'down') {
      grid = grid.map(r => r.reverse());
    }

    grid = grid.map(r => slide(r));

    if (d === 'right' || d === 'down') {
      grid = grid.map(r => r.reverse());
    }

    if (rotated) {
      grid = grid[0].map((_, c) => grid.map(r => r[c]));
    }

    if (JSON.stringify(grid) === old) return;

    addRandom();
    updateScore();
    render();

    adCount++;
    if (adCount % 2 === 0) {
      adBtn.textContent = '🎬 Ver anuncio + bonus';
      adBtn.classList.remove('hidden');
    }

    if (checkGameOver()) {
      gameOver = true;
      message.textContent = score >= 2048 ? '¡Ganaste! 🎉' : 'Game Over 😅';
      adBtn.textContent = score >= 2048 ? '🎬 Anuncio + bonus' : '🎬 Anuncio + revancha';
      adBtn.classList.remove('hidden');
      result.classList.remove('hidden');
    }
  }

  function checkGameOver() {
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 4; c++)
        if (grid[r][c] === 0) return false;
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 4; c++) {
        if (c < 3 && grid[r][c] === grid[r][c+1]) return false;
        if (r < 3 && grid[r][c] === grid[r+1][c]) return false;
      }
    return true;
  }

  document.addEventListener('keydown', e => {
    if (e.key.startsWith('Arrow')) {
      e.preventDefault();
      move(e.key.slice(5).toLowerCase());
    }
  });

  let touchStartX, touchStartY;
  board.addEventListener('touchstart', e => {
    const t = e.changedTouches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
  });
  board.addEventListener('touchend', e => {
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) {
      move(dx > 0 ? 'right' : 'left');
    } else {
      move(dy > 0 ? 'down' : 'up');
    }
  });

  document.addEventListener('adReward', e => {
    if (e.detail === '2048') {
      adBtn.classList.add('hidden');
      if (gameOver) {
        init();
      } else {
        score += 100;
        updateScore();
        message.textContent = '¡Bonus +100 puntos! 🎉';
      }
    }
  });

  document.addEventListener('resetGame', e => {
    if (e.detail === '2048') init();
  });

  init();
})();
