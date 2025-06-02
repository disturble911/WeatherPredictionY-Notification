const apiKey = 'c368e4da9fea46d1af0132931250106'; // Weather API key

document.addEventListener('DOMContentLoaded', function() {
    // Get elements from the page
    const cityInput = document.getElementById('cityInput');
    const searchButton = document.getElementById('searchButton');
    const cityNameSpan = document.querySelector('.text-2xl.font-bold.text-blue-900');
    const setDefaultButton = document.getElementById('setDefaultButton');
    let defaultCity = localStorage.getItem('defaultCity') || 'Manila';

    // Make forecast start with Sunday
    function getSundayStartForecast(forecastArr) {
        // Find first Sunday in forecast
        let sundayIdx = forecastArr.findIndex(day =>
            new Date(day.date).getDay() === 0
        );
        // If no Sunday, return as is
        if (sundayIdx === -1) return forecastArr;
        // Rotate so Sunday is first
        return forecastArr.slice(sundayIdx).concat(forecastArr.slice(0, sundayIdx));
    }

    // Fetch weather data for a city
    async function fetchWeatherData(cityName) {
        const apiEndpoint = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(cityName)}&days=7`;
        try {
            const response = await fetch(apiEndpoint);
            const weatherData = await response.json();

            // If city not found, show error
            if (weatherData.error) {
                for (let i = 0; i < 7; i++) {
                    document.getElementById('day' + i).innerHTML = `<div class="text-red-600">Error</div>`;
                }
                cityNameSpan.textContent = "City Not Found";
                return;
            }

            // If city found, show weather info
            if (!weatherData.error && weatherData.location && weatherData.location.name) {
                cityNameSpan.textContent = weatherData.location.name;
                saveWeatherToSupabase(weatherData); // Save to database
                addHistoryMessage(`Searched for ${weatherData.location.name}`); // Add to history

                // Make forecast start with Sunday
                const forecastArr = getSundayStartForecast(weatherData.forecast.forecastday);

                // Show forecast for each day
                forecastArr.forEach((day, idx) => {
                    if (idx < 7) {
                        const weekday = new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' });
                        document.getElementById('day' + idx).innerHTML = `
                            <div class="font-semibold mb-2">${weekday}</div>
                            <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" class="mx-auto mb-1">
                            <div class="text-blue-900 font-bold text-xs mb-1">${day.day.condition.text}</div>
                            <div class="text-sm mb-1">Avg: ${day.day.avgtemp_c}°C</div>
                            <div class="text-xs">Humidity: ${day.day.avghumidity}%</div>
                        `;
                    }
                });

                // Save city to history
                saveCityToHistory(weatherData.location.name);

                // Update map to show city location
                if (window.updateMapByCoords && weatherData.location) {
                    window.updateMapByCoords(weatherData.location.lat, weatherData.location.lon);
                }
            }

        } catch (error) {
            // If fetch fails, show error
            for (let i = 0; i < 7; i++) {
                document.getElementById('day' + i).innerHTML = `<div class="text-red-600">Error</div>`;
            }
            cityNameSpan.textContent = "Error";
        }
    }

    // Update map by city name (not used if using coords)
    function updateMap(city) {
        const map = document.getElementById('cityMap');
        if (map) {
            map.src = `https://www.google.com/maps?q=${encodeURIComponent(city)}&output=embed`;
        }
    }

    // Save city to local history (in browser)
    function saveCityToHistory(city) {
        let history = JSON.parse(localStorage.getItem('cityHistory')) || [];
        // Remove duplicates, keep latest at top
        history = history.filter(c => c.toLowerCase() !== city.toLowerCase());
        history.unshift(city);
        localStorage.setItem('cityHistory', JSON.stringify(history));
    }

    // Save weather info to Supabase database
    async function saveWeatherToSupabase(data) {
        if (!window.supabase) {
            console.error("Supabase client not found!");
            return;
        }
        // Check if data is valid
        if (!data || !data.location || !data.current || !data.current.condition) {
            console.error("Weather data missing required fields:", data);
            return;
        }
        const weatherInsert = {
            date_time: new Date().toISOString(),
            location: data.location.name,
            temperature: data.current.temp_c,
            humidity: data.current.humidity,
            condition: data.current.condition.text
        };
        const { data: insertData, error } = await window.supabase
            .from('weather')
            .insert([weatherInsert])
            .select();

        if (error) {
            console.error("Supabase insert error:", error);
        } else {
            console.log("Weather data saved to Supabase!");

            // Notify user about weather
            if (
                insertData &&
                insertData.length > 0
            ) {
                const weather_id = insertData[0].weather_id;
                const user_id = await getCurrentUserId(); // Get user id
                const city = insertData[0].location;
                const condition = insertData[0].condition;
                const message = `Weather update for ${city}: ${condition}`;

                notifyUser(message); // Show notification
                saveNotification({ user_id, weather_id, message }); // Save notification
            }
        }
    }

    // Show weather for default city on page load
    fetchWeatherData(defaultCity);

    // Set default city button
    if (setDefaultButton) {
        setDefaultButton.addEventListener('click', function() {
            const currentCity = cityNameSpan.textContent;
            if (currentCity && currentCity !== "City Not Found" && currentCity !== "Error") {
                localStorage.setItem('defaultCity', currentCity);
                defaultCity = currentCity;
                alert(`Default city set to ${currentCity}`);
            }
        });
    }

    // When search button is clicked
    searchButton.addEventListener('click', function() {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherData(city);
            updateMap(city);
            saveCityToHistory(city);
        }
    });

    // When Enter key is pressed in input
    cityInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const city = cityInput.value.trim();
            if (city) {
                fetchWeatherData(city);
                updateMap(city);
                saveCityToHistory(city);
            }
        }
    });
});

async function getCurrentUserId() {
    const { data, error } = await window.supabase.auth.getUser();
    if (error || !data || !data.user) {
        return null;
    }
    return data.user.id;
}