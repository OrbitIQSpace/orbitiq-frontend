// src/pages/Landing.js — LIVE ISS TRACKING + PRODUCTION READY
import React, { useEffect, useState } from 'react';
import { PricingTable } from '@clerk/clerk-react';
import { getSatelliteInfo } from 'tle.js';
import SatelliteMap from '../components/SatelliteMap';
import axios from '../api'; // ← Uses baseURL from src/api.js (live backend)

const Landing = () => {
  const [issPosition, setIssPosition] = useState(null);
  const [issTle, setIssTle] = useState(null);
  const [loadingTle, setLoadingTle] = useState(true);

  // 1. Fetch latest ISS TLE — relative path via api.js
  useEffect(() => {
    const fetchIssTle = async () => {
      try {
        const res = await axios.get('/api/public/iss');
        if (res.data && res.data.line1 && res.data.line2) {
          setIssTle(res.data);
        } else {
          throw new Error('Invalid TLE format');
        }
      } catch (err) {
        console.info('Using fallback ISS TLE (backend fetch failed)');
        setIssTle({
          name: 'ISS (ZARYA)',
          line1: "1 25544U 98067A   25360.53473604  .00013978  00000-0  25382-3 0  9999",
          line2: "2 25544  51.6320  74.1581 0003231 305.5588  54.5099 15.49844261544995",
        });
      } finally {
        setLoadingTle(false);
      }
    };

    fetchIssTle();
  }, []);

  // 2. Calculate live position from TLE
  useEffect(() => {
    if (!issTle || loadingTle) {
      setIssPosition(null);
      return;
    }

    const tle = [issTle.line1.trim(), issTle.line2.trim()];

    const updateIss = () => {
      try {
        const info = getSatelliteInfo(tle, Date.now());
        if (info && typeof info.lat === 'number' && typeof info.lng === 'number') {
          setIssPosition({
            lat: info.lat,
            lng: info.lng,
            altitude: Math.round(info.height || 420),
          });
        }
      } catch (err) {
        console.error('Error calculating ISS position:', err);
      }
    };

    updateIss();
    const interval = setInterval(updateIss, 3000);
    return () => clearInterval(interval);
  }, [issTle, loadingTle]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* HERO */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-6">
            ORBIT<span className="text-cyan-400">IQ</span>
          </h1>
          <p className="text-2xl md:text-4xl font-light text-cyan-300 mb-8">
            Make Your Satellites Live Longer
          </p>
          <p className="text-xl md:text-2xl text-slate-400 max-w-4xl mx-auto mb-12">
            Real-time orbital analytics • Decay prediction • Reboost timing • Satellite health
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <a href="#pricing" className="px-10 py-5 bg-cyan-600 hover:bg-cyan-500 rounded-full font-bold text-xl shadow-2xl shadow-cyan-500/50 transition-all">
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* LIVE ISS GLOBE */}
      <section className="px-6 mb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8 text-cyan-300">
            International Space Station — Live Tracking
          </h2>
          <div className="h-[700px] rounded-3xl overflow-hidden shadow-2xl border border-cyan-900/30 bg-slate-900">
            {issPosition ? (
              <SatelliteMap position={issPosition} satelliteName={issTle.name || 'ISS (ZARYA)'} />
            ) : (
              <div className="h-full flex items-center justify-center bg-slate-900/80">
                <p className="text-cyan-400 text-xl animate-pulse">Establishing Ground Link...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="text-cyan-400 text-6xl mb-6">📡</div>
            <h3 className="text-2xl font-bold mb-4">Real-Time Position</h3>
            <p className="text-slate-400">Live lat/lng/altitude updated every 3 seconds</p>
          </div>
          <div className="text-center">
            <div className="text-cyan-400 text-6xl mb-6">🔋</div>
            <h3 className="text-2xl font-bold mb-4">Satellite Health</h3>
            <p className="text-slate-400">Upload telemetry → instant graphs</p>
          </div>
          <div className="text-center">
            <div className="text-cyan-400 text-6xl mb-6">⏱️</div>
            <h3 className="text-2xl font-bold mb-4">Decay Prediction</h3>
            <p className="text-slate-400">Know exactly when you need to reboost</p>
          </div>
        </div>
      </section>

      {/* PRICING — DEFAULT CLERK LOOK */}
      <section id="pricing" className="px-6 py-32">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-16 text-cyan-300">Pricing</h2>
          
          <div className="max-w-6xl mx-auto">
            <PricingTable />
          </div>

          <p className="text-slate-400 mt-12 text-lg">
            Need 10+ satellites? <a href="mailto:tyler@orbitiqspace.com" className="text-cyan-400 hover:underline">Contact us</a> for custom pricing.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-12 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto text-center text-slate-500">
          <p className="text-2xl font-bold text-cyan-400 mb-4">ORBITIQ</p>
          <p>© 2025 OrbitIQ LLC • All rights reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;