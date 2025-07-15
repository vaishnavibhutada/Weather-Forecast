const apiKey = "6cfa9afa7a0516a1689d67eea871f8d1"; // OpenWeather API Key

const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
const oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall';
const newsUrl = 'https://newsapi.org/v2/top-headlines?q=weather&apiKey=YOUR_NEWS_API_KEY'; // Replace this

document.getElementById('search-btn').addEventListener('click', searchWeather);
document.getElementById('refresh-btn').addEventListener('click', refreshWeather);
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
window.addEventListener('load', detectLocation);

let mapInstance;

async function searchWeather() {
  const city = document.getElementById('city-input').value.trim();
  const unit = typeof getSelectedUnit === "function" ? getSelectedUnit() : 'metric';

  if (city === '') {
    alert('Please enter a city name!');
    return;
  }

  try {
    showLoader();

    const weatherResponse = await fetch(`${weatherUrl}?q=${city}&appid=${apiKey}&units=${unit}`);
    const weatherData = await weatherResponse.json();

    if (weatherData.cod === '404') {
      document.getElementById('weather-details').innerHTML = `<p class="placeholder">City not found. Please try again.</p>`;
    } else {
      displayWeatherDetails(weatherData);
      fetchForecast(city, unit);
      fetchWeatherAlerts(weatherData.coord.lat, weatherData.coord.lon);
      fetchWeatherNews();
      initMap(weatherData.coord.lat, weatherData.coord.lon);

      if (typeof saveRecentSearch === "function") saveRecentSearch(city);
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    document.getElementById('weather-details').innerHTML = `<p class="placeholder">Error fetching data. Please try again.</p>`;
  } finally {
    hideLoader();
  }
}
function displayWeatherDetails(data) {
  document.getElementById('weather-details').innerHTML = `
    <p><strong>Weather:</strong> ${data.weather[0].description}</p>
    <p><strong>Temperature:</strong> ${Math.round(data.main.temp)}°C</p>
    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
  `;

  document.getElementById('location-name').textContent = `Weather in ${data.name}`;

  if (typeof displayLocalTime === "function") {
    displayLocalTime(data.timezone);
  }

  if (typeof displayWeatherQuote === "function") {
    displayWeatherQuote(data.weather[0].main);
  }
document.getElementById('location-name').textContent = `Weather in ${data.name}`;

if (typeof displayWeatherQuote === "function") {
  displayWeatherQuote(data.weather[0].main);
}

  if (typeof setBackgroundBasedOnWeather === "function") {
    setBackgroundBasedOnWeather(data.weather[0].main);
  }

  if (typeof speakWeather === "function") {
    const speakBtn = document.createElement('button');
    speakBtn.innerHTML = `<i class="fas fa-volume-up"></i> Speak`;
    speakBtn.onclick = speakWeather;
    document.getElementById('weather-details').appendChild(speakBtn);
  }
}


async function fetchForecast(city, unit = 'metric') {
  try {
    const forecastResponse = await fetch(`${forecastUrl}?q=${city}&appid=${apiKey}&units=${unit}`);
    const forecastData = await forecastResponse.json();
    const forecastCards = document.getElementById('forecast-details');
    forecastCards.innerHTML = '';

    const dailyForecasts = [];
    forecastData.list.forEach(forecast => {
      const forecastDate = new Date(forecast.dt * 1000).toLocaleDateString();
      if (!dailyForecasts.some(item => item.date === forecastDate)) {
        dailyForecasts.push({
          date: forecastDate,
          temp: Math.round(forecast.main.temp),
          description: forecast.weather[0].description,
          icon: forecast.weather[0].icon
        });
      }
    });

    dailyForecasts.slice(0, 5).forEach(forecast => {
      forecastCards.innerHTML += `
        <div class="forecast-card">
          <p>${forecast.date}</p>
          <img src="https://openweathermap.org/img/wn/${forecast.icon}@2x.png" alt="${forecast.description}">
          <p>${forecast.temp}°C</p>
          <p>${forecast.description}</p>
        </div>
      `;
    });

    if (typeof drawForecastChart === "function") {
      drawForecastChart(dailyForecasts.slice(0, 5));
    }
  } catch (error) {
    console.error('Error fetching forecast data:', error);
  }
}

async function fetchWeatherAlerts(lat, lon) {
  try {
    const alertResponse = await fetch(`${oneCallUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    const alertData = await alertResponse.json();
    const alertDiv = document.getElementById('alerts');
    alertDiv.innerHTML = '';

    if (alertData.alerts && alertData.alerts.length > 0) {
      alertDiv.innerHTML = '<h3>Weather Alerts</h3>';
      alertData.alerts.forEach(alert => {
        alertDiv.innerHTML += `<p><strong>${alert.event}:</strong> ${alert.description}</p>`;
        if (typeof notify === "function") {
          notify(alert.event, alert.description);
        }
      });
    } else {
      alertDiv.innerHTML = '<p>No weather alerts for this location.</p>';
    }
  } catch (error) {
    console.error('Error fetching weather alerts:', error);
  }
}

async function fetchWeatherNews() {
  try {
    const newsResponse = await fetch(newsUrl);
    const newsData = await newsResponse.json();
    const newsDiv = document.getElementById('weather-news');
    newsDiv.innerHTML = '';

    newsData.articles.forEach(article => {
      newsDiv.innerHTML += `<p><a href="${article.url}" target="_blank">${article.title}</a></p>`;
    });
  } catch (error) {
    console.error('Error fetching weather news:', error);
  }
}

function initMap(lat, lon) {
  if (mapInstance) {
    mapInstance.remove();
  }

  mapInstance = L.map('map').setView([lat, lon], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapInstance);

  L.marker([lat, lon]).addTo(mapInstance).bindPopup('Weather location').openPopup();
}

function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
  localStorage.setItem('theme', theme);
}

function refreshWeather() {
  const city = document.getElementById('city-input').value.trim();
  if (city) {
    searchWeather();
  } else {
    alert('Please enter a city name first.');
  }
}

async function detectLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      let unit = 'metric';
if (typeof getSelectedUnit === "function") {
  try {
    unit = getSelectedUnit();
  } catch (err) {
    console.warn("getSelectedUnit() failed, falling back to metric.");
  }
}


      try {
        showLoader();
        const weatherResponse = await fetch(`${weatherUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`);
        const weatherData = await weatherResponse.json();
        displayWeatherDetails(weatherData);
        fetchForecast(weatherData.name, unit);
        fetchWeatherAlerts(lat, lon);
        fetchWeatherNews();
        initMap(lat, lon);
      } catch (error) {
        console.error('Error fetching location data:', error);
      } finally {
        hideLoader();
      }
    });
  }
}

function showLoader() {
  const loader = document.getElementById('loader');
  if (loader) loader.classList.remove('hidden');
}

function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader) loader.classList.add('hidden');
}

// Apply saved theme on load
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
  }
});
