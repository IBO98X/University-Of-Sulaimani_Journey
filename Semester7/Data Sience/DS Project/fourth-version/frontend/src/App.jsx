import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import ModelPage from './pages/ModelPage';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';

function App() {
  const [data, setData] = useState(null);

  const handleUploadSuccess = (responseData) => {
    setData(responseData);
  };

  // Wrapper for Dashboard to handle props
  const DashboardWrapper = () => (
    <div className="space-y-8">
      {!data && <FileUpload onUploadSuccess={handleUploadSuccess} />}
      {data && <Dashboard data={data} />}
      {!data && (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
          <p>Upload a file to view the dashboard analysis.</p>
        </div>
      )}
    </div>
  );

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<DashboardWrapper />} />
            <Route path="model/:modelId" element={<ModelPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
