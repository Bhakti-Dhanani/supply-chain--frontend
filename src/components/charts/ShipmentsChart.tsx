import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Legend,
} from 'chart.js';

// Register required Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Legend);

const ShipmentsChart: React.FC<{ data: { day: string; shipments: number }[] }> = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.day),
    datasets: [
      {
        label: 'Shipments',
        data: data.map((d) => d.shipments),
        borderColor: '#6E8F89',
        backgroundColor: 'rgba(110, 143, 137, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: '#EADCD6',
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default ShipmentsChart;
