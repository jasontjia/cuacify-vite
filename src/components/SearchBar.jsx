import { useState, useEffect } from 'react';
import axios from 'axios';

const SearchBar = ({ setCity, handleSearch }) => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loadingCities, setLoadingCities] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Ambil daftar negara saat pertama kali
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
        setErrorMsg('Gagal mengambil daftar negara.');
      }
    };

    fetchCountries();
  }, []);

  // Ambil kota ketika tombol ditekan
  const handleGetCities = async () => {
    if (!selectedCountry) return;
    setLoadingCities(true);
    setCities([]);
    try {
      const res = await axios.post('https://countriesnow.space/api/v0.1/countries/cities', {
        country: selectedCountry,
      });
      setCities(res.data.data);
      setErrorMsg('');
    } catch (err) {
      console.error('Gagal mengambil kota:', err);
      setErrorMsg('Negara tidak ditemukan. Pastikan penulisan sesuai daftar.');
    } finally {
      setLoadingCities(false);
    }
  };

  const handleSubmit = () => {
    if (selectedCity) {
      setCity(selectedCity);
      handleSearch(selectedCity);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4 w-full">
        {/* Input Negara */}
        <div className="w-full sm:w-[30%]">
          <input
            list="negara-list"
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              setSelectedCity('');
              setCities([]);
            }}
            placeholder="Ketik atau pilih negara"
            className="w-full px-4 py-2 rounded-lg border text-black"
          />
          <datalist id="negara-list">
            {countries.map((name, i) => (
              <option key={i} value={name} />
            ))}
          </datalist>
        </div>

        {/* Tombol Ambil Kota */}
        <button
          onClick={handleGetCities}
          disabled={!selectedCountry}
          className="w-full sm:w-[20%] bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Simpan
        </button>

        {/* Input Kota */}
        <div className="w-full sm:w-[30%]">
          <input
            list="kota-list"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            placeholder={loadingCities ? 'Memuat kota...' : 'Ketik atau pilih kota'}
            disabled={cities.length === 0}
            className="w-full px-4 py-2 rounded-lg border text-black"
          />
          <datalist id="kota-list">
            {cities.map((city, i) => (
              <option key={i} value={city} />
            ))}
          </datalist>
        </div>

        {/* Tombol Cek */}
        <button
          onClick={handleSubmit}
          disabled={!selectedCity}
          className="w-full sm:w-[20%] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Cek
        </button>
      </div>

      {/* Error Message */}
      {errorMsg && <p className="text-red-600 text-sm mt-1">{errorMsg}</p>}
    </>
  );
};

export default SearchBar;
