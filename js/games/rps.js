;(function() {
  'use strict';

  const playerChoice = document.getElementById('rps-player-choice');
  const pcChoice = document.getElementById('rps-pc-choice');
  const resultText = document.getElementById('rps-result-text');
  const scoreEl = document.getElementById('rps-score');
  const adBtn = document.getElementById('rps-ad-btn');

  const moves = { rock: '🪨', paper: '📄', scissors: '✂️' };
  let playerScore = 0, pcScore = 0, roundCount = 0;

  function init() {
    playerScore = 0;
    pcScore = 0;
    roundCount = 0;
    playerChoice.textContent = '🤚';
    pcChoice.textContent = '🤚';
    resultText.textContent = '¡Elige tu jugada!';
    adBtn.classList.add('hidden');
    updateScore();
  }

  function updateScore() {
    scoreEl.textContent = `Tú: ${playerScore} | PC: ${pcScore}`;
  }

  function getWinner(player, pc) {
    if (player === pc) return 'draw';
    if (
      (player === 'rock' && pc === 'scissors') ||
      (player === 'paper' && pc === 'rock') ||
      (player === 'scissors' && pc === 'paper')
    ) return 'player';
    return 'pc';
  }

  function handleMove(e) {
    const btn = e.target.closest('.rps-btn');
    if (!btn) return;
    const player = btn.dataset.move;

    const pc = Object.keys(moves)[Math.floor(Math.random() * 3)];

    playerChoice.textContent = moves[player];
    pcChoice.textContent = moves[pc];

    const winner = getWinner(player, pc);
    roundCount++;
    if (winner === 'player') {
      playerScore++;
      resultText.textContent = '¡Ganaste! 🎉';
      adBtn.textContent = '🎬 Ver anuncio + bonus';
      adBtn.classList.remove('hidden');
    } else if (winner === 'pc') {
      pcScore++;
      resultText.textContent = 'Perdiste 😅';
      adBtn.textContent = '🎬 Ver anuncio + revancha';
      adBtn.classList.remove('hidden');
    } else {
      resultText.textContent = 'Empate 🤝';
      adBtn.textContent = '🎬 Ver anuncio + bonus';
      adBtn.classList.remove('hidden');
    }
    updateScore();
  }

  document.addEventListener('adReward', e => {
    if (e.detail === 'rps') {
      adBtn.classList.add('hidden');
      playerScore += 5;
      updateScore();
      resultText.textContent = '¡Bonus +5 puntos! 🎉';
    }
  });

  document.querySelector('.rps-buttons').addEventListener('click', handleMove);
  document.querySelector('.rps-buttons').addEventListener('touchend', handleMove);

  document.addEventListener('resetGame', e => {
    if (e.detail === 'rps') init();
  });

  init();
})();
