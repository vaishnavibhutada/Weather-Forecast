function displayLocalTime(timezoneOffset) {
  // Get current UTC time in milliseconds
  const utcTime = Date.now() + new Date().getTimezoneOffset() * 60000;

  // Add the OpenWeather-provided offset (in seconds → ms)
  const localTime = new Date(utcTime + timezoneOffset * 1000);

  // Format to readable string
  const time = localTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const timeElem = document.getElementById('local-time') || document.createElement('p');
  timeElem.id = 'local-time';
  timeElem.innerHTML = `<strong>Local Time:</strong> ${time}`;
  document.getElementById('weather-details').appendChild(timeElem);
}
