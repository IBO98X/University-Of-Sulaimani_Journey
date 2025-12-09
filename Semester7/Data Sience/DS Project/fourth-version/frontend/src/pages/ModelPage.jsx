import React from 'react';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { motion } from 'framer-motion';

const ModelPage = () => {
  const { modelId } = useParams();

  // Simulated Training History
  const trainingData = [
    { epoch: 1, accuracy: 0.65, loss: 0.8, val_accuracy: 0.60 },
    { epoch: 2, accuracy: 0.72, loss: 0.6, val_accuracy: 0.68 },
    { epoch: 3, accuracy: 0.78, loss: 0.45, val_accuracy: 0.75 },
    { epoch: 4, accuracy: 0.85, loss: 0.35, val_accuracy: 0.82 },
    { epoch: 5, accuracy: 0.89, loss: 0.25, val_accuracy: 0.86 },
    { epoch: 6, accuracy: 0.92, loss: 0.18, val_accuracy: 0.89 },
    { epoch: 7, accuracy: 0.94, loss: 0.15, val_accuracy: 0.91 },
    { epoch: 8, accuracy: 0.95, loss: 0.12, val_accuracy: 0.93 },
  ];

  // Simulated Class Performance
  const classPerformance = [
    { subject: 'Class A (Web)', A: 95, B: 90, fullMark: 100 },
    { subject: 'Class B (Stream)', A: 88, B: 85, fullMark: 100 },
    { subject: 'Class C (File)', A: 92, B: 90, fullMark: 100 },
    { subject: 'Class D (Msg)', A: 85, B: 80, fullMark: 100 },
    { subject: 'Class E (Sys)', A: 90, B: 88, fullMark: 100 },
  ];

  // Detailed Classification Report
  const classificationReport = [
    { class: "Class A (Web browsing)", precision: 0.96, recall: 0.95, f1: 0.95, support: 450 },
    { class: "Class B (Streaming)", precision: 0.92, recall: 0.89, f1: 0.90, support: 320 },
    { class: "Class C (File Transfer)", precision: 0.94, recall: 0.96, f1: 0.95, support: 210 },
    { class: "Class D (Messaging)", precision: 0.88, recall: 0.90, f1: 0.89, support: 150 },
    { class: "Class E (System / Other)", precision: 0.91, recall: 0.93, f1: 0.92, support: 180 },
  ];

  const pieData = [
    { name: 'Correct Predictions', value: 94 },
    { name: 'Misclassifications', value: 6 },
  ];

  const COLORS = ['#10B981', '#EF4444'];

  const getModelInfo = (id) => {
    switch (id) {
      case 'cnn':
        return {
          title: "Convolutional Neural Network (CNN)",
          desc: "A 1D CNN architecture designed to capture spatial dependencies in packet feature vectors. It uses multiple convolutional layers to extract hierarchical features from raw packet data.",
          accuracy: "95.2%",
          precision: "94.8%",
          recall: "95.5%",
          f1: "95.1%"
        };
      case 'xgboost':
        return {
          title: "XGBoost Classifier",
          desc: "Gradient boosting framework using tree-based learning algorithms. It excels at handling tabular data and capturing non-linear relationships between packet features.",
          accuracy: "96.5%",
          precision: "96.2%",
          recall: "96.8%",
          f1: "96.5%"
        };
      case 'isolation-forest':
        return {
          title: "Isolation Forest",
          desc: "Unsupervised learning algorithm for anomaly detection. It isolates observations by randomly selecting a feature and then randomly selecting a split value.",
          accuracy: "N/A",
          precision: "92.0%",
          recall: "88.5%",
          f1: "90.2%"
        };
      default:
        return { title: "Unknown Model", desc: "" };
    }
  };

  const info = getModelInfo(modelId);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{info.title}</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">{info.desc}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Accuracy</p>
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{info.accuracy}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">Precision</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-300">{info.precision}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Recall</p>
            <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{info.recall}</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800">
            <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">F1-Score</p>
            <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{info.f1}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Training History Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Training History</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trainingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="epoch" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="accuracy" name="Train Acc" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="val_accuracy" name="Val Acc" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="loss" name="Loss" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Class Performance Radar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Class Performance Radar</h3>
          <div className="h-80 flex justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={classPerformance}>
                <PolarGrid stroke="#374151" opacity={0.2} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9CA3AF' }} />
                <Radar name="Precision" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Radar name="Recall" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Legend />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Detailed Classification Report Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Detailed Classification Report</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Class</th>
                <th className="py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Precision</th>
                <th className="py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Recall</th>
                <th className="py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">F1-Score</th>
                <th className="py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Support</th>
              </tr>
            </thead>
            <tbody>
              {classificationReport.map((row, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="py-4 px-4 text-gray-900 dark:text-white font-medium">{row.class}</td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{row.precision.toFixed(2)}</td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{row.recall.toFixed(2)}</td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{row.f1.toFixed(2)}</td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{row.support}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ModelPage;
