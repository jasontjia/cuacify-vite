import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import bgImage from './assets/weatherapp.png';
import { useNavigate } from 'react-router-dom';

function Weather() {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('metric');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('light');
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('history')) || []);
  const [localTime, setLocalTime] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);

  const API_KEY = '6129088de3e00d9c898f36844d92c770';

  // Hide welcome message after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const saveToHistory = useCallback((name) => {
    setHistory((prevHistory) => {
      const updated = [name, ...prevHistory.filter((c) => c !== name)].slice(0, 5);
      localStorage.setItem('history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const fetchWeatherData = useCallback(async (query) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=${unit}`
      );
      setWeather(res.data);
      saveToHistory(res.data.name);
      setError('');

      const timezoneOffset = res.data.timezone;
      const local = new Date(Date.now() + timezoneOffset * 1000);
      setLocalTime(local.toUTCString().slice(17, 25));

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${API_KEY}&units=${unit}`
      );
      const dailyForecast = forecastRes.data.list.filter((_, i) => i % 8 === 0);
      setForecast(dailyForecast);
    } catch {
      setError('Kota tidak ditemukan atau terjadi kesalahan.');
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  }, [unit, saveToHistory]);

  const handleSearch = (customCity = null) => {
    const target = customCity || city;
    if (!target) return;
    fetchWeatherData(target);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        setLoading(true);
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${unit}`
        );
        setWeather(res.data);
        setCity(res.data.name);
        saveToHistory(res.data.name);

        const timezoneOffset = res.data.timezone;
        const local = new Date(Date.now() + timezoneOffset * 1000);
        setLocalTime(local.toUTCString().slice(17, 25));

        const forecastRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${unit}`
        );
        const dailyForecast = forecastRes.data.list.filter((_, i) => i % 8 === 0);
        setForecast(dailyForecast);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });
  }, [unit, saveToHistory]);

  useEffect(() => {
    if (city) fetchWeatherData(city);
  }, [city, unit, fetchWeatherData]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (city) fetchWeatherData(city);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [city, unit, fetchWeatherData]);

  return (
    <div
      className={`relative min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center px-4 ${
        theme === 'dark' ? 'bg-blue-200 text-white' : ''
      }`}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Selamat Datang */}
      {showWelcome && (
        <div className="absolute top-10 bg-white bg-opacity-90 text-center text-xl font-semibold px-6 py-3 rounded-xl shadow-lg animate-fadeIn z-50">
          👋 Selamat datang di Cuacify!
        </div>
      )}

      {/* Kartu Utama */}
      <div className="w-full max-w-xl bg-blue-300 backdrop-blur-md p-3 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-4">🌤️ Cuacify</h1>

        <div className="flex justify-between items-center mb-3">
          <button
            onClick={toggleTheme}
            className="px-3 py-1 text-sm bg-gray-300 dark:bg-blue-500 rounded-full"
          >
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
          {localTime && (
            <span className="text-sm text-black font-bold">🕒 {localTime} (lokal)</span>
          )}
        </div>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Masukkan nama kota"
            className="flex-1 px-4 py-2 rounded-lg border text-black"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            onClick={() => handleSearch()}
            className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg"
          >
            Cek
          </button>
        </div>

        <div className="mb-4 text-sm">
          {history.length > 0 && <p className="mb-1 text-gray-600">Riwayat:</p>}
          <div className="flex flex-wrap gap-2">
            {history.map((item, i) => (
              <button
                key={i}
                onClick={() => handleSearch(item)}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-3 mb-4">
          <button
            onClick={() => setUnit('metric')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              unit === 'metric' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            °C
          </button>
          <button
            onClick={() => setUnit('imperial')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              unit === 'imperial' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            °F
          </button>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {loading && (
          <div className="flex justify-center mb-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {weather && !loading && (
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-semibold">{weather.name}</h2>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="Cuaca"
              className="mx-auto w-20"
            />
            <p className="capitalize">{weather.weather[0].description}</p>
            <p className="text-3xl font-bold">
              {weather.main.temp}°{unit === 'metric' ? 'C' : 'F'}
            </p>
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-200 text-white px-4 py-2 rounded-full transition"
          >
            Kembali
          </button>
        </div>
        {forecast.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Prakiraan 5 Hari</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-sm">
              {forecast.map((item, i) => (
                <div key={i} className="bg-indigo-500 rounded-lg p-2">
                  <p>{new Date(item.dt_txt).toLocaleDateString()}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                    alt=""
                    className="mx-auto"
                  />
                  <p className="font-bold">{item.main.temp}°</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <p className="mt-6 text-center text-base text-gray-700 font-bold">
          Dibuat oleh <span className="font-bold">JasonXie</span> © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

export default Weather;