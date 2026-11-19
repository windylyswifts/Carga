import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Truck,
  Crosshair,
  Maximize2,
  Layers,
  Plus,
  Minus,
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';

const TILE_SIZE = 256;

function latLngToWorldPixel(lat, lng, zoom) {
  const scale = TILE_SIZE * Math.pow(2, zoom);
  const worldX = ((lng + 180) / 360) * scale;
  const sinLat = Math.sin((lat * Math.PI) / 180);
  const clampedSin = Math.max(-0.9999, Math.min(0.9999, sinLat));
  const worldY =
    (0.5 - Math.log((1 + clampedSin) / (1 - clampedSin)) / (4 * Math.PI)) * scale;
  return { x: worldX, y: worldY };
}

export default function LiveGpsMap({
  truckCoords,
  pickupCoords,
  destinationCoords,
  approachWaypoints = [],
  deliveryWaypoints = [],
  heading = 0,
  speedKmh = 0,
  stageIndex = 0,
  plateNumber = '',
}) {
  const { t } = useLogistics();
  const containerRef = useRef(null);

  const [zoom, setZoom] = useState(13);
  const [center, setCenter] = useState(
    truckCoords || pickupCoords || { lat: 8.9495, lng: 125.5435 }
  );
  const [followTruck, setFollowTruck] = useState(true);
  const [mapLayer, setMapLayer] = useState('street');
  const [viewport, setViewport] = useState({ width: 640, height: 320 });
  const [tileErrors, setTileErrors] = useState({});

  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    startCenter: null,
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      setViewport({
        width: el.clientWidth || 640,
        height: el.clientHeight || 320,
      });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (followTruck && truckCoords) {
      setCenter(truckCoords);
    }
  }, [followTruck, truckCoords]);

  const handleFitFullRoute = () => {
    const points = [truckCoords, pickupCoords, destinationCoords].filter(Boolean);
    if (points.length === 0) return;

    const lats = points.map((p) => p.lat);
    const lngs = points.map((p) => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const midLat = (minLat + maxLat) / 2;
    const midLng = (minLng + maxLng) / 2;
    const span = Math.max(maxLat - minLat, maxLng - minLng);

    let nextZoom = 13;
    if (span > 0.5) nextZoom = 10;
    else if (span > 0.2) nextZoom = 11;
    else if (span > 0.09) nextZoom = 12;
    else if (span > 0.04) nextZoom = 13;
    else nextZoom = 14;

    setFollowTruck(false);
    setZoom(nextZoom);
    setCenter({ lat: midLat, lng: midLng });
  };

  const centerWorld = latLngToWorldPixel(center.lat, center.lng, zoom);
  const projectToScreen = (coord) => {
    if (!coord) return { x: -999, y: -999 };
    const world = latLngToWorldPixel(coord.lat, coord.lng, zoom);
    return {
      x: viewport.width / 2 + (world.x - centerWorld.x),
      y: viewport.height / 2 + (world.y - centerWorld.y),
    };
  };

  const numTiles = Math.pow(2, zoom);
  const topLeftWorldX = centerWorld.x - viewport.width / 2;
  const topLeftWorldY = centerWorld.y - viewport.height / 2;

  const startTileX = Math.floor(topLeftWorldX / TILE_SIZE);
  const endTileX = Math.floor((topLeftWorldX + viewport.width) / TILE_SIZE);
  const startTileY = Math.floor(topLeftWorldY / TILE_SIZE);
  const endTileY = Math.floor((topLeftWorldY + viewport.height) / TILE_SIZE);

  const visibleTiles = [];
  for (let tx = startTileX; tx <= endTileX; tx++) {
    for (let ty = startTileY; ty <= endTileY; ty++) {
      if (ty < 0 || ty >= numTiles) continue;
      const wrappedX = ((tx % numTiles) + numTiles) % numTiles;
      const left = tx * TILE_SIZE - topLeftWorldX;
      const top = ty * TILE_SIZE - topLeftWorldY;

      const tileUrl =
        mapLayer === 'satellite'
          ? `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${ty}/${wrappedX}`
          : `https://a.basemaps.cartocdn.com/rastertiles/voyager/${zoom}/${wrappedX}/${ty}.png`;

      visibleTiles.push({
        key: `${mapLayer}-${zoom}-${tx}-${ty}`,
        url: tileUrl,
        left,
        top,
      });
    }
  }

  const handlePointerDown = (e) => {
    if (e.target.closest('button')) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startCenter: { ...center },
    };
    setFollowTruck(false);
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.active || !dragRef.current.startCenter) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    const scale = TILE_SIZE * Math.pow(2, zoom);
    const startWorld = latLngToWorldPixel(
      dragRef.current.startCenter.lat,
      dragRef.current.startCenter.lng,
      zoom
    );

    const nextWorldX = startWorld.x - dx;
    const nextWorldY = startWorld.y - dy;

    const nextLng = (nextWorldX / scale) * 360 - 180;
    const n = Math.PI - (2 * Math.PI * nextWorldY) / scale;
    const nextLat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));

    setCenter({
      lat: Math.max(-85, Math.min(85, nextLat)),
      lng: nextLng,
    });
  };

  const handlePointerUp = () => {
    dragRef.current.active = false;
  };

  const truckScreen = projectToScreen(truckCoords);
  const pickupScreen = projectToScreen(pickupCoords);
  const destScreen = projectToScreen(destinationCoords);

  const approachPolyline = approachWaypoints
    .map((pt) => {
      const p = projectToScreen(pt);
      return `${p.x},${p.y}`;
    })
    .join(' ');

  const deliveryPolyline = deliveryWaypoints
    .map((pt) => {
      const p = projectToScreen(pt);
      return `${p.x},${p.y}`;
    })
    .join(' ');

  const isMoving = (stageIndex === 1 || stageIndex === 3) && speedKmh > 0;

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full h-72 sm:h-80 rounded-2xl border-2 border-slate-300 overflow-hidden bg-slate-200 select-none touch-none cursor-grab active:cursor-grabbing shadow-inner"
    >
      {/* Subtle Offline / Fallback Coordinate Grid */}
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            'linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Slippy Map Tiles Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {visibleTiles.map((tile) =>
          tileErrors[tile.key] ? null : (
            <img
              key={tile.key}
              src={tile.url}
              alt=""
              draggable={false}
              onError={() =>
                setTileErrors((prev) => ({ ...prev, [tile.key]: true }))
              }
              style={{
                position: 'absolute',
                left: `${tile.left}px`,
                top: `${tile.top}px`,
                width: `${TILE_SIZE}px`,
                height: `${TILE_SIZE}px`,
              }}
              className="max-w-none"
            />
          )
        )}
      </div>

      {/* SVG GPS Route Overlay (Approach Path + Harvest Delivery Corridor) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {approachPolyline && (
          <polyline
            points={approachPolyline}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3.5"
            strokeDasharray="6 6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />
        )}

        {deliveryPolyline && (
          <>
            <polyline
              points={deliveryPolyline}
              fill="none"
              stroke="#0f172a"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.3"
            />
            <polyline
              points={deliveryPolyline}
              fill="none"
              stroke="#10b981"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
      </svg>

      {/* Farm Pickup Pin */}
      <div
        style={{ left: `${pickupScreen.x}px`, top: `${pickupScreen.y}px` }}
        className="absolute -translate-x-1/2 -translate-y-full pointer-events-none z-10 flex flex-col items-center"
      >
        <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-white text-[10px] font-extrabold shadow-md whitespace-nowrap mb-1">
          {t('mapPinFarm')}
        </span>
        <div className="w-7 h-7 rounded-full bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center text-white">
          <MapPin className="w-4 h-4" />
        </div>
      </div>

      {/* Market Destination Pin */}
      <div
        style={{ left: `${destScreen.x}px`, top: `${destScreen.y}px` }}
        className="absolute -translate-x-1/2 -translate-y-full pointer-events-none z-10 flex flex-col items-center"
      >
        <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-extrabold shadow-md whitespace-nowrap mb-1">
          {t('mapPinMarket')}
        </span>
        <div className="w-7 h-7 rounded-full bg-red-600 border-2 border-white shadow-md flex items-center justify-center text-white">
          <MapPin className="w-4 h-4" />
        </div>
      </div>

      {/* LIVE MOVING TRUCK GPS MARKER */}
      <div
        style={{ left: `${truckScreen.x}px`, top: `${truckScreen.y}px` }}
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 transition-all duration-700 ease-linear"
      >
        <div className="relative flex flex-col items-center">
          <div className="mb-1.5 px-2.5 py-0.5 rounded-full bg-slate-950/90 text-white text-[10px] font-extrabold shadow-lg border border-emerald-400/60 flex items-center gap-1.5 whitespace-nowrap">
            <span
              className={`w-2 h-2 rounded-full ${
                isMoving ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
              }`}
            />
            <span>{plateNumber}</span>
            {isMoving && <span className="text-emerald-300">• {speedKmh} km/h</span>}
          </div>

          <div className="relative flex items-center justify-center">
            <span
              className={`absolute w-14 h-14 rounded-full ${
                isMoving ? 'bg-emerald-500/30 animate-ping' : 'bg-amber-500/25'
              }`}
            />
            <div
              style={{ transform: `rotate(${heading}deg)` }}
              className="w-11 h-11 rounded-full bg-slate-900 border-2 border-white shadow-xl flex items-center justify-center text-emerald-400 transition-transform duration-500"
            >
              <Truck className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Top-Left Map Camera Controls */}
      <div className="absolute top-3 left-3 z-30 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => {
            setFollowTruck(true);
            if (truckCoords) setCenter(truckCoords);
          }}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md transition cursor-pointer ${
            followTruck
              ? 'bg-emerald-600 text-white'
              : 'bg-white/95 text-slate-800 hover:bg-white'
          }`}
        >
          <Crosshair className="w-3.5 h-3.5" />
          <span>{t('gpsFollowTruck')}</span>
        </button>

        <button
          type="button"
          onClick={handleFitFullRoute}
          className="px-2.5 py-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-800 text-xs font-extrabold flex items-center gap-1.5 shadow-md transition cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>{t('gpsViewRoute')}</span>
        </button>

        <button
          type="button"
          onClick={() =>
            setMapLayer((prev) => (prev === 'street' ? 'satellite' : 'street'))
          }
          className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md transition cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {mapLayer === 'street' ? t('gpsLayerSat') : t('gpsLayerStreet')}
          </span>
        </button>
      </div>

      {/* Bottom-Right Zoom Controls */}
      <div className="absolute bottom-3 right-3 z-30 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(17, z + 1))}
          aria-label="Zoom in"
          className="w-9 h-9 rounded-xl bg-white/95 hover:bg-white text-slate-900 shadow-md flex items-center justify-center font-extrabold cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(10, z - 1))}
          aria-label="Zoom out"
          className="w-9 h-9 rounded-xl bg-white/95 hover:bg-white text-slate-900 shadow-md flex items-center justify-center font-extrabold cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}