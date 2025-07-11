const WeatherCard = ({ weather, unit }) => {
  if (!weather) return null;

  return (
    <div className="text-center mb-3 space-y-1">
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
  );
};

export default WeatherCard;