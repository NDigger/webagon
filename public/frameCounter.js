let lastTime = performance.now();
let frameCount = 0;
let fps = 0;

const loop = () => {
  frameCount++;
  const now = performance.now();
  const delta = now - lastTime;

  if (delta >= 1000) {
    fps = (frameCount * 1000) / delta;
    frameCount = 0;
    lastTime = now;
    document.getElementById('fps-counter').textContent = `${'fps:'} ${fps.toFixed(2)}`;
  }

  requestAnimationFrame(loop);
}

loop();