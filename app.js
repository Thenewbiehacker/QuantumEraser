// Draws and updates the interactive quantum eraser model using Chart.js.
(() => {
  const canvas = document.getElementById('signal-chart');
  if (!canvas || !window.Chart) return;

  const markingButtons = [...document.querySelectorAll('[data-marking]')];
  const idlerButtons = [...document.querySelectorAll('[data-idler]')];
  const combinedToggle = document.getElementById('combined-toggle');
  const spacingSlider = document.getElementById('spacing-slider');
  const spacingValue = document.getElementById('spacing-value');
  const pointCount = 161;
  const positions = Array.from({ length: pointCount }, (_, i) => -4 + (8 * i) / (pointCount - 1));
  const ink = '#1a2e4a';
  const teal = '#4a9bb8';
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let marking = 'off';
  let idler = 'none';

  const point = (x, y) => ({ x, y });
  const line = (label, values, color, dash = []) => ({
    label,
    data: positions.map((x, i) => point(x, values[i])),
    borderColor: color,
    backgroundColor: color,
    borderWidth: 2.5,
    pointRadius: 0,
    pointHoverRadius: 0,
    tension: .35,
    cubicInterpolationMode: 'monotone',
    borderDash: dash,
    fill: false
  });
  const flat = positions.map(() => 1);

  const chart = new Chart(canvas, {
    type: 'line',
    data: { datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: motionPreference.matches ? 0 : 400, easing: 'easeInOutCubic' },
      parsing: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: true, position: 'top', align: 'end', labels: { color: ink, usePointStyle: true, pointStyle: 'line', boxWidth: 24, padding: 16, font: { family: 'Inter', size: 12 } } },
        tooltip: { enabled: false }
      },
      scales: {
        x: { type: 'linear', min: -4, max: 4, title: { display: true, text: 'Signal photon position (model units)', color: ink, font: { family: 'Inter', size: 12 } }, ticks: { color: ink, maxTicksLimit: 9 }, grid: { color: 'rgba(26,46,74,.10)' } },
        y: { min: 0, max: 2.2, title: { display: true, text: 'Relative coincidence count', color: ink, font: { family: 'Inter', size: 12 } }, ticks: { color: ink, stepSize: .5 }, grid: { color: 'rgba(26,46,74,.12)' } }
      }
    }
  });

  function updateChart() {
    const k = Number(spacingSlider.value);
    spacingValue.value = `k = ${k.toFixed(1)}`;
    spacingValue.textContent = `k = ${k.toFixed(1)}`;
    const fringe = positions.map(x => 1 + Math.cos(k * x));
    const opposite = positions.map(x => 1 - Math.cos(k * x));
    const envelope = positions.map(x => 2 * Math.exp(-0.5 * (x / 1.65) ** 2));
    let datasets;

    if (marking === 'on') {
      datasets = [line('Path marked · smooth envelope', envelope, teal)];
    } else {
      if (idler === 'plus') datasets = [line('Idler +45° subset', fringe, teal)];
      else if (idler === 'minus') datasets = [line('Idler −45° subset', opposite, teal)];
      else if (idler === 'sorted') datasets = [line('+45° subset', fringe, teal), line('−45° subset', opposite, ink, [6, 4])];
      else datasets = [line('No idler sorting · combined', flat, ink)];

      if (combinedToggle.checked && idler !== 'none') datasets.push(line('Combined outcomes · flat sum', flat, teal, [3, 4]));
      if (combinedToggle.checked && idler === 'none') datasets = [line('Combined outcomes · flat sum', flat, teal, [3, 4])];
    }
    chart.data.datasets = datasets;
    chart.options.animation.duration = motionPreference.matches ? 0 : 400;
    chart.update();
  }

  motionPreference.addEventListener?.('change', event => {
    chart.options.animation.duration = event.matches ? 0 : 400;
  });

  markingButtons.forEach(button => button.addEventListener('click', () => {
    marking = button.dataset.marking;
    markingButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    updateChart();
  }));
  idlerButtons.forEach(button => button.addEventListener('click', () => {
    idler = button.dataset.idler;
    idlerButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    updateChart();
  }));
  combinedToggle.addEventListener('change', updateChart);
  spacingSlider.addEventListener('input', updateChart);
  updateChart();
})();
