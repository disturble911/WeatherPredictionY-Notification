// This file lets you update the Google Map by city name or coordinates

// Show map for a city name (e.g. "Manila")
function updateMapByCity(city) {
    const map = document.getElementById('cityMap');
    if (map && city) {
        map.src = `https://www.google.com/maps?q=${encodeURIComponent(city)}&output=embed&z=10`;
    }
}

// Show map for specific latitude and longitude
function updateMapByCoords(lat, lon) {
    const map = document.getElementById('cityMap');
    if (map && lat && lon) {
        map.src = `https://www.google.com/maps?q=${lat},${lon}&output=embed&z=10`;
    }
}

// Make these functions available to other scripts
window.updateMapByCity = updateMapByCity;
window.updateMapByCoords = updateMapByCoords;

// When the page loads, show the default city or "Manila"
document.addEventListener('DOMContentLoaded', function() {
    const defaultCity = localStorage.getItem('defaultCity') || 'Manila';
    updateMapByCity(defaultCity);
});