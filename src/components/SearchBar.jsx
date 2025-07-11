const SearchBar = ({ city, setCity, handleSearch }) => {
  return (
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
        className="bg-blue-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg"
      >
        Cek
      </button>
    </div>
  );
};

export default SearchBar;