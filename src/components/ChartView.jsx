import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  Filler, // ✅ Penting untuk fitur `fill`
} from 'chart.js';

// Registrasi semua plugin Chart.js
ChartJS.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  Filler // ✅ Tambahkan agar background chart bisa terisi
);

const ChartView = ({ forecast, theme }) => {
  if (!forecast || forecast.length === 0) return null;

  const chartData = {
    labels: forecast.map((item) =>
      new Date(item.dt_txt).toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      })
    ),
    datasets: [
      {
        label: 'Suhu Harian (°C)',
        data: forecast.map((item) => item.main.temp),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: theme === 'dark' ? '#ffffff' : '#000000',
        },
      },
      title: {
        display: true,
        text: '📈 Grafik Suhu Harian',
        color: theme === 'dark' ? '#ffffff' : '#000000',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      x: {
        type: 'category',
        ticks: {
          color: theme === 'dark' ? '#ffffff' : '#000000',
        },
        grid: {
          color: theme === 'dark' ? '#444' : '#ccc',
        },
      },
      y: {
        ticks: {
          color: theme === 'dark' ? '#ffffff' : '#000000',
        },
        grid: {
          color: theme === 'dark' ? '#444' : '#ccc',
        },
      },
    },
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">📊 Grafik Suhu</h3>
      <div className="bg-white/30 dark:bg-white/10 p-4 rounded-xl shadow-md h-64">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ChartView;