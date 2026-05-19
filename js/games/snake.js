;(function() {
  'use strict';

  const canvas = document.getElementById('snake-canvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('snake-score');
  const adBtn = document.getElementById('snake-ad-btn');

  const SIZE = 20;
  const COLS = 15;
  const ROWS = 15;
  let snake, dir, nextDir, food, score, gameLoop, running;

  function init() {
    if (gameLoop) { clearInterval(gameLoop); gameLoop = null; }
    adBtn.classList.add('hidden');
    snake = [{x: 7, y: 7}];
    dir = {x: 1, y: 0};
    nextDir = {x: 1, y: 0};
    score = 0;
    running = true;
    scoreEl.textContent = '0';
    spawnFood();
    draw();
    startLoop();
  }

  function startLoop() {
    gameLoop = setInterval(() => {
      if (!running) return;
      dir = {...nextDir};
      const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};

      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
        gameOver();
        return;
      }
      if (snake.some(s => s.x === head.x && s.y === head.y)) {
        gameOver();
        return;
      }

      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score++;
        scoreEl.textContent = score;
        spawnFood();
      } else {
        snake.pop();
      }

      draw();
    }, 150);
  }

  function spawnFood() {
    let pos;
    do {
      pos = {x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS)};
    } while (snake.some(s => s.x === pos.x && s.y === pos.y));
    food = pos;
  }

  function draw() {
    ctx.fillStyle = 'var(--secondary, #16213e)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#4ecdc4';
    snake.forEach((s, i) => {
      ctx.fillRect(s.x * SIZE, s.y * SIZE, SIZE - 1, SIZE - 1);
    });

    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(food.x * SIZE, food.y * SIZE, SIZE - 1, SIZE - 1);
  }

  function gameOver() {
    running = false;
    clearInterval(gameLoop);
    gameLoop = null;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Game Over - ${score} pts`, canvas.width/2, canvas.height/2);
    adBtn.textContent = '🎬 Ver anuncio + continuar';
    adBtn.classList.remove('hidden');
  }

  document.addEventListener('adReward', e => {
    if (e.detail === 'snake') {
      adBtn.classList.add('hidden');
      score += 5;
      scoreEl.textContent = score;
      running = true;
      startLoop();
    }
  });

  function setDirection(dx, dy) {
    if (dir.x + dx === 0 && dir.y + dy === 0) return;
    nextDir = {x: dx, y: dy};
  }

  document.addEventListener('keydown', e => {
    switch(e.key) {
      case 'ArrowUp': e.preventDefault(); setDirection(0, -1); break;
      case 'ArrowDown': e.preventDefault(); setDirection(0, 1); break;
      case 'ArrowLeft': e.preventDefault(); setDirection(-1, 0); break;
      case 'ArrowRight': e.preventDefault(); setDirection(1, 0); break;
    }
  });

  document.querySelectorAll('.dir-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switch(btn.dataset.dir) {
        case 'up': setDirection(0, -1); break;
        case 'down': setDirection(0, 1); break;
        case 'left': setDirection(-1, 0); break;
        case 'right': setDirection(1, 0); break;
      }
    });
    btn.addEventListener('touchend', e => {
      e.preventDefault();
      switch(btn.dataset.dir) {
        case 'up': setDirection(0, -1); break;
        case 'down': setDirection(0, 1); break;
        case 'left': setDirection(-1, 0); break;
        case 'right': setDirection(1, 0); break;
      }
    });
  });

  document.addEventListener('resetGame', e => {
    if (e.detail === 'snake') init();
  });

  init();
})();
