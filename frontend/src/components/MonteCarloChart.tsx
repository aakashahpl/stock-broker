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

// export const MonteCarloChart = ({ticker}) => {
//   const [chartData, setChartData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   // const [ticker, setTicker] = useState('AAPL');
//   const [showSimulations, setShowSimulations] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`http://localhost:8000/monte-carlo/${ticker}`);
        
//         if (!response.ok) {
//           throw new Error(`API error: ${response.status}`);
//         }
        
//         const data = await response.json();
//         console.log("Monte Carlo data", data);
        
//         // Prepare the chart data
//         const simulationDatasets = data.simulation_data.map((simulation, index) => ({
//           label: `Simulation ${index + 1}`,
//           data: simulation,
//           borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.3)`,
//           backgroundColor: 'rgba(0, 0, 0, 0)',
//           pointRadius: 0,
//           borderWidth: 1,
//           hidden: !showSimulations
//         }));

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
//               label: 'Mean Forecast',
//               data: data.mean_forecast,
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
//             },
//             ...simulationDatasets
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
//   }, [ticker, showSimulations]);

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: {
//           filter: (legendItem) => {
//             // Hide the individual simulation labels unless showSimulations is true
//             if (!showSimulations && legendItem.text.includes('Simulation')) {
//               return false;
//             }
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
//         text: `${ticker} Monte Carlo Stock Price Simulation (${chartData?.datasets[0]?.data.length} days)`,
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

//   const handleTickerChange = (e) => {
//     setTicker(e.target.value.toUpperCase());
//   };

//   const toggleSimulations = () => {
//     setShowSimulations(!showSimulations);
//   };

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md">
//       <div className="mb-4 flex items-center">
//         <input
//           type="text"
//           value={ticker}
//           onChange={handleTickerChange}
//           placeholder="Enter Stock Ticker"
//           className="mr-2 p-2 border rounded"
//         />
//         <button 
//           onClick={() => setTicker(ticker)}
//           className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//         >
//           Update Chart
//         </button>
//         <button 
//           onClick={toggleSimulations}
//           className={`ml-4 p-2 rounded ${showSimulations ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
//         >
//           {showSimulations ? 'Hide Simulations' : 'Show Simulations'}
//         </button>
//       </div>
      
//       <div className="h-96">
//         {loading && <div className="flex items-center justify-center h-full">Loading chart data...</div>}
//         {error && <div className="text-red-500">Error: {error}</div>}
//         {chartData && !loading && (
//           <Line data={chartData} options={chartOptions} />
//         )}
//       </div>
      
//       <div className="mt-4">
//         <h3 className="text-lg font-medium">Monte Carlo Simulation Analysis</h3>
//         <p className="text-gray-600 mt-2">
//           This chart displays the results of {chartData?.datasets.filter(d => d.label.includes('Simulation')).length} Monte Carlo simulations for {ticker} stock price over {chartData?.labels.length} days.
//           The solid line represents the mean forecast, while the shaded area shows the 95% confidence interval.
//           The dashed line represents the starting price of ${chartData?.datasets[0]?.data[0]?.toFixed(2)}.
//         </p>
//         <p className="text-gray-600 mt-2">
//           <strong>Last Close:</strong> ${chartData?.datasets[0]?.data[0]?.toFixed(2)} | 
//           <strong> Final Mean Forecast:</strong> ${chartData?.datasets[1]?.data[chartData?.datasets[1]?.data.length - 1]?.toFixed(2)} | 
//           <strong> Range:</strong> ${chartData?.datasets[3]?.data[chartData?.datasets[3]?.data.length - 1]?.toFixed(2)} - ${chartData?.datasets[2]?.data[chartData?.datasets[2]?.data.length - 1]?.toFixed(2)}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default MonteCarloChart;