// import React, { useState, useEffect } from 'react';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// } from 'chart.js';

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// export const ARIMAForecastChart = ({ ticker }) => {
//   const [chartData, setChartData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [modelInfo, setModelInfo] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`http://localhost:8000/arima-forecast/${ticker}`);
        
//         if (!response.ok) {
//           throw new Error(`API error: ${response.status}`);
//         }
        
//         const data = await response.json();
//         console.log("ARIMA forecast data", data);
        
//         // Store model information for display
//         setModelInfo({
//           ticker: data.ticker,
//           lastClose: data.last_close,
//           forecastDays: data.forecast_days,
//           model: data.model,
//           mape: data.evaluation_metrics.mape,
//           rmse: data.evaluation_metrics.rmse
//         });
        
//         // Prepare the chart data
//         const chartConfig = {
//           labels: data.dates,
//           datasets: [
//             {
//               label: 'Starting Price',
//               data: Array(data.dates.length).fill(data.last_close),
//               borderColor: 'rgba(0, 0, 0, 0.8)',
//               backgroundColor: 'rgba(0, 0, 0, 0)',
//               pointRadius: 0,
//               borderWidth: 1.5,
//               borderDash: [5, 5]
//             },
//             {
//               label: 'ARIMA Forecast',
//               data: data.forecast_values,
//               borderColor: 'rgb(75, 192, 192)',
//               backgroundColor: 'rgba(75, 192, 192, 0)',
//               pointRadius: 0,
//               borderWidth: 3
//             },
//             {
//               label: '95% Confidence Interval',
//               data: data.upper_95,
//               borderColor: 'rgba(255, 99, 132, 0.5)',
//               backgroundColor: 'rgba(255, 99, 132, 0)',
//               pointRadius: 0,
//               borderWidth: 2,
//               fill: '+1'
//             },
//             {
//               label: '95% Confidence Lower',
//               data: data.lower_95,
//               borderColor: 'rgba(255, 99, 132, 0.5)',
//               backgroundColor: 'rgba(255, 99, 132, 0.2)',
//               pointRadius: 0,
//               borderWidth: 2,
//               fill: '-1'
//             }
//           ]
//         };
        
//         setChartData(chartConfig);
//         setError(null);
//       } catch (err) {
//         setError(err.message);
//         console.error('Error fetching data:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [ticker]);

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: {
//           filter: (legendItem) => {
//             // Hide the 95% Confidence Lower label as it's just for filling
//             if (legendItem.text === '95% Confidence Lower') {
//               return false;
//             }
//             return true;
//           }
//         }
//       },
//       title: {
//         display: true,
//         text: `${ticker} ARIMA Price Forecast (${modelInfo.forecastDays} days)`,
//         font: {
//           size: 16
//         }
//       },
//       tooltip: {
//         mode: 'index',
//         intersect: false,
//       }
//     },
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: 'Date'
//         },
//         ticks: {
//           maxTicksLimit: 10
//         }
//       },
//       y: {
//         title: {
//           display: true,
//           text: 'Price ($)'
//         },
//         beginAtZero: false
//       }
//     },
//     interaction: {
//       mode: 'nearest',
//       axis: 'x',
//       intersect: false
//     }
//   };

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md">
//       <div className="h-96">
//         {loading && <div className="flex items-center justify-center h-full">Loading chart data...</div>}
//         {error && <div className="text-red-500">Error: {error}</div>}
//         {chartData && !loading && (
//           <Line data={chartData} options={chartOptions} />
//         )}
//       </div>
      
//       <div className="mt-4">
//         <h3 className="text-lg font-medium">ARIMA Forecast Analysis</h3>
//         <p className="text-gray-600 mt-2">
//           This chart displays the ARIMA forecasting results for {modelInfo.ticker} stock price over {modelInfo.forecastDays} days.
//           The solid line represents the forecast, while the shaded area shows the 95% confidence interval.
//           The dashed line represents the starting price of ${modelInfo.lastClose?.toFixed(2)}.
//         </p>
//         <p className="text-gray-600 mt-2">
//           <strong>Model:</strong> {modelInfo.model} | 
//           <strong> Last Close:</strong> ${modelInfo.lastClose?.toFixed(2)} | 
//           <strong> Final Forecast:</strong> ${chartData?.datasets[1]?.data[chartData?.datasets[1]?.data.length - 1]?.toFixed(2)} | 
//           <strong> Range:</strong> ${chartData?.datasets[3]?.data[chartData?.datasets[3]?.data.length - 1]?.toFixed(2)} - ${chartData?.datasets[2]?.data[chartData?.datasets[2]?.data.length - 1]?.toFixed(2)}
//         </p>
//         <p className="text-gray-600 mt-2">
//           <strong>Evaluation Metrics:</strong> MAPE: {modelInfo.mape?.toFixed(2)}% | RMSE: {modelInfo.rmse?.toFixed(2)}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ARIMAForecastChart;