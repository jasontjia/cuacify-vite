const FavoriteList = ({ favorites, handleSearch }) => {
  if (!favorites || favorites.length === 0) return null;

  return (
    <div className="mb-4 text-sm">
      <p className="mb-2 text-yellow-600 font-semibold">⭐ Kota Favorit:</p>
      <div className="flex flex-wrap gap-2">
        {favorites.map((city, i) => (
          <button
            key={i}
            onClick={() => handleSearch(city)}
            className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-900 rounded-full text-xs"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FavoriteList;