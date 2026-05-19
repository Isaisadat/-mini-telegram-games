;(function() {
  'use strict';

  const board = document.getElementById('ttt-board');
  const status = document.getElementById('ttt-status');
  const result = document.getElementById('ttt-result');
  const message = document.getElementById('ttt-message');
  const adBtn = document.getElementById('ttt-ad-btn');

  let state = Array(9).fill(null);
  let isPlayerTurn = true;
  let gameOver = false;

  function init() {
    state = Array(9).fill(null);
    isPlayerTurn = true;
    gameOver = false;
    result.classList.add('hidden');
    adBtn.classList.add('hidden');
    status.textContent = 'Tu turno (X)';
    render();
  }

  function render() {
    const cells = board.querySelectorAll('.cell');
    cells.forEach((cell, i) => {
      cell.textContent = state[i] || '';
      cell.className = 'cell' + (state[i] ? ' taken' : '') + (state[i] === 'X' ? ' x' : state[i] === 'O' ? ' o' : '');
    });
  }

  function checkWinner(s) {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (const [a,b,c] of lines) {
      if (s[a] && s[a] === s[b] && s[a] === s[c]) return s[a];
    }
    if (s.every(v => v)) return 'draw';
    return null;
  }

  function handleClick(e) {
    const cell = e.target.closest('.cell');
    if (!cell || !cell.dataset.index) return;
    const idx = parseInt(cell.dataset.index);
    if (state[idx] || !isPlayerTurn || gameOver) return;

    state[idx] = 'X';
    render();

    const winner = checkWinner(state);
    if (winner) {
      gameOver = true;
      showResult(winner);
      return;
    }

    isPlayerTurn = false;
    status.textContent = 'Pensando...';
    setTimeout(aiMove, 400);
  }

  function aiMove() {
    if (gameOver) return;
    const empty = state.map((v, i) => v === null ? i : null).filter(v => v !== null);
    if (empty.length === 0) return;

    const idx = smartMove(empty);
    state[idx] = 'O';
    render();

    const winner = checkWinner(state);
    if (winner) {
      gameOver = true;
      showResult(winner);
      return;
    }

    isPlayerTurn = true;
    status.textContent = 'Tu turno (X)';
  }

  function smartMove(empty) {
    for (const i of empty) {
      const s = [...state]; s[i] = 'O';
      if (checkWinner(s) === 'O') return i;
    }
    const center = 4;
    if (empty.includes(center)) return center;
    const corners = [0,2,6,8].filter(i => empty.includes(i));
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
    return empty[Math.floor(Math.random() * empty.length)];
  }

  function showResult(winner) {
    if (winner === 'X') {
      message.textContent = '¡Ganaste! 🎉';
      adBtn.textContent = '🎬 Ver anuncio + bonus';
      adBtn.classList.remove('hidden');
    } else if (winner === 'O') {
      message.textContent = 'Perdiste 😅';
      adBtn.textContent = '🎬 Ver anuncio + revancha';
      adBtn.classList.remove('hidden');
    } else {
      message.textContent = 'Empate 🤝';
      adBtn.textContent = '🎬 Ver anuncio + bonus';
      adBtn.classList.remove('hidden');
    }
    result.classList.remove('hidden');
  }

  document.addEventListener('adReward', e => {
    if (e.detail === 'tictactoe') {
      adBtn.classList.add('hidden');
      message.textContent = '¡Bonus activado! +100 puntos 🎉';
      setTimeout(init, 1500);
    }
  });

  board.addEventListener('click', handleClick);
  board.addEventListener('touchend', handleClick);

  document.addEventListener('resetGame', e => {
    if (e.detail === 'tictactoe') init();
  });

  init();
})();
