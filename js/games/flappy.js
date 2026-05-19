;(function() {
  'use strict';

  const canvas = document.getElementById('flappy-canvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('flappy-score');
  const adBtn = document.getElementById('flappy-ad-btn');

  const W = 300, H = 400;
  canvas.width = W;
  canvas.height = H;

  let bird, pipes, score, frame, gameLoop, running, started;

  const BIRD_X = 50;
  const GRAVITY = 0.25;
  const JUMP = -5;
  const PIPE_W = 35;
  const PIPE_GAP = 120;
  const PIPE_SPEED = 2;

  function init() {
    if (gameLoop) { cancelAnimationFrame(gameLoop); gameLoop = null; }
    adBtn.classList.add('hidden');
    bird = { y: H/2, vy: 0 };
    pipes = [];
    score = 0;
    frame = 0;
    running = true;
    started = false;
    scoreEl.textContent = '0';
    drawStart();
  }

  function drawStart() {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Flappy Bird', W/2, H/3);
    ctx.font = '14px sans-serif';
    ctx.fillText('Toca para empezar', W/2, H/2);
    ctx.fillText('Toca / Click para volar', W/2, H/2 + 30);
  }

  function startGame() {
    started = true;
    bird.y = H/2;
    bird.vy = 0;
    pipes = [];
    score = 0;
    frame = 0;
    scoreEl.textContent = '0';
    run();
  }

  function run() {
    if (!running) return;
    gameLoop = requestAnimationFrame(run);
    frame++;

    bird.vy += GRAVITY;
    bird.y += bird.vy;

    if (frame % 80 === 0) {
      const pipeY = Math.floor(Math.random() * (H - PIPE_GAP - 60)) + 30;
      pipes.push({ x: W, top: pipeY, bottom: pipeY + PIPE_GAP, passed: false });
    }

    pipes.forEach(p => p.x -= PIPE_SPEED);
    pipes = pipes.filter(p => p.x > -PIPE_W);

    pipes.forEach(p => {
      if (!p.passed && p.x + PIPE_W < BIRD_X) {
        p.passed = true;
        score++;
        scoreEl.textContent = score;
        if (score % 3 === 0) {
          adBtn.textContent = '🎬 Ver anuncio + bonus';
          adBtn.classList.remove('hidden');
        }
      }
    });

    const bx = BIRD_X, by = bird.y, bw = 20, bh = 20;
    if (by < 0 || by + bh > H) gameOver();
    pipes.forEach(p => {
      if (bx < p.x + PIPE_W && bx + bw > p.x) {
        if (by < p.top || by + bh > p.bottom) gameOver();
      }
    });

    draw();
  }

  function draw() {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#4ecdc4';
    ctx.beginPath();
    ctx.arc(BIRD_X, bird.y, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2ecc71';
    pipes.forEach(p => {
      ctx.fillRect(p.x, 0, PIPE_W, p.top);
      ctx.fillRect(p.x, p.bottom, PIPE_W, H - p.bottom);
    });
  }

  function flap() {
    if (!started) { startGame(); return; }
    if (!running) return;
    bird.vy = JUMP;
  }

  function gameOver() {
    running = false;
    cancelAnimationFrame(gameLoop);
    gameLoop = null;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', W/2, H/2 - 10);
    ctx.fillText(`${score} pts`, W/2, H/2 + 20);
    adBtn.textContent = '🎬 Ver anuncio + continuar';
    adBtn.classList.remove('hidden');
  }

  canvas.addEventListener('click', flap);
  canvas.addEventListener('touchend', e => { e.preventDefault(); flap(); });

  document.addEventListener('adReward', e => {
    if (e.detail === 'flappy') {
      adBtn.classList.add('hidden');
      score += 10;
      scoreEl.textContent = score;
      running = true;
      bird.y = H/2;
      bird.vy = -3;
      run();
    }
  });

  document.addEventListener('resetGame', e => {
    if (e.detail === 'flappy') init();
  });

  init();
})();
