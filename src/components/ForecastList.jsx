const ForecastList = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Prakiraan 5 Hari</h3>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-sm">
        {forecast.map((item, i) => (
          <div key={i} className="bg-indigo-500 rounded-lg p-2 text-white">
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
  );
};

export default ForecastList;