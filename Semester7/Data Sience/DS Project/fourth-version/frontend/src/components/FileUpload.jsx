import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const FileUpload = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/api/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUploadSuccess(response.data);
    } catch (err) {
      console.error(err);
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/octet-stream': ['.pcap', '.pcapng', '.cap'],
    },
    multiple: false,
  });

  return (
    <div className="w-full max-w-xl mx-auto mt-10">
      <motion.div
        {...getRootProps()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={clsx(
          "border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors duration-200",
          isDragActive ? "border-blue-500 bg-blue-500/10" : "border-gray-600 hover:border-blue-400 hover:bg-gray-800"
        )}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-gray-300">Processing packet capture...</p>
          </div>
        ) : (
          <div>
            <p className="text-xl font-semibold text-gray-200">
              {isDragActive ? "Drop the PCAP file here" : "Drag & drop a PCAP file here"}
            </p>
            <p className="text-sm text-gray-500 mt-2">or click to select file</p>
            <p className="text-xs text-gray-600 mt-4">Supported formats: .pcap, .pcapng</p>
          </div>
        )}
      </motion.div>
      {error && (
        <p className="text-red-500 text-center mt-4">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;
