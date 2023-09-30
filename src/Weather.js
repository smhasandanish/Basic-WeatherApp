import React, { useState, useEffect } from 'react';
import './Weather.css';
import weatherAnimation from './hot.gif';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null); // Store user's location
  const openWeatherApiKey = 'f632b13e2138c9c7a86755159c5dfdff'; // Replace with your OpenWeatherMap API key

  const weatherIcons = {
    // ... (your weather icons mapping here)
    '01d': 'clear-day.png',
    '01n': 'clear-night.png',
    '02d': 'partly-cloudy-day.png',
    '02n': 'partly-cloudy-night.png',
    '03d': 'cloudy.png',
    '03n': 'cloudy.png',
    '04d': 'cloudy.png',
    '04n': 'cloudy.png',
    '09d': 'rain.png',
    '09n': 'rain.png',
    '10d': 'rain.png',
    '10n': 'rain.png',
    '11d': 'thunderstorm.png',
    '11n': 'thunderstorm.png',
    '13d': 'snow.png',
    '13n': 'snow.png',
    '50d': 'mist.png',
    '50n': 'mist.png',
  };

  // Function to fetch weather data based on the provided city name
  const fetchWeatherByCity = async (cityName) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${openWeatherApiKey}`
      );
      if (!response.ok) {
        throw new Error('Weather data not found.');
      }
      const data = await response.json();
      setWeatherData(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError(error);
      setIsLoading(false);
    }
  };

  // Function to fetch weather data based on the user's location
  const fetchWeatherByLocation = async () => {
    if (userLocation) {
      const { latitude, longitude } = userLocation;
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${openWeatherApiKey}`
        );
        if (!response.ok) {
          throw new Error('Weather data not found.');
        }
        const data = await response.json();
        setWeatherData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setError(error);
        setIsLoading(false);
      }
    }
  };

  // Use useEffect to fetch weather data when the component mounts and when the user's location changes
  useEffect(() => {
    if (userLocation) {
      fetchWeatherByLocation();
    }
  }, [userLocation]);

  const handleCityChange = (event) => {
    const selectedCity = event.target.value;
    setCity(selectedCity);
  };

  const handleSearch = () => {
    if (city) {
      fetchWeatherByCity(city);
    }
  };

  const handleUseLocation = () => {
    // Check if geolocation is available in the browser
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      });
    } else {
      alert('Geolocation is not available in your browser.');
    }
  };

  return (
    <div className="weather-container">
      <h1>TempVerse</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter a City"
          value={city}
          onChange={handleCityChange}
        />
        <button onClick={handleSearch}>Get Weather</button>
        <button onClick={handleUseLocation}>Use My Location</button>
      </div>
      {isLoading && <p>Loading weather data...</p>}
      {error && <p>Error: {error.message}</p>}
      {weatherData && !isLoading && (
        <div>
          <h2 className="city-name">Current Weather in {weatherData.name}</h2>
          <p className="temperature"> {weatherData.main.temp}°C</p>
          <p className="weather-description"> {weatherData.weather[0].description}</p>
          {weatherIcons[weatherData.weather[0].icon] && (
            <img
              src={require(`./weather-icons/${weatherIcons[weatherData.weather[0].icon]}`)}
              alt={weatherData.weather[0].description}
              className="weather-icon"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Weather;
