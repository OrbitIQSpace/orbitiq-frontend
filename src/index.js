// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'mapbox-gl/dist/mapbox-gl.css';
//import './index.css';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';

const publishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error('Missing Clerk Publishable Key');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ClerkProvider publishableKey={publishableKey}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ClerkProvider>
);