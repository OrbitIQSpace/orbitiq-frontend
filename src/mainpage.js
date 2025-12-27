// src/pages/mainpage.js
import React from 'react';
import { Link } from 'react-router-dom';
import SatelliteMap from '../components/SatelliteMap'; // demo with ISS

const Landing = () => {
  // Demo position (ISS)
  const demoPosition = {
    lat: 51.5,
    lng: -0.1,
    altitude: 420,
  };

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
            Real-time orbital analytics • Decay prediction • Reboost timing • Battery health
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/signup"
              className="px-10 py-5 bg-cyan-600 hover:bg-cyan-500 rounded-full font-bold text-xl shadow-2xl shadow-cyan-500/50 transition-all"
            >
              Start Free Trial
            </Link>
            <Link
              to="/login"
              className="px-10 py-5 bg-slate-800 hover:bg-slate-700 rounded-full font-bold text-xl border border-cyan-900/50 transition-all"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* LIVE DEMO GLOBE */}
      <section className="px-6 mb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8 text-cyan-300">
            Live Satellite Tracking — Right Now
          </h2>
          <div className="h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-cyan-900/30">
            <SatelliteMap position={demoPosition} satelliteName="Demo Satellite (ISS)" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="text-cyan-400 text-6xl mb-6">📡</div>
            <h3 className="text-2xl font-bold mb-4">Real-Time Position</h3>
            <p className="text-slate-400">Live lat/lng/altitude updated every 5 seconds</p>
          </div>
          <div className="text-center">
            <div className="text-cyan-400 text-6xl mb-6">🔋</div>
            <h3 className="text-2xl font-bold mb-4">Battery Health</h3>
            <p className="text-slate-400">Upload telemetry → instant graphs</p>
          </div>
          <div className="text-center">
            <div className="text-cyan-400 text-6xl mb-6">⏱️</div>
            <h3 className="text-2xl font-bold mb-4">Decay Prediction</h3>
            <p className="text-slate-400">Know exactly when you need to reboost</p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-12 text-cyan-300">Simple Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-800/80 border border-cyan-900/50 rounded-3xl p-10">
              <h3 className="text-3xl font-bold mb-4">Starter</h3>
              <p className="text-5xl font-black text-cyan-400 mb-6">$4,000<span className="text-xl">/sat/mo</span></p>
              <p className="text-slate-400 mb-8">1–3 satellites</p>
              <Link to="/signup" className="block w-full py-4 bg-cyan-600 hover:bg-cyan-500 rounded-full font-bold">
                Start Trial
              </Link>
            </div>
            <div className="bg-gradient-to-br from-cyan-900/50 to-slate-900 border border-cyan-600 rounded-3xl p-10 shadow-2xl shadow-cyan-500/30">
              <h3 className="text-3xl font-bold mb-4">Growth</h3>
              <p className="text-5xl font-black text-cyan-400 mb-6">$3,500<span className="text-xl">/sat/mo</span></p>
              <p className="text-slate-400 mb-8">4–10 satellites</p>
              <Link to="/signup" className="block w-full py-4 bg-cyan-600 hover:bg-cyan-500 rounded-full font-bold">
                Start Trial
              </Link>
            </div>
            <div className="bg-slate-800/80 border border-cyan-900/50 rounded-3xl p-10">
              <h3 className="text-3xl font-bold mb-4">Enterprise</h3>
              <p className="text-5xl font-black text-cyan-400 mb-6">Custom</p>
              <p className="text-slate-400 mb-8">10+ satellites • Dedicated support</p>
              <Link to="/contact" className="block w-full py-4 bg-white text-black hover:bg-gray-200 rounded-full font-bold">
                Contact Sales
              </Link>
            </div>
          </div>
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