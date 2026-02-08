// src/components/DigitalTwin.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api';
import { useAuth } from '@clerk/clerk-react';

const DigitalTwin = () => {
  const { noradId } = useParams();
  const { getToken } = useAuth();

  const [satellite, setSatellite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load the satellite data (same as SatelliteDetails)
  useEffect(() => {
    const fetchSatellite = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const res = await axios.get(`/api/satellite/${noradId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSatellite(res.data);
      } catch (err) {
        const msg = err.response?.data?.error || err.message || 'Unknown error';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchSatellite();
  }, [noradId, getToken]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-cyan-400 text-2xl font-mono animate-pulse">
          Loading Digital Twin...
        </div>
      </div>
    );
  }

  if (error || !satellite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-red-400 text-xl font-mono">
          Error loading satellite: {error || 'Not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-cyan-300">
            Digital Twin — {satellite.name}
          </h1>
          <p className="mt-3 text-slate-400 font-mono">
            NORAD ID: <span className="text-cyan-400">{noradId}</span>
          </p>
        </div>

        {/* Placeholder for 3D viewer + controls */}
        <div className="bg-slate-900/60 border border-cyan-900/30 rounded-3xl overflow-hidden h-[70vh] flex items-center justify-center">
          <div className="text-center px-8">
            <h2 className="text-3xl font-bold text-cyan-300 mb-6">
              3D Digital Twin Viewer
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Coming soon: Real-time 3D visualization of your satellite, live orbit propagation using SGP4, and a maneuver planning sandbox powered by Poliastro.
            </p>
            <p className="text-slate-500">
              This page will load the latest TLE and show dynamic orbit simulation.
            </p>
          </div>
        </div>

        {/* Future sections: controls, stats, maneuver inputs */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example future cards */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-cyan-300 mb-3">Current Position</h3>
            <p className="text-slate-400">Loading...</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-cyan-300 mb-3">Next Maneuver Suggestion</h3>
            <p className="text-slate-400">Coming soon</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-cyan-300 mb-3">Fuel Optimization</h3>
            <p className="text-slate-400">Simulation results coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalTwin;