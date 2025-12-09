import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Activity, Network } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          Network Packet Classification
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
          Advanced traffic analysis using Convolutional Neural Networks, XGBoost, and Isolation Forests.
          Detect anomalies and classify protocols with high precision.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link
            to="/dashboard"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-blue-500/30"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-full font-semibold transition-all"
          >
            View Source
          </a>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full max-w-6xl px-4">
        {[
          {
            icon: Network,
            title: "Deep Learning",
            desc: "CNN architecture for robust feature extraction and classification of encrypted traffic.",
            color: "text-blue-500"
          },
          {
            icon: Activity,
            title: "Gradient Boosting",
            desc: "XGBoost for high-performance, interpretable classification of network flows.",
            color: "text-green-500"
          },
          {
            icon: Shield,
            title: "Anomaly Detection",
            desc: "Isolation Forest to identify zero-day attacks and abnormal network behavior.",
            color: "text-purple-500"
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-shadow"
          >
            <item.icon className={`w-12 h-12 mb-4 ${item.color}`} />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{item.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;
