import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react';
import AddSatellite from './components/AddSatellite';
import Satellites from './components/Satellites';
import SatelliteDetails from './components/SatelliteDetails';
import DigitalTwin from './components/DigitalTwin'; // ← NEW IMPORT
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const [refreshTelemetry, setRefreshTelemetry] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleSatelliteAdded = () => {
    setRefreshTelemetry(prev => prev + 1);
    setIsAddModalOpen(false);
  };

  return (
    <Router>
      <AppContent 
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        handleSatelliteAdded={handleSatelliteAdded}
        refreshTelemetry={refreshTelemetry}
        setRefreshTelemetry={setRefreshTelemetry}
      />
    </Router>
  );
}

const AppContent = ({ isAddModalOpen, setIsAddModalOpen, handleSatelliteAdded, refreshTelemetry, setRefreshTelemetry }) => {
  const location = useLocation();

  const showAddButton = location.pathname === '/dashboard';
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">

      {/* HEADER */}
      <header className="fixed inset-x-0 top-0 z-[9999] border-b border-cyan-900/50 bg-black/90 backdrop-blur-2xl shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-5 group select-none">
            <div className="relative">
              <svg width="220" height="70" viewBox="0 0 220 70" className="drop-shadow-xl group-hover:drop-shadow-cyan-400/80 transition">
                <path d="M 28 38 Q 50 -4 92 20" fill="none" stroke="#06b6d4" strokeWidth="3" opacity="0.7"/>
                <defs>
                  <linearGradient id="trail" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                    <stop offset="30%" stopColor="#06b6d4" stopOpacity="0.9" />
                    <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M 28 38 Q 50 -4 92 20" fill="none" stroke="url(#trail)" strokeWidth="7" opacity="0.6"/>
                <circle cx="92" cy="20" r="8" fill="#06b6d4">
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="92" cy="20" r="12" fill="#06b6d4" opacity="0.3" />
                <text x="130" y="55" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="48" fill="#06b6d4" textAnchor="middle" className="tracking-tight">
                  OrbitIQ
                </text>
              </svg>
            </div>
          </Link>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6">
            {/* GO TO DASHBOARD — ONLY ON LANDING PAGE WHEN LOGGED IN */}
            <SignedIn>
              {isLandingPage && (
                <Link to="/dashboard">
                  <button className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium text-white shadow-lg shadow-cyan-500/40 hover:shadow-cyan-400/60 transition-all duration-300 text-sm">
                    Go to Dashboard
                  </button>
                </Link>
              )}
            </SignedIn>

            {/* LOGIN — ONLY ON LANDING PAGE WHEN NOT LOGGED IN */}
            <SignedOut>
              {isLandingPage && (
                <SignInButton mode="modal">
                  <button className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium text-white shadow-lg shadow-slate-500/40 hover:shadow-slate-400/60 transition-all duration-300 text-sm">
                    Login
                  </button>
                </SignInButton>
              )}
            </SignedOut>

            {/* ADD SATELLITE — ONLY ON DASHBOARD */}
            {showAddButton && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium text-white shadow-lg shadow-cyan-500/40 hover:shadow-cyan-400/60 transition-all duration-300 text-sm"
              >
                Add Satellite
              </button>
            )}

            {/* USER BUTTON — WHEN LOGGED IN */}
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative pt-32 min-h-screen max-w-7xl mx-auto px-6 pb-20">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/dashboard" element={
            <SignedIn>
              <div className="space-y-12">
                <div className="text-center pt-8">
                  <h2 className="text-5xl font-bold text-cyan-300 mb-3">Satellite Fleet Overview</h2>
                  <p className="text-cyan-500 font-mono text-lg">Live tracking • Telemetry • Command</p>
                </div>

                <div className="mt-20">
                  <div className="bg-slate-800/70 backdrop-blur-xl border border-cyan-900/50 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="px-8 py-6 border-b border-cyan-900/30 flex justify-between items-center">
                      <h3 className="text-2xl font-bold text-cyan-300">Satellites</h3>
                      <button
                        onClick={() => setRefreshTelemetry(prev => prev + 1)}
                        className="px-5 py-2 bg-cyan-600/80 hover:bg-cyan-500/80 text-white rounded-lg font-medium text-sm shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 transition-all"
                      >
                        Refresh
                      </button>
                    </div>
                    <div className="p-6 bg-slate-900/60">
                      <Satellites refreshKey={refreshTelemetry} />
                    </div>
                  </div>
                </div>

                <div className="text-center py-12">
                  <p className="text-cyan-400 font-mono text-sm tracking-widest opacity-90">
                    REAL-TIME SATELLITE COMMAND & CONTROL
                  </p>
                  <p className="text-cyan-500 font-mono text-xs tracking-widest opacity-70 mt-2">
                    ORBITIQ • ACTIVE • {new Date().getFullYear()}
                  </p>
                </div>
              </div>
            </SignedIn>
          } />

          {/* SATELLITE DETAILS ROUTE */}
          <Route path="/satellite/:noradId" element={
            <SignedIn>
              <SatelliteDetails />
            </SignedIn>
          } />

          {/* NEW DIGITAL TWIN ROUTE */}
          <Route path="/satellite/:noradId/digital-twin" element={
            <SignedIn>
              <DigitalTwin />
            </SignedIn>
          } />
        </Routes>
      </main>

      {/* ADD SATELLITE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-cyan-800/50 rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-cyan-300">Add Satellite</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-cyan-400 hover:text-white transition text-2xl"
              >
                X
              </button>
            </div>
            <AddSatellite onSatelliteAdded={handleSatelliteAdded} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;