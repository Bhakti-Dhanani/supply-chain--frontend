import React from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
);

interface MonthlyOrderData {
  month: string;
  orders: number;
}

interface OrdersChartProps {
  data: MonthlyOrderData[];
}

const OrdersChart: React.FC<OrdersChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: 'Orders',
        data: data.map((d) => d.orders),
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(110, 143, 137, 0.8)');
          gradient.addColorStop(1, 'rgba(214, 236, 230, 0.2)');
          return gradient;
        },
        borderColor: '#6E8F89',
        borderWidth: 1,
        borderRadius: 12,
        borderSkipped: false,
        fill: true
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: false 
      },
      title: { 
        display: true, 
        text: 'Monthly Order Trends', 
        color: '#1E3B3B', 
        font: { 
          family: "'Inter', sans-serif",
          size: 16,
          weight: 600 // changed from string '600' to number 600 for compatibility
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: '#1E3B3B',
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12
        },
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context: any) => {
            return `Orders: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: { 
        grid: { 
          display: false,
          drawBorder: false
        }, 
        ticks: { 
          color: '#6E8F89',
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        } 
      },
      y: { 
        grid: { 
          color: 'rgba(234, 220, 214, 0.2)',
          drawBorder: false
        }, 
        ticks: { 
          color: '#6E8F89',
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          callback: (value: any) => {
            if (value % 5 === 0) return value;
          }
        },
        beginAtZero: true
      },
    },
  };

  return (
    <div className="w-full h-full">
      <Bar 
        data={chartData} 
        options={options} 
        height={350}
      />
    </div>
  );
};

export default OrdersChart;