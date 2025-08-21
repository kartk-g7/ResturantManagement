import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const timePeriods = ['Daily', 'Weekly', 'Monthly'];

const chartColors = [
  'rgba(255, 99, 132, 0.7)',
  'rgba(54, 162, 235, 0.7)',
  'rgba(255, 206, 86, 0.7)',
  'rgba(75, 192, 192, 0.7)',
  'rgba(153, 102, 255, 0.7)',
  'rgba(255, 159, 64, 0.7)',
  'rgba(255, 100, 150, 0.7)',
  'rgba(100, 200, 255, 0.7)',
  'rgba(200, 255, 100, 0.7)',
  'rgba(50, 200, 150, 0.7)',
  'rgba(200, 100, 255, 0.7)',
  'rgba(255, 100, 100, 0.7)'
];

const chartBorderColors = [
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)',
  'rgba(255, 100, 150, 1)',
  'rgba(100, 200, 255, 1)',
  'rgba(200, 255, 100, 1)',
  'rgba(50, 200, 150, 1)',
  'rgba(200, 100, 255, 1)',
  'rgba(255, 100, 100, 1)'
];


export default function InventoryCharts() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState('Weekly');
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Placeholder for fetching aggregated data.
    const fetchData = () => {
      setLoading(true);
      if (activePeriod === 'Daily') {
        // Fetch daily data from a new 'daily_analytics' collection or a different query.
        setChartData({
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Daily Inventory Changes',
            data: [5, -2, 8, -4, 10, -1, 3], // Example data
            backgroundColor: chartColors,
            borderColor: chartBorderColors,
            borderWidth: 1
          }]
        });
      } else if (activePeriod === 'Weekly') {
        const unsubscribe = onSnapshot(collection(db, "inventory"), (snapshot) => {
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setInventory(items);
          const labels = items.map(item => item.name);
          const dataPoints = items.map(item => item.quantity);

          setChartData({
            labels: labels,
            datasets: [{
              label: 'Current Stock Quantity',
              data: dataPoints,
              backgroundColor: chartColors,
              borderColor: chartBorderColors,
              borderWidth: 1,
            }]
          });
          setLoading(false);
        });
        return () => unsubscribe();
      } else if (activePeriod === 'Monthly') {
        // Fetch monthly data.
        setChartData({
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Monthly Inventory Summary',
            data: [150, 120, 180, 200, 160, 190, 220, 210, 180, 230, 250, 240], // Example data
            backgroundColor: chartColors,
            borderColor: chartBorderColors,
            borderWidth: 1
          }]
        });
      }
      setLoading(false);
    };

    fetchData();
  }, [activePeriod]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading charts...</p>;
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">📊 Reports</h2>

      <div className="flex justify-center mb-6 space-x-4">
        {timePeriods.map(period => (
          <button
            key={period}
            onClick={() => setActivePeriod(period)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${activePeriod === period ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {period}
          </button>
        ))}
      </div>

      {!chartData || chartData.datasets[0].data.length === 0 ? (
        <p className="text-center text-gray-500">No inventory data available for this period.</p>
      ) : (
        <div className="flex justify-between items-stretch gap-4">
          <div className="w-1/2 p-4 bg-white rounded-xl shadow-lg transition-transform transform hover:scale-105 aspect-square">
            <Bar options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' },
                title: {
                  display: true,
                  text: `Inventory Stock Levels (${activePeriod} - Bar Chart)`,
                },
              },
            }} data={chartData} />
          </div>
          <div className="w-1/2 p-4 bg-white rounded-xl shadow-lg transition-transform transform hover:scale-105 aspect-square">
            <Pie options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' },
                title: {
                  display: true,
                  text: `Inventory Stock Distribution (${activePeriod} - Pie Chart)`,
                },
              },
            }} data={chartData} />
          </div>
        </div>
      )}
    </div>
  );
}