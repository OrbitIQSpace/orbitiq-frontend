import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const SatelliteMap = ({ position, satelliteName }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  
  // NEW: State to track if the map should auto-follow the satellite
  const [isFollowing, setIsFollowing] = useState(true);

  useEffect(() => {
    if (!position) return;
    const { lng, lat, altitude } = position;

    // 1. INITIALIZE MAP
    if (!map.current) {
      mapboxgl.accessToken = 'pk.eyJ1Ijoib3JiaXRpcSIsImEiOiJjbWpkZWx6Z2kwNjR1M2Vvc2ZjeTcxNW9oIn0.7PQzAdVRtOzrhiCo6S6gUw';

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v9',
        center: [lng, lat],
        zoom: 5,
        pitch: 45,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // NEW: If user starts dragging, disable auto-follow
      map.current.on('dragstart', () => setIsFollowing(false));
      
      map.current.on('load', () => map.current.resize());
    }

    // 2. MARKER 
    if (!marker.current) {
      const el = document.createElement('div');
      el.className = 'satellite-icon';
      el.style.width = '60px';
      el.style.height = '60px';
      el.innerHTML = `
        <img 
          src="https://cdn-icons-png.flaticon.com/512/1912/1912175.png" 
          alt="Satellite" 
          style="width: 100%; height: 100%; object-fit: contain;"
        />
      `;

      marker.current = new mapboxgl.Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div class="bg-white text-gray-900 p-3 rounded shadow-lg">
              <h3 class="font-bold">${satelliteName || 'Satellite'}</h3>
              <p>Alt: ${altitude?.toFixed(0) || '—'} km</p>
            </div>`
          )
        )
        .addTo(map.current);
    } else {
      marker.current.setLngLat([lng, lat]);
    }

    // 3. AUTO-FOLLOW LOGIC
    // Only move the camera if isFollowing is true
    if (isFollowing) {
      map.current.easeTo({
        center: [lng, lat],
        duration: 1000,
      });
    }
  }, [position, satelliteName, isFollowing]);

  // NEW: Function to snap back to satellite
  const handleRecenter = () => {
    setIsFollowing(true); // Re-enable auto-follow
    if (map.current && position) {
      map.current.flyTo({
        center: [position.lng, position.lat],
        zoom: 5,
        speed: 1.2,
        curve: 1.4,
        essential: true
      });
    }
  };

  return (
    <div className="relative w-full h-[700px] group">
      <style>
        {`
          .satellite-icon {
            filter: drop-shadow(0 0 10px rgba(0, 255, 255, 0.7));
            transition: transform 0.2s ease;
            cursor: pointer;
          }
          .satellite-icon:hover {
            transform: scale(1.1);
          }
        `}
      </style>

      {/* NEW: Recenter Button UI */}
      <button
        onClick={handleRecenter}
        className={`absolute bottom-8 right-8 z-10 flex items-center gap-2 px-4 py-2 rounded-full shadow-2xl transition-all border 
          ${isFollowing 
            ? 'bg-cyan-600/20 text-cyan-400 border-cyan-400/30' 
            : 'bg-cyan-600 text-white border-cyan-300 hover:bg-cyan-500 animate-bounce'
          }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a48,48,0,1,1-48-48A48.05,48.05,0,0,1,176,128Z"></path>
        </svg>
        <span className="text-xs font-bold uppercase tracking-widest">
          {isFollowing ? 'Tracking' : 'Recenter'}
        </span>
      </button>

      <div ref={mapContainer} className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-cyan-900/30" />
    </div>
  );
};

export default SatelliteMap;