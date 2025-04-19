const axios = require("axios");

const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY;

const DEFAULT_COORDS = {
  lat: 40.7128,
  lon: -74.0060,
};

const getWeather = async (req, res) => {
  try {
    const { lat = DEFAULT_COORDS.lat, lon = DEFAULT_COORDS.lon } = req.query;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}&units=imperial`
    );

    const weatherData = response.data;

    const mainCondition = weatherData.weather[0].main.toLowerCase();

    let condition;

    if (mainCondition.includes("cloud")) {
      condition = "clouds";
    } else if (mainCondition.includes("snow")) {
      condition = "snow";
    } else if (weatherData.main.temp <= 40) {
      condition = "cold";
    } else {
      condition = "clear";
    }

    // Check if it's day or night based on sunrise and sunset
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const isDay = currentTime >= weatherData.sys.sunrise && currentTime < weatherData.sys.sunset;

    const result = {
      temp: {
        F: Math.round(weatherData.main.temp),
        C: Math.round(((weatherData.main.temp - 32) * 5) / 9),
      },
      city: weatherData.name,
      condition,
      isDay, // <-- ADDED HERE
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("[GET /weather] Error:", error.message);
    res.status(500).json({ message: "Failed to fetch weather" });
  }
};

module.exports = { getWeather };
