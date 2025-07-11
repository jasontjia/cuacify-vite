import { useNavigate } from 'react-router-dom';
import bgImage from './assets/weatherapp.jpg';

function Landing() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white/30 backdrop-blur-xl bg-opacity-80 p-10 rounded-xl shadow-xl text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">🌦️ Selamat Datang di Cuacify!</h1>
        <p className="text-lg mb-6">Pantau cuaca harian dan prakiraan cuaca 5 hari ke depan.</p>
        <div className="flex justify-end">
        <button
          onClick={() => navigate('/weather')}
          className="bg-indigo-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full transition"
        >
          Cek Cuaca
        </button>
        </div>
      </div>
    </div>
  );
}

export default Landing;