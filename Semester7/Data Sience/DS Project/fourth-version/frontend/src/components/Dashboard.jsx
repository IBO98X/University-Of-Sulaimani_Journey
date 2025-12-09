import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = ({ data }) => {
  if (!data) return null;

  const { features, predictions } = data;

  // Prepare chart data
  const confidenceData = {
    labels: ['CNN Confidence'],
    datasets: [
      {
        label: 'Confidence Score',
        data: [predictions.cnn.confidence],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const featureData = {
    labels: ['TCP', 'UDP', 'ICMP'],
    datasets: [
      {
        data: [features.tcp_ratio, features.udp_ratio, features.icmp_ratio],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto mt-10 p-6"
    >
      <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">
        Classification Results
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Model Results Cards */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg transition-colors">
          <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">CNN Model</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{predictions.cnn.class_name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Confidence: {(predictions.cnn.confidence * 100).toFixed(2)}%</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg transition-colors">
          <h3 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">XGBoost Model</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{predictions.xgboost.class_name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Class ID: {predictions.xgboost.class_id}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg transition-colors">
          <h3 className="text-xl font-semibold mb-2 text-purple-600 dark:text-purple-400">Isolation Forest</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {predictions.isolation_forest.is_anomaly ? "Anomaly Detected" : "Normal Traffic"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Score: {predictions.isolation_forest.score.toFixed(4)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Charts */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg transition-colors">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-300">Protocol Distribution</h3>
          <div className="h-64 flex justify-center">
            <Doughnut data={featureData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg transition-colors">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-300">Packet Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="text-gray-600 dark:text-gray-400">Total Packets</span>
              <span className="font-mono text-gray-900 dark:text-white">{features.packet_count}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="text-gray-600 dark:text-gray-400">Avg Packet Size</span>
              <span className="font-mono text-gray-900 dark:text-white">{features.avg_packet_size.toFixed(2)} bytes</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="text-gray-600 dark:text-gray-400">Max Packet Size</span>
              <span className="font-mono text-gray-900 dark:text-white">{features.max_packet_size} bytes</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
