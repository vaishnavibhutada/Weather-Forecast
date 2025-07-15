function drawForecastChart(forecastData) {
  const labels = forecastData.map(f => f.date);
  const temps = forecastData.map(f => f.temp);

  const canvas = document.getElementById('forecastChart') || document.createElement('canvas');
  canvas.id = 'forecastChart';
  document.querySelector('.forecast').appendChild(canvas);

  new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Temperature (°C)',
        data: temps,
        borderColor: '#63c7f5',
        fill: false
      }]
    }
  });
}
