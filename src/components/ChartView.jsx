import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,  // <== penting
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,  // <== ini yang error kamu minta
  LinearScale,
  Tooltip,
  Legend
);

const ChartView = ({ forecast, theme }) => {
  if (!forecast || forecast.length === 0) return null;

  const chartData = {
    labels: forecast.map((item) =>
      new Date(item.dt_txt).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Suhu Harian',
        data: forecast.map((item) => item.main.temp),
        borderColor: 'rgb(59,130,246)',
        backgroundColor: 'rgb(59,130,246)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: theme === 'dark' ? 'white' : 'black',
        },
      },
      title: {
        display: true,
        text: 'Grafik Suhu Harian',
        color: theme === 'dark' ? 'white' : 'black',
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme === 'dark' ? 'white' : 'black',
        },
      },
      y: {
        ticks: {
          color: theme === 'dark' ? 'white' : 'black',
        },
      },
    },
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">📊 Grafik Suhu</h3>
      <div className="bg-white/40 p-4 rounded-xl shadow-md">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ChartView;