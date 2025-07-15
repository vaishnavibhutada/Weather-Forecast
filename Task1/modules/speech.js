function speakWeather() {
  const text = document.getElementById('weather-details').innerText;
  const utterance = new SpeechSynthesisUtterance(text);

  // Wait until voices are loaded
  const voices = window.speechSynthesis.getVoices();

  // Try to pick a warm female voice
  const preferredVoices = voices.filter(voice =>
    /female|zira|samantha|Google UK English Female/i.test(voice.name)
  );

  // Fallback: pick the first available female-sounding voice
  utterance.voice = preferredVoices.length > 0 ? preferredVoices[0] : voices[0];

  utterance.pitch = 1.2; // Slightly higher pitch for warmth
  utterance.rate = 0.95; // Slightly slower for clarity

  speechSynthesis.speak(utterance);
}

// Add speak button only once
if (!document.getElementById('speak-btn')) {
  const speakBtn = document.createElement('button');
  speakBtn.id = 'speak-btn';
  speakBtn.innerHTML = `<i class="fas fa-volume-up"></i> Speak`;
  speakBtn.onclick = speakWeather;
  document.getElementById('weather-details').appendChild(speakBtn);
}

// Ensure voices are loaded properly before speaking
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = () => {
    // Voices will now be loaded and `getVoices()` will work properly.
  };
}
