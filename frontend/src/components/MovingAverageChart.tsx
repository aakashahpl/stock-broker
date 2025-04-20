import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const MovingAverageChart = ({ticker}) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [ticker, setTicker] = useState('AAPL');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_ANALYSIS_Backend_URL}/moving-average/${ticker}`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("moving average data",data);
        
        // Prepare the chart data
        const chartConfig = {
          labels: data.dates,
          datasets: [
            {
              label: 'Stock Price',
              data: data.prices,
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
              pointRadius: 0,
              borderWidth: 1.5
            },
            {
              label: '10-Day MA',
              data: data.moving_averages.MA_10,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              pointRadius: 0,
              borderWidth: 2
            },
            {
              label: '20-Day MA',
              data: data.moving_averages.MA_20,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              pointRadius: 0,
              borderWidth: 2
            },
            {
              label: '50-Day MA',
              data: data.moving_averages.MA_50,
              borderColor: 'rgb(255, 159, 64)',
              backgroundColor: 'rgba(255, 159, 64, 0.5)',
              pointRadius: 0,
              borderWidth: 2
            }
          ]
        };
        
        setChartData(chartConfig);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticker]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${ticker} Stock Price with Moving Averages`,
        font: {
          size: 16
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        },
        ticks: {
          maxTicksLimit: 10
        }
      },
      y: {
        title: {
          display: true,
          text: 'Price ($)'
        },
        beginAtZero: false
      }
    },
    interaction: {
      mode: 'index', // Changed from 'nearest' to 'index' which is a valid mode
      axis: 'x',
      intersect: false
    }
  };

  const handleTickerChange = (e) => {
    // setTicker(e.target.value.toUpperCase());
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {/* <div className="mb-4 flex items-center">
        <input
          type="text"
          value={ticker}
          onChange={handleTickerChange}
          placeholder="Enter Stock Ticker"
          className="mr-2 p-2 border rounded"
        />
        <button 
          onClick={() => setTicker(ticker)}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Update Chart
        </button>
      </div> */}
      
      <div className="h-96">
        {loading && <div className="flex items-center justify-center h-full">Loading chart data...</div>}
        {error && <div className="text-red-500">Error: {error}</div>}
        {chartData && !loading && (
          <Line data={chartData} options={chartOptions as any} />
        )}
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-medium">Moving Average Analysis</h3>
        <p className="text-gray-600 mt-2">
          This chart displays the stock price along with 10-day, 20-day, and 50-day moving averages.
          Moving averages help smooth out price data to identify trends over specified time periods.
        </p>
      </div>
    </div>
  );
};

export default MovingAverageChart;