import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { HASSAN_CENTER, VILLAGES, getRiskColor, getRiskLabel, type Hotspot } from '@/utils/mockData';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

function FitBounds() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

interface LeafletMapProps {
  onSelectHotspot?: (h: Hotspot) => void;
}

export default function LeafletMap({ onSelectHotspot }: LeafletMapProps) {
  return (
    <MapContainer
      center={HASSAN_CENTER}
      zoom={10}
      scrollWheelZoom={true}
      style={{ height: '100%', minHeight: 400 }}
    >
      <FitBounds />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {VILLAGES.map((v) => (
        <CircleMarker
          key={v.id}
          center={[v.lat, v.lng]}
          radius={12 + v.risk_score * 12}
          pathOptions={{
            fillColor: getRiskColor(v.risk_score),
            color: getRiskColor(v.risk_score),
            fillOpacity: 0.6,
            weight: 2,
          }}
          eventHandlers={{
            click: () => onSelectHotspot?.(v),
          }}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-bold text-sm">{v.village_name}</h3>
              <p className="text-xs">Risk: <strong>{(v.risk_score * 100).toFixed(0)}%</strong> — {getRiskLabel(v.risk_score)}</p>
              <p className="text-xs">Temp: {v.temp}°C | Humidity: {v.humidity}%</p>
              <p className="text-xs">Status: {v.status}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
