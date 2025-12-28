import React, { useState } from 'react';
import axios from '../api'; // ← Uses baseURL from api.js (live backend)
import { useAuth } from '@clerk/clerk-react';

const AddSatellite = ({ onSatelliteAdded }) => {
  const [noradId, setNoradId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noradId.trim()) return;

    setIsLoading(true);
    try {
      const token = await getToken();

      const response = await axios.post(
        '/add-satellite', // ← Relative path — uses api.js baseURL
        { norad_id: noradId.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Add satellite response:', response.data);
      alert('Satellite added successfully!');
      setNoradId('');
      if (onSatelliteAdded) onSatelliteAdded();
    } catch (error) {
      const msg = error.response?.data?.error || error.message || 'Unknown error';
      console.error('Error adding satellite:', error);
      alert('Failed to add satellite: ' + msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* INPUT FIELD */}
        <div>
          <input
            type="text"
            placeholder="NORAD ID (e.g. 25544)"
            value={noradId}
            onChange={(e) => setNoradId(e.target.value)}
            required
            className="w-full px-5 py-4 bg-slate-800/70 border border-cyan-800/50 rounded-xl
                       text-cyan-100 placeholder-cyan-500/60
                       focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400
                       transition-all duration-300 backdrop-blur"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isLoading || !noradId.trim()}
          className={`w-full py-4 rounded-xl font-medium text-lg tracking-widest transition-all duration-300
            ${isLoading || !noradId.trim()
              ? 'bg-slate-700/60 text-cyan-600 cursor-not-allowed border border-slate-600'
              : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/50 hover:shadow-cyan-400/70 border border-cyan-500'
            }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Adding...
            </span>
          ) : (
            'Add Satellite'
          )}
        </button>
      </form>
    </div>
  );
};

export default AddSatellite;