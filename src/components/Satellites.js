import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from './api'; 
import { useAuth } from '@clerk/clerk-react';

const Satellites = ({ refreshKey }) => {
  const [satellites, setSatellites] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState('');

  const { getToken } = useAuth();

  const fetchSatellites = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await axios.get('/api/satellites', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSatellites(response.data);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || error.toString();
      setError('Failed to load satellites: ' + errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSatellites();
  }, [refreshKey]);

  const handleDelete = async (noradId) => {
    if (!window.confirm(`Delete satellite "${satellites.find(s => s.norad_id === noradId)?.name || noradId}"?`)) return;
    try {
      const token = await getToken();
      await axios.delete(`/delete-satellite/${noradId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSatellites();
    } catch (error) {
      alert('Delete failed: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleRename = async (noradId) => {
    if (!newName.trim()) return;
    try {
      const token = await getToken();
      await axios.patch(`/api/satellite/${noradId}/rename`, 
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      setNewName('');
      fetchSatellites();
    } catch (error) {
      alert('Rename failed: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="w-full">
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {isLoading ? (
        <div className="text-center text-cyan-500/70 py-8">Loading satellites...</div>
      ) : satellites.length === 0 ? (
        <p className="text-center text-cyan-600/70 py-8">No satellites tracked yet.</p>
      ) : (
        <div className="space-y-3">
          {satellites.map((sat) => (
            <div
              key={sat.norad_id}
              className="group bg-slate-800/50 backdrop-blur border border-cyan-800/30 rounded-lg p-5 
                         hover:bg-slate-700/60 hover:border-cyan-600/60 transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <Link 
                  to={`/satellite/${sat.norad_id}`} 
                  className="flex-1 hover:text-cyan-300 transition"
                >
                  <p className="text-xl font-bold text-white group-hover:text-cyan-200 transition">
                    {sat.name || 'Unknown Satellite'}
                  </p>
                  <p className="font-mono text-sm text-cyan-400 mt-1">
                    NORAD {sat.norad_id}
                  </p>
                </Link>

                {/* 3-DOT MENU */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(editingId === sat.norad_id ? null : sat.norad_id);
                    }}
                    className="p-2 rounded-lg hover:bg-slate-700/60 text-cyan-400 hover:text-white transition"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>

                  {editingId === sat.norad_id && (
                    <div className="absolute right-0 bottom-full mb-2 w-48 bg-slate-800/98 backdrop-blur-xl border border-cyan-700/60 rounded-lg shadow-2xl z-[99999]">
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setNewName(sat.name || '');
                            setEditingId(sat.norad_id + '-rename');
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-cyan-300 hover:bg-slate-700/60 transition"
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => handleDelete(sat.norad_id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}

                  {editingId === sat.norad_id + '-rename' && (
                    <div className="absolute right-0 bottom-full mb-2 w-64 bg-slate-800/98 backdrop-blur-xl border border-cyan-700/60 rounded-lg shadow-2xl p-3 z-[99999]">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRename(sat.norad_id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        className="w-full px-3 py-2 bg-slate-900/80 border border-cyan-600/50 rounded text-white text-sm focus:outline-none focus:border-cyan-400"
                        placeholder="New name..."
                        autoFocus
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleRename(sat.norad_id)}
                          className="flex-1 py-1 bg-cyan-600 hover:bg-cyan-500 rounded text-sm font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Satellites;