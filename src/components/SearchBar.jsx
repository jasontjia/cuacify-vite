import { useState, useEffect } from 'react';
import axios from 'axios';

const SearchBar = ({ setCity, handleSearch }) => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loadingCities, setLoadingCities] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Ambil daftar negara
  useEffect(() => {
    const cached = localStorage.getItem('cn_countries');
    if (cached) {
      setCountries(JSON.parse(cached));
      return;
    }

    const fetchCountries = async () => {
      try {
        const res = await axios.get('https://countriesnow.space/api/v0.1/countries');
        const countryList = res.data.data.map(item => item.country);
        setCountries(countryList);
        localStorage.setItem('cn_countries', JSON.stringify(countryList));
        setErrorMsg('');
      } catch (err) {
        console.error('Gagal mengambil negara:', err);
        setErrorMsg('Gagal mengambil daftar negara. Silakan coba lagi.');
      }
    };

    fetchCountries();
  }, []);

  // Ambil daftar kota dari negara
  useEffect(() => {
    if (!selectedCountry) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const res = await axios.post('https://countriesnow.space/api/v0.1/countries/cities', {
          country: selectedCountry,
        });
        setCities(res.data.data);
        setErrorMsg('');
      } catch (err) {
        console.error('Gagal mengambil kota:', err);
        setErrorMsg('Gagal mengambil daftar kota.');
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [selectedCountry]);

  // Reset error saat input berubah
  useEffect(() => {
    setErrorMsg('');
  }, [selectedCountry, selectedCity]);

  const handleSubmit = () => {
    if (selectedCity) {
      setCity(selectedCity);
      handleSearch(selectedCity);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2 w-full mb-4">
        {/* Dropdown Negara */}
        <select
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setSelectedCity('');
            setCities([]);
          }}
          className="w-full sm:w-[35%] px-4 py-2 rounded-lg border text-black"
        >
          <option value="">Pilih Negara</option>
          {countries.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        {/* Dropdown Kota */}
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          disabled={!selectedCountry || loadingCities}
          className="w-full sm:w-[45%] px-4 py-2 rounded-lg border text-black"
        >
          <option value="">
            {loadingCities ? 'Memuat kota...' : 'Pilih Kota'}
          </option>
          {cities.map((city, i) => (
            <option key={i} value={city}>
              {city}
            </option>
          ))}
        </select>

        {/* Tombol */}
        <button
          onClick={handleSubmit}
          disabled={!selectedCity}
          className="w-full sm:w-[20%] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Cek
        </button>
      </div>

      {errorMsg && (
        <p className="text-red-600 text-sm mt-1">{errorMsg}</p>
      )}
    </>
  );
};

export default SearchBar;