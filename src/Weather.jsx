import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
const bgImage = '/weatherapp.jpg';

// Komponen modular
import ThemeToggle from './components/ThemeToggle';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ForecastList from './components/ForecastList';
import FavoriteList from './components/FavoriteList';
import MapView from './components/MapView';
import ChartView from './components/ChartView';
import Footer from './components/Footer';

function Weather() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('metric');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('light');
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('history')) || []);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites')) || []);
  const [localTime, setLocalTime] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);

  const API_KEY = '6129088de3e00d9c898f36844d92c770';

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const saveToHistory = useCallback((name) => {
    setHistory(prev => {
      const updated = [name, ...prev.filter(c => c !== name)].slice(0, 5);
      localStorage.setItem('history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addToFavorites = (name) => {
    if (!favorites.includes(name)) {
      const updated = [...favorites, name];
      setFavorites(updated);
      localStorage.setItem('favorites', JSON.stringify(updated));
    }
  };

  const removeFavorite = (name) => {
    const updated = favorites.filter(c => c !== name);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const fetchWeatherData = useCallback(async (query) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=${unit}`
      );
      setWeather(res.data);
      setCity(res.data.name);
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

  // Lokasi otomatis saat awal
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const { latitude, longitude } = coords;
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

  // Auto-fetch jika unit berubah
  useEffect(() => {
    if (city) fetchWeatherData(city);
  }, [city, unit, fetchWeatherData]);

  // Refresh tiap 5 menit
  useEffect(() => {
    const interval = setInterval(() => {
      if (city) fetchWeatherData(city);
    }, 300000); // 5 menit
    return () => clearInterval(interval);
  }, [city, unit, fetchWeatherData]);

  return (
    <div
      className={`relative min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center px-4 ${
        theme === 'dark' ? 'bg-blue-200 text-white' : ''
      }`}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {showWelcome && (
        <div className="absolute top-10 bg-white bg-opacity-90 text-center text-xl font-semibold px-6 py-3 rounded-xl shadow-lg animate-fadeIn z-50">
          👋 Selamat datang di Cuacify!
        </div>
      )}

      <div className="w-full max-w-xl bg-white/30 backdrop-blur-xl p-6 rounded-xl shadow-xl">
        <div className="flex justify-between items-center mb-3">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          {localTime && (
            <span className="text-sm font-bold text-black">
              🕒 {localTime} (lokal)
            </span>
          )}
        </div>

        <SearchBar city={city} setCity={setCity} handleSearch={handleSearch} />
        <FavoriteList favorites={favorites} handleSearch={handleSearch} />

        {history.length > 0 && (
          <div className="mb-4 text-sm">
            <p className="mb-1 text-gray-600">Riwayat:</p>
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
        )}

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

        <WeatherCard weather={weather} unit={unit} />

        {weather && (
          <div className="text-center mb-4">
            {!favorites.includes(weather.name) ? (
              <button
                onClick={() => addToFavorites(weather.name)}
                className="mt-2 px-4 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full text-sm"
              >
                ⭐ Simpan ke Favorit
              </button>
            ) : (
              <button
                onClick={() => removeFavorite(weather.name)}
                className="mt-2 px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm"
              >
                ❌ Hapus dari Favorit
              </button>
            )}
          </div>
        )}

        <ForecastList forecast={forecast} />
        <MapView coord={weather?.coord} name={weather?.name} />
        <ChartView forecast={forecast} theme={theme} />
        <Footer />
      </div>
    </div>
  );
}

export default Weather;