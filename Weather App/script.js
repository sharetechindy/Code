let isCelsius = true;

function toggleUnit() {
  isCelsius = !isCelsius;
  const city = document.getElementById("cityInput").value;
  const state = document.getElementById("stateInput").value;
  if (city && state) {
    getweather();
  }
}

const validStates = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
   "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
     "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
      "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

function isValidState(state) {
  return validStates.includes(state.toUpperCase());
}

function getweather() {
  const apikey = "0238331e95e17f774e7800c01cc78a04";
  const city = document.getElementById("cityInput").value;
  const state = document.getElementById("stateInput").value;

  if (!city || !state) {
    alert("Please enter both city and state/province.");
    return;
  }

  if (!isValidState(state)) {
    alert("Please enter a valid state abbreviation.");
    return;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},US&appid=${apikey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${state},US&appid=${apikey}`;

  fetch(currentWeatherUrl)
    .then((response) => response.json())
    .then((data) => {
      displayWeather(data);
      updateRadarMap(data.coord.lat, data.coord.lon);
    })
    .catch((error) => {
      console.error("Error fetching current weather data:", error);
      alert("Error fetching current weather data. Please try again.");
    });

  fetch(forecastUrl)
    .then((response) => response.json())
    .then((data) => {
      displayHourlyForecast(data.list);
    })
    .catch((error) => {
      console.error("Error fetching hourly forecast data:", error);
      alert("Error fetching hourly forecast data. Please try again.");
    });
}

let map;
let radarLayer;

function initRadarMap() {
  map = L.map('radar-map').setView([39.8283, -98.5795], 4); // Centered on the US

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  radarLayer = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apikey}`, {
    attribution: '© <a href="https://openweathermap.org/">OpenWeatherMap</a>'
  });

  radarLayer.addTo(map);
}

function updateRadarMap(lat, lon) {
  map.setView([lat, lon], 10);
}

function displayWeather(data) {
  const tempDivInfo = document.getElementById("temp-div");
  const weatherInfoDiv = document.getElementById("weather-info");
  const weatherIcon = document.getElementById("weather-icon");
  const hourlyForecastDiv = document.getElementById("hourly-forecast");

  // Clear previous content
  weatherInfoDiv.innerHTML = "";
  hourlyForecastDiv.innerHTML = "";
  tempDivInfo.innerHTML = "";

  if (data.cod === "404") {
    weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
  } else {
    const cityName = data.name;
    const temperature = isCelsius
      ? Math.round(data.main.temp - 273.15)
      : Math.round((data.main.temp - 273.15) * 9/5 + 32);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    const temperatureHTML = `<p>${temperature}°${isCelsius ? 'C' : 'F'}</p>`;
    const weatherHTML = `<p>${cityName}</p><p>${description}</p>`;

    tempDivInfo.innerHTML = temperatureHTML;
    weatherInfoDiv.innerHTML = weatherHTML;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;

    showImage();
  }
}

function displayHourlyForecast(hourlyData) {
  const hourlyForecastDiv = document.getElementById("hourly-forecast");
  const next24Hours = hourlyData.slice(0, 8);

  next24Hours.forEach((item) => {
    const dateTime = new Date(item.dt * 1000);
    const hour = dateTime.getHours();
    const temperature = isCelsius
      ? Math.round(item.main.temp - 273.15)
      : Math.round((item.main.temp - 273.15) * 9/5 + 32);
    const iconCode = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
    const hourlyItemHtml = `
      <div class="hourly-item">
        <span>${hour}:00</span>
        <img src="${iconUrl}" alt="Hourly Weather Icon">
        <span>${temperature}°${isCelsius ? 'C' : 'F'}</span>
      </div>`;
    
    hourlyForecastDiv.innerHTML += hourlyItemHtml;
  });
}

function showImage() {
  const weatherIcon = document.getElementById('weather-icon');
  weatherIcon.style.display = 'block';
}

// Initialize the radar map when the page loads
initRadarMap();
