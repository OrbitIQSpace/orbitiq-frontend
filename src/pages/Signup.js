// src/pages/Signup.js
import React from 'react';
import { SignUpButton } from '@clerk/clerk-react';

const Signup = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-6">
      <div className="bg-slate-900/80 backdrop-blur-xl border border-cyan-900/60 rounded-3xl p-12 shadow-2xl max-w-md w-full text-center">
        <h1 className="text-4xl font-black text-cyan-300 mb-8">Start Your Mission</h1>
        <p className="text-slate-400 mb-10">
          Create an account to begin tracking and optimizing your satellites
        </p>
        <SignUpButton mode="modal">
          <button className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 rounded-full font-bold text-xl shadow-2xl shadow-cyan-500/50 transition-all">
            Create Account
          </button>
        </SignUpButton>
      </div>
    </div>
  );
};

export default Signup;