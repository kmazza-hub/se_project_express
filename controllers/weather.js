const axios = require('axios');
const BadRequestError = require('../errors/BadRequestError.js');

const { OPEN_WEATHER_API_KEY } = process.env;

const DEFAULT_COORDS = {
  lat: 40.7128,
  lon: -74.006,
};

const getWeather = async (req, res, next) => {
  try {
    const { lat = DEFAULT_COORDS.lat, lon = DEFAULT_COORDS.lon } = req.query;

    if (!OPEN_WEATHER_API_KEY) {
      return next(
        new BadRequestError('Missing OpenWeather API key in environment variables'),
      );
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}&units=imperial`,
    );

    const weatherData = response.data;
    const mainCondition = weatherData.weather[0].main.toLowerCase();

    let condition;
    if (mainCondition.includes('cloud')) {
      condition = 'clouds';
    } else if (mainCondition.includes('snow')) {
      condition = 'snow';
    } else if (weatherData.main.temp <= 40) {
      condition = 'cold';
    } else {
      condition = 'clear';
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const isDay = currentTime >= weatherData.sys.sunrise && currentTime < weatherData.sys.sunset;

    const result = {
      temp: {
        F: Math.round(weatherData.main.temp),
        C: Math.round(((weatherData.main.temp - 32) * 5) / 9),
      },
      city: weatherData.name,
      condition,
      isDay,
    };

    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
};

module.exports = { getWeather };
