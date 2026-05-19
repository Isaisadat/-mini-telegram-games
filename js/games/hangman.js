;(function() {
  'use strict';

  const wordEl = document.getElementById('hang-word');
  const lettersEl = document.getElementById('hang-letters');
  const statusEl = document.getElementById('hang-status');
  const drawEl = document.getElementById('hang-draw');
  const result = document.getElementById('hang-result');
  const message = document.getElementById('hang-message');
  const adBtn = document.getElementById('hang-ad-btn');

  const words = ['python','javascript','telegram','juego','programar','computadora','internet','desarrollador','codigo','algoritmo','datos','servidor','aplicacion','ventana','pantalla','teclado','mouse','archivo','usuario','sistema'];
  let word, guessed, wrong, maxWrong = 7, adCount;

  const hangStages = [
    '',
    'O',
    'O\n|',
    'O\n/|',
    'O\n/|\\',
    'O\n/|\\\n/',
    'O\n/|\\\n/ \\'
  ];

  function init() {
    word = words[Math.floor(Math.random() * words.length)].toLowerCase();
    guessed = [];
    wrong = 0;
    adCount = 0;
    adBtn.classList.add('hidden');
    result.classList.add('hidden');
    statusEl.textContent = 'Adivina la palabra';
    render();
  }

  function render() {
    wordEl.textContent = word.split('').map(l => guessed.includes(l) ? l : '_').join(' ');
    drawEl.textContent = hangStages[wrong] || '';
    drawEl.style.whiteSpace = 'pre';
    lettersEl.innerHTML = '';
    for (let i = 97; i <= 122; i++) {
      const l = String.fromCharCode(i);
      const btn = document.createElement('button');
      btn.className = 'hang-letter';
      btn.textContent = l;
      btn.dataset.letter = l;
      if (guessed.includes(l)) {
        btn.disabled = true;
        btn.classList.add(wrong >= 7 || word.split('').every(c => guessed.includes(c)) ? '' : word.includes(l) ? 'correct' : 'wrong');
      }
      lettersEl.appendChild(btn);
    }
  }

  function guess(letter) {
    if (wrong >= maxWrong) return;
    if (guessed.includes(letter)) return;
    guessed.push(letter);

    if (!word.includes(letter)) {
      wrong++;
      adCount++;
    }

    render();

    const won = word.split('').every(l => guessed.includes(l));
    const lost = wrong >= maxWrong;

    if (won) {
      statusEl.textContent = '¡Ganaste! 🎉';
      adBtn.textContent = '🎬 Ver anuncio + bonus';
      adBtn.classList.remove('hidden');
      result.classList.remove('hidden');
      message.textContent = `¡Ganaste! La palabra era: ${word}`;
    } else if (lost) {
      statusEl.textContent = `Perdiste 😅 La palabra era: ${word}`;
      adBtn.textContent = '🎬 Ver anuncio + bonus';
      adBtn.classList.remove('hidden');
      result.classList.remove('hidden');
      message.textContent = `Perdiste. Era: ${word}`;
    } else {
      statusEl.textContent = `${wrong}/${maxWrong} errores`;
    }

    if (adCount >= 3) {
      adBtn.textContent = '🎬 Ver anuncio + bonus';
      adBtn.classList.remove('hidden');
      adCount = 0;
    }
  }

  lettersEl.addEventListener('click', e => {
    const btn = e.target.closest('.hang-letter');
    if (!btn || btn.disabled) return;
    guess(btn.dataset.letter);
  });

  lettersEl.addEventListener('touchend', e => {
    const btn = e.target.closest('.hang-letter');
    if (!btn || btn.disabled) return;
    guess(btn.dataset.letter);
  });

  document.addEventListener('adReward', e => {
    if (e.detail === 'hangman') {
      adBtn.classList.add('hidden');
      result.classList.add('hidden');
      init();
      statusEl.textContent = '¡Bonus! Nueva palabra 🎉';
    }
  });

  document.addEventListener('resetGame', e => {
    if (e.detail === 'hangman') init();
  });

  init();
})();
