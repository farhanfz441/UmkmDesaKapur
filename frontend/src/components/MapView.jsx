import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation } from 'lucide-react';
import { getMapTileUrl } from '../utils/mapTile';

const CENTER = [-0.0745, 109.3855];

function FlyTo({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat != null && lng != null) {
      map.flyTo([lat, lng], 16, { duration: 0.8 });
    }
  }, [lat, lng, map]);
  return null;
}

function buildGmapsUrl(lat, lng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

function createIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
  });
}

export default function MapView({ umkmList, selectedId, onSelect }) {
  const selectedItem = selectedId ? umkmList.find((u) => u.id === selectedId) : null;
  return (
    <MapContainer
      center={CENTER}
      zoom={14}
      scrollWheelZoom
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {umkmList.map((item) => (
        <Marker
          key={item.id}
          position={[item.latitude, item.longitude]}
          icon={createIcon(item.kategori_warna || '#0F2A5C')}
          eventHandlers={{ click: () => onSelect && onSelect(item) }}
        >
          <Popup>
            <div className="min-w-[200px]">
              <div className="h-28 rounded-lg overflow-hidden mb-2 bg-surface-hover relative">
                <img
                  src={item.foto_url || getMapTileUrl(item.latitude, item.longitude, 15)}
                  alt={item.nama}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-6 h-6 rounded-full bg-navy/80 border-2 border-white shadow flex items-center justify-center">
                    <MapPin size={11} className="text-white" />
                  </div>
                </div>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">{item.kategori_nama}</p>
              <p className="font-bold text-navy-dark text-sm mb-1">{item.nama}</p>
              <p className="text-xs text-muted mb-2">{item.alamat}</p>
              <a
                href={buildGmapsUrl(item.latitude, item.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-navy hover:underline"
              >
                <Navigation size={11} /> Buka di Google Maps
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
      <FlyTo lat={selectedItem?.latitude ?? null} lng={selectedItem?.longitude ?? null} />
    </MapContainer>
  );
}
