// src/utils/satellite.js
import { twoline2satrec, propagate, gstime, radiansToDegrees } from 'satellite.js';

const tleDatabase = {
  '25544': [
    '1 25544U 98067A   25304.12345678  .00016717  00000-0  10270-3 0  9999',
    '2 25544  51.6456  123.4567 0003456  87.6543 272.3456 15.72112345678900'
  ],
  // Add more satellites here
};

export const getTleForNorad = (noradId) => {
  return tleDatabase[noradId] || null;
};

export const propagateTle = (tleLine1, tleLine2, durationMinutes = 90) => {
  const satrec = twoline2satrec(tleLine1, tleLine2);
  const positions = [];
  const start = new Date();
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  let t = start;
  while (t <= end) {
    const positionAndVelocity = propagate(satrec, t);
    if (positionAndVelocity.position && typeof positionAndVelocity.position.x === 'number') {
      const gmst = gstime(t);
      const positionEci = positionAndVelocity.position;
      const positionGd = eciToGeodetic(positionEci, gmst);

      positions.push({
        time: t.toISOString(),
        latitude: radiansToDegrees(positionGd.latitude),
        longitude: radiansToDegrees(positionGd.longitude),
        height: positionGd.height * 1000 // km → meters
      });
    }
    t = new Date(t.getTime() + 60 * 1000); // 1-minute steps
  }

  return positions;
};

// Helper: Convert ECI to Geodetic
function eciToGeodetic(eci, gmst) {
  const a = 6378.137;
  const b = 6356.7523142;
  const R = Math.sqrt(eci.x * eci.x + eci.y * eci.y);
  const f = (a - b) / a;
  const e2 = 2 * f - f * f;

  let longitude = Math.atan2(eci.y, eci.x) - gmst;
  while (longitude < -Math.PI) longitude += 2 * Math.PI;
  while (longitude >= Math.PI) longitude -= 2 * Math.PI;

  let latitude = Math.atan2(eci.z, R * (1 - e2));
  let height = 0;
  let C;

  for (let i = 0; i < 10; i++) {
    const sinLatitude = Math.sin(latitude);
    C = 1 / Math.sqrt(1 - e2 * sinLatitude * sinLatitude);
    height = R * Math.cos(latitude) + eci.z * sinLatitude - a * C;
    latitude = Math.atan2(eci.z + a * C * e2 * sinLatitude, R);
  }

  return { longitude, latitude, height };
}