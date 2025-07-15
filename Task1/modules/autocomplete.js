const cityInput = document.getElementById('city-input');

cityInput.addEventListener('input', async () => {
  const value = cityInput.value.trim();
  if (value.length < 3) return;

  const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${apiKey}`);
  const cities = await response.json();

  const datalist = document.getElementById('city-list') || document.createElement('datalist');
  datalist.id = 'city-list';
  cityInput.setAttribute('list', 'city-list');
  datalist.innerHTML = '';

  cities.forEach(city => {
    const option = document.createElement('option');
    option.value = `${city.name}, ${city.country}`;
    datalist.appendChild(option);
  });

  document.body.appendChild(datalist);
});
