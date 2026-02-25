'use client';

import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default marker icon in leaflet + nextjs
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapComponent() {
  // Set default icon for all markers
  useEffect(() => {
    L.Marker.prototype.options.icon = icon;
  }, []);

  return (
    <div className="h-full w-full rounded-xl overflow-hidden z-0 relative">
      <MapContainer center={[18.7883, 98.9853]} zoom={11} style={{ height: '100%', width: '100%', zIndex: 0 }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Sensor Marker */}
        <Marker position={[18.7883, 98.9853]}>
          <Popup>
            <div className="text-center">
              <strong className="text-primary">อ.เมือง เชียงใหม่</strong><br />
              PM 2.5: 85 µg/m³<br />
              <span className="text-xs text-gray-500">อัปเดตเมื่อ 10 นาทีที่แล้ว</span>
            </div>
          </Popup>
        </Marker>
        
        {/* Hotspot Marker (Heatmap simulation) */}
        <CircleMarker center={[18.82, 98.95]} radius={30} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.4 }}>
          <Popup>จุดความร้อน (Hotspot) - อ.แม่ริม</Popup>
        </CircleMarker>
        
        <CircleMarker center={[18.75, 99.05]} radius={20} pathOptions={{ color: 'orange', fillColor: 'orange', fillOpacity: 0.4 }}>
          <Popup>จุดความร้อน (Hotspot) - อ.สันกำแพง</Popup>
        </CircleMarker>
      </MapContainer>
    </div>
  );
}
