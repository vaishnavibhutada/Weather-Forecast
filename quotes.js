const weatherQuotes = {
  Rain: "Let the rain wash away the pain.",
  Clear: "A clear sky is a blank canvas.",
  Clouds: "Even cloudy days can’t dull your shine.",
  Snow: "Every snowflake is a piece of magic.",
  Thunderstorm: "Thunder is just applause from the sky.",
  Drizzle: "Even tiny drops can create ripples.",
  Mist: "A little mist makes the world magical.",
  Fog: "A foggy morning is nature’s poetry.",
  Haze: "Haze softens the view, not your vision.",
  Default: "The sky speaks in all weather."
};

function displayWeatherQuote(condition) {
  const quote = weatherQuotes[condition] || weatherQuotes.Default;
  let quoteDiv = document.getElementById('weather-quote');

  if (!quoteDiv) {
    quoteDiv = document.createElement('div');
    quoteDiv.id = 'weather-quote';
    quoteDiv.style.marginTop = "10px";
    quoteDiv.style.fontStyle = "italic";
    quoteDiv.style.color = "#63c7f5";
    document.querySelector('.weather-info').appendChild(quoteDiv);
  }

  quoteDiv.innerHTML = `<em>"${quote}"</em>`;
}
