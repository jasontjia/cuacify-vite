import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-6 flex justify-between items-center">
      <p className="text-sm text-gray-800 font-bold">
        Dibuat oleh <span className="font-semibold">JasonXie</span> © {new Date().getFullYear()}
      </p>
      <button
        onClick={() => navigate('/')}
        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full transition font-medium"
      >
        Kembali
      </button>
    </div>
  );
};

export default Footer;