import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StockChart = ({ stock }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('1D'); // Default timeframe
  
  useEffect(() => {
    if (!stock) return;
    
    // Generate mock data - in a real app, you'd fetch real historical data
    const generateChartData = () => {
      setLoading(true);
      setError(null);
      
      try {
        // Generate mock data for the chart
        const currentPrice = stock.price;
        const mockPrices = [];
        const labels = [];
        
        // Number of data points based on timeframe
        let dataPoints = 7;
        let pointInterval = 'day';
        
        switch (timeframe) {
          case '1D':
            dataPoints = 24;
            pointInterval = 'hour';
            break;
          case '1W':
            dataPoints = 7;
            pointInterval = 'day';
            break;
          case '1M':
            dataPoints = 30;
            pointInterval = 'day';
            break;
          case '3M':
            dataPoints = 12;
            pointInterval = 'week';
            break;
          case '1Y':
            dataPoints = 12;
            pointInterval = 'month';
            break;
          default:
            dataPoints = 7;
            pointInterval = 'day';
        }
        
        for (let i = dataPoints - 1; i >= 0; i--) {
          const date = new Date();
          
          if (pointInterval === 'hour') {
            date.setHours(date.getHours() - i);
            labels.push(`${date.getHours()}:00`);
          } else if (pointInterval === 'day') {
            date.setDate(date.getDate() - i);
            labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
          } else if (pointInterval === 'week') {
            date.setDate(date.getDate() - (i * 7));
            labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
          } else if (pointInterval === 'month') {
            date.setMonth(date.getMonth() - i);
            labels.push(`${date.toLocaleString('default', { month: 'short' })}`);
          }
          
          // Generate a random price fluctuation based on current price
          // More volatility for shorter timeframes
          let volatilityFactor;
          switch (timeframe) {
            case '1D': volatilityFactor = 0.005; break;
            case '1W': volatilityFactor = 0.02; break;
            case '1M': volatilityFactor = 0.05; break;
            case '3M': volatilityFactor = 0.08; break;
            case '1Y': volatilityFactor = 0.15; break;
            default: volatilityFactor = 0.02;
          }
          
          const randomFluctuation = currentPrice * (1 - volatilityFactor + (Math.random() * volatilityFactor * 2));
          mockPrices.push(parseFloat(randomFluctuation.toFixed(2)));
        }
        
        // Ensure the last price matches the current price
        mockPrices[mockPrices.length - 1] = currentPrice;
        
        // Create gradient for chart
        const priceChange = mockPrices[mockPrices.length - 1] - mockPrices[0];
        const borderColor = priceChange >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)';
        const backgroundColor = priceChange >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';
        
        setChartData({
          labels,
          datasets: [
            {
              label: `${stock.symbol} Price`,
              data: mockPrices,
              borderColor,
              backgroundColor,
              tension: 0.3,
              fill: true,
              pointRadius: 0,
              pointHoverRadius: 5,
              borderWidth: 2,
            },
          ],
        });
      } catch (err) {
        console.error('Error generating chart data:', err);
        setError('Failed to load chart data');
      } finally {
        setLoading(false);
      }
    };
    
    generateChartData();
  }, [stock, timeframe]);
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `$${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          callback: function(value) {
            return '$' + value;
          }
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };
  
  const timeframeButtons = [
    { label: '1D', value: '1D' },
    { label: '1W', value: '1W' },
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '1Y', value: '1Y' },
  ];
  
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">{stock.name} ({stock.symbol})</h3>
        <div className="mt-1 flex items-center">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">${stock.price?.toFixed(2)}</span>
          <span 
            className={`ml-2 px-2 py-0.5 rounded text-sm ${
              stock.change >= 0 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            }`}
          >
            {stock.change >= 0 ? '+' : ''}{stock.change?.toFixed(2)} ({stock.percentChange?.toFixed(2)}%)
          </span>
        </div>
        <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          <span>High: ${stock.high?.toFixed(2)}</span>
          <span className="mx-2">|</span>
          <span>Low: ${stock.low?.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mb-4 flex space-x-2">
        {timeframeButtons.map((button) => (
          <button
            key={button.value}
            onClick={() => setTimeframe(button.value)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              timeframe === button.value
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            {button.label}
          </button>
        ))}
      </div>
      
      {loading ? (
        <div className="h-64 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="h-64 flex justify-center items-center text-slate-500 dark:text-slate-400">
          {error}
        </div>
      ) : chartData ? (
        <div className="h-64">
          <Line data={chartData} options={options} />
        </div>
      ) : null}
      
      <div className="mt-4 text-xs text-slate-500 text-center dark:text-slate-400">
        Note: Chart shows simulated historical data for demonstration purposes
      </div>
    </div>
  );
};

export default StockChart;