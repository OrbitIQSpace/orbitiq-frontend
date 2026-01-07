// src/pages/Landing.js — LIVE ISS TRACKING + CONTACT FORM
import React, { useEffect, useState } from 'react';
import { getSatelliteInfo } from 'tle.js';
import SatelliteMap from '../components/SatelliteMap';
import axios from '../api';

const Landing = () => {
  const [issPosition, setIssPosition] = useState(null);
  const [issTle, setIssTle] = useState(null);
  const [loadingTle, setLoadingTle] = useState(true);

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(''); // success / error / sending

  // 1. Fetch latest ISS TLE
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

  // Handle contact form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      // Using mailto: — simple, reliable, no backend needed
      const subject = encodeURIComponent(`OrbitIQ Inquiry from ${formData.name}${formData.company ? ` (${formData.company})` : ''}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nCompany: ${formData.company || 'Not provided'}\n\nMessage:\n${formData.message}`
      );

      window.location.href = `mailto:tyler@orbitiqspace.com?subject=${subject}&body=${body}`;

      setFormStatus('success');
      setFormData({ name: '', company: '', message: '' });
    } catch (err) {
      setFormStatus('error');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
            Real-time orbital analytics • Decay prediction • Reboost timing • Satellite health
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <a href="#contact" className="px-10 py-5 bg-cyan-600 hover:bg-cyan-500 rounded-full font-bold text-xl shadow-2xl shadow-cyan-500/50 transition-all">
              Get in Touch
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

      {/* CONTACT FORM */}
      <section id="contact" className="px-6 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8 text-cyan-300">Interested in OrbitIQ?</h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            We're currently onboarding select operators. Fill out the form below and we will reach out to discuss your mission needs.
          </p>

          <form onSubmit={handleFormSubmit} className="space-y-8 max-w-2xl mx-auto">
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                required
                className="w-full px-6 py-4 bg-slate-800/70 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Company / Organization"
                className="w-full px-6 py-4 bg-slate-800/70 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us about your mission, fleet size, or specific needs..."
                rows={6}
                required
                className="w-full px-6 py-4 bg-slate-800/70 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={formStatus === 'sending'}
              className={`w-full py-5 rounded-xl font-bold text-xl transition-all ${
                formStatus === 'sending'
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-2xl shadow-cyan-500/50'
              }`}
            >
              {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
            </button>

            {formStatus === 'success' && (
              <p className="text-green-400 text-lg">Message sent! We will be in touch soon.</p>
            )}
            {formStatus === 'error' && (
              <p className="text-red-400 text-lg">Failed to send. Please email tyler@orbitiqspace.com directly.</p>
            )}
          </form>

          <p className="text-slate-500 mt-12 text-sm">
            Or email directly: <a href="mailto:tyler@orbitiqspace.com" className="text-cyan-400 hover:underline">tyler@orbitiqspace.com</a>
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