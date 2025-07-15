document.querySelectorAll('input[name="unit"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const city = document.getElementById('city-input').value.trim();
    if (city) searchWeather();
  });
});

function getSelectedUnit() {
  const unitSelect = document.getElementById('unit-select');
  if (!unitSelect) return 'metric'; // fallback
  return unitSelect.value;
}

