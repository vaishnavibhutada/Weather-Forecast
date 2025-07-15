function saveRecentSearch(city) {
  let cities = JSON.parse(localStorage.getItem('recentCities') || '[]');
  cities = [city, ...cities.filter(c => c !== city)].slice(0, 5);
  localStorage.setItem('recentCities', JSON.stringify(cities));
  displayRecentSearches();
}

function displayRecentSearches() {
  const section = document.getElementById('recent-searches') || document.createElement('div');
  section.id = 'recent-searches';
  section.innerHTML = `<h4>Recent Searches</h4>`;
  const cities = JSON.parse(localStorage.getItem('recentCities') || '[]');
  cities.forEach(city => {
    const btn = document.createElement('button');
    btn.textContent = city;
    btn.onclick = () => {
      document.getElementById('city-input').value = city;
      searchWeather();
    };
    section.appendChild(btn);
  });
  document.querySelector('.container').appendChild(section);
}

window.addEventListener('load', displayRecentSearches);
