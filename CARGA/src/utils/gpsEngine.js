// Pure geospatial utilities for CARGA real-time GPS tracking & slippy map projection

const KNOWN_LOCATIONS = [
  { keywords: ['sumilihon'], lat: 8.9835, lng: 125.6265 },
  { keywords: ['ampayon'], lat: 8.9589, lng: 125.5968 },
  { keywords: ['langihan'], lat: 8.9542, lng: 125.5348 },
  { keywords: ['libertad'], lat: 8.9432, lng: 125.5055 },
  { keywords: ['baan'], lat: 8.9495, lng: 125.5532 },
  { keywords: ['bading', 'agusan'], lat: 8.9565, lng: 125.5435 },
  { keywords: ['bancasi'], lat: 8.9478, lng: 125.4785 },
  { keywords: ['buenavista'], lat: 8.9765, lng: 125.4088 },
  { keywords: ['nasipit'], lat: 8.9858, lng: 125.3412 },
  { keywords: ['cabadbaran'], lat: 9.1235, lng: 125.5345 },
  { keywords: ['butuan'], lat: 8.9475, lng: 125.5406 },
  { keywords: ['surigao'], lat: 9.789, lng: 125.495 },
  { keywords: ['cagayan'], lat: 8.4542, lng: 124.6319 },
  { keywords: ['davao'], lat: 7.1907, lng: 125.4553 },
  { keywords: ['valencia'], lat: 7.9064, lng: 125.0942 },
  { keywords: ['malaybalay'], lat: 8.1575, lng: 125.1277 },
];

// Default regional anchor (Butuan / Caraga agricultural corridor)
const DEFAULT_ANCHOR = { lat: 8.9495, lng: 125.5435 };

export function resolveLocationCoords(label, seedOffset = 0) {
  const clean = String(label || '').trim();
  if (!clean) return { ...DEFAULT_ANCHOR };

  // Support explicit "lat, lng" input if entered
  const coordMatch = clean.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
  if (coordMatch) {
    return {
      lat: Number(coordMatch[1]),
      lng: Number(coordMatch[2]),
    };
  }

  const lower = clean.toLowerCase();
  const matched = KNOWN_LOCATIONS.find((loc) =>
    loc.keywords.some((kw) => lower.includes(kw))
  );
  if (matched) {
    return { lat: matched.lat, lng: matched.lng };
  }

  // Deterministic regional offset for any custom barangay or market name
  const hash = clean
    .split('')
    .reduce((acc, ch, idx) => acc + ch.charCodeAt(0) * (idx + 3), seedOffset * 17);

  const latOffset = (((hash % 140) - 70) / 1000) * 0.65;
  const lngOffset = ((((hash * 7) % 140) - 70) / 1000) * 0.65;

  return {
    lat: Number((DEFAULT_ANCHOR.lat + latOffset).toFixed(6)),
    lng: Number((DEFAULT_ANCHOR.lng + lngOffset).toFixed(6)),
  };
}

export function calculateHaversineKm(coordA, coordB) {
  if (!coordA || !coordB) return 0;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(coordB.lat - coordA.lat);
  const dLng = toRad(coordB.lng - coordA.lng);
  const lat1 = toRad(coordA.lat);
  const lat2 = toRad(coordB.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Number((R * c).toFixed(1));
}

export function calculateBearingDegrees(fromCoord, toCoord) {
  if (!fromCoord || !toCoord) return 0;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;

  const lat1 = toRad(fromCoord.lat);
  const lat2 = toRad(toCoord.lat);
  const dLng = toRad(toCoord.lng - fromCoord.lng);

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  return Math.round((toDeg(Math.atan2(y, x)) + 360) % 360);
}

export function generateRoadWaypoints(startCoord, endCoord, segments = 12) {
  if (!startCoord || !endCoord) return [];
  const points = [];
  const dLat = endCoord.lat - startCoord.lat;
  const dLng = endCoord.lng - startCoord.lng;

  // Perpendicular vector to simulate realistic highway curvature
  const perpLat = -dLng * 0.14;
  const perpLng = dLat * 0.14;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const curveEnvelope = Math.sin(t * Math.PI);
    const roadJitter = Math.sin(t * Math.PI * 3) * 0.035 * curveEnvelope;

    points.push({
      lat: Number((startCoord.lat + dLat * t + perpLat * curveEnvelope + dLat * roadJitter).toFixed(6)),
      lng: Number((startCoord.lng + dLng * t + perpLng * curveEnvelope + dLng * roadJitter).toFixed(6)),
    });
  }
  return points;
}

export function interpolateAlongWaypoints(waypoints, fraction) {
  if (!waypoints || waypoints.length === 0) {
    return { coords: { ...DEFAULT_ANCHOR }, heading: 0 };
  }
  if (waypoints.length === 1 || fraction <= 0) {
    const heading =
      waypoints.length > 1 ? calculateBearingDegrees(waypoints[0], waypoints[1]) : 0;
    return { coords: waypoints[0], heading };
  }
  if (fraction >= 1) {
    const lastIdx = waypoints.length - 1;
    const heading = calculateBearingDegrees(waypoints[lastIdx - 1], waypoints[lastIdx]);
    return { coords: waypoints[lastIdx], heading };
  }

  const totalSegments = waypoints.length - 1;
  const scaled = fraction * totalSegments;
  const idx = Math.min(Math.floor(scaled), totalSegments - 1);
  const localT = scaled - idx;

  const p1 = waypoints[idx];
  const p2 = waypoints[idx + 1];

  const coords = {
    lat: Number((p1.lat + (p2.lat - p1.lat) * localT).toFixed(6)),
    lng: Number((p1.lng + (p2.lng - p1.lng) * localT).toFixed(6)),
  };
  const heading = calculateBearingDegrees(p1, p2);

  return { coords, heading };
}

export function formatGpsCoords(coords) {
  if (!coords || typeof coords.lat !== 'number' || typeof coords.lng !== 'number') {
    return '8.9495° N, 125.5435° E';
  }
  const latDir = coords.lat >= 0 ? 'N' : 'S';
  const lngDir = coords.lng >= 0 ? 'E' : 'W';
  return `${Math.abs(coords.lat).toFixed(4)}° ${latDir}, ${Math.abs(coords.lng).toFixed(4)}° ${lngDir}`;
}