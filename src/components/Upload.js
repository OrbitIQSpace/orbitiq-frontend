import React, { useState } from 'react';
import axios from '../api'; // ← Uses baseURL from src/api.js (live backend)
import { useAuth } from '@clerk/clerk-react';

const Upload = ({ noradId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a CSV file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('norad_id', noradId);

    setIsLoading(true);
    try {
      const token = await getToken();

      await axios.post('/upload/telemetry', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Telemetry uploaded successfully!');
      setFile(null);

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      const msg = error.response?.data?.error || error.message || "Unknown error";
      console.error('Telemetry upload error:', error);
      alert('Upload failed: ' + msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold text-cyan-300 mb-5">
        Upload Telemetry CSV
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-cyan-300
                       file:mr-4 file:py-3 file:px-6
                       file:rounded-lg file:border-0
                       file:text-sm file:font-medium
                       file:bg-cyan-600/80 file:text-white
                       hover:file:bg-cyan-500/80
                       file:backdrop-blur file:shadow-lg file:shadow-cyan-500/40
                       bg-slate-800/60 border border-cyan-800/50 rounded-xl
                       cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400
                       transition-all duration-300"
          />
          {file && (
            <p className="mt-2 text-sm text-cyan-400 font-mono">
              Selected: <span className="text-cyan-200">{file.name}</span>
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !file}
          className={`w-full py-4 rounded-xl font-bold text-lg tracking-widest transition-all duration-300
            ${isLoading || !file
              ? 'bg-slate-700/60 text-cyan-600 cursor-not-allowed border border-slate-600'
              : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-xl shadow-cyan-500/60 hover:shadow-cyan-400/80 border border-cyan-400'
            }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Uploading...
            </span>
          ) : (
            'Upload Telemetry'
          )}
        </button>
      </form>
    </div>
  );
};

export default Upload;