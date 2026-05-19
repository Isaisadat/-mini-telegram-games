;(function() {
  'use strict';

  const pads = document.querySelectorAll('.simon-pad');
  const status = document.getElementById('simon-status');
  const roundEl = document.getElementById('simon-round');
  const startBtn = document.getElementById('simon-start');
  const adBtn = document.getElementById('simon-ad-btn');

  let sequence = [];
  let playerStep = 0;
  let round = 0;
  let playing = false;
  let acceptingInput = false;

  function init() {
    sequence = [];
    playerStep = 0;
    round = 0;
    playing = false;
    acceptingInput = false;
    roundEl.textContent = 'Ronda: 0';
    status.textContent = 'Presiona "Empezar"';
    adBtn.classList.add('hidden');
    pads.forEach(p => p.disabled = true);
  }

  function startGame() {
    init();
    playing = true;
    status.textContent = 'Preparando...';
    nextRound();
  }

  function nextRound() {
    round++;
    roundEl.textContent = `Ronda: ${round}`;
    playerStep = 0;
    acceptingInput = false;

    const next = Math.floor(Math.random() * 4);
    sequence.push(next);

    playSequence();

    if (round > 0 && round % 3 === 0) {
      adBtn.textContent = '🎬 Ver anuncio + bonus';
      adBtn.classList.remove('hidden');
    }
  }

  function playSequence() {
    pads.forEach(p => p.disabled = true);
    status.textContent = 'Observa...';

    let i = 0;
    const interval = setInterval(() => {
      if (i > 0) {
        pads[sequence[i-1]].classList.remove('lit');
      }
      if (i < sequence.length) {
        pads[sequence[i]].classList.add('lit');
        i++;
      } else {
        clearInterval(interval);
        pads[sequence[sequence.length-1]].classList.remove('lit');
        acceptingInput = true;
        pads.forEach(p => p.disabled = false);
        status.textContent = 'Tu turno';
      }
    }, 600);
  }

  function handlePadClick(e) {
    const pad = e.target.closest('.simon-pad');
    if (!pad || !acceptingInput) return;

    const idx = parseInt(pad.dataset.color);
    pad.classList.add('lit');
    setTimeout(() => pad.classList.remove('lit'), 200);

    if (idx !== sequence[playerStep]) {
      pads.forEach(p => p.disabled = true);
      acceptingInput = false;
      status.textContent = `Perdiste en ronda ${round} 😅`;
      adBtn.textContent = '🎬 Ver anuncio + continuar';
      adBtn.classList.remove('hidden');
      return;
    }

    playerStep++;
    if (playerStep === sequence.length) {
      pads.forEach(p => p.disabled = true);
      acceptingInput = false;
      status.textContent = '¡Correcto!';
      setTimeout(nextRound, 800);
    }
  }

  document.addEventListener('adReward', e => {
    if (e.detail === 'simon') {
      adBtn.classList.add('hidden');
      round += 3;
      roundEl.textContent = `Ronda: ${round}`;
      status.textContent = '¡Bonus +3 rondas! 🎉';
      acceptingInput = true;
      pads.forEach(p => p.disabled = false);
    }
  });

  pads.forEach(p => {
    p.addEventListener('click', handlePadClick);
    p.addEventListener('touchend', handlePadClick);
  });
  startBtn.addEventListener('click', startGame);
  startBtn.addEventListener('touchend', startGame);

  document.addEventListener('resetGame', e => {
    if (e.detail === 'simon') init();
  });

  init();
})();
