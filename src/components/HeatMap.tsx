import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type Hotspot, getRiskColor, getRiskLabel } from '@/hooks/useHotspots';
import { HASSAN_CENTER } from '@/utils/mockData';

interface HeatMapProps {
  hotspots: Hotspot[];
  onSelectHotspot?: (h: Hotspot) => void;
  className?: string;
}

export default function HeatMap({ hotspots, onSelectHotspot, className = '' }: HeatMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const callbackRef = useRef(onSelectHotspot);

  // Keep callback ref up to date without re-rendering markers
  useEffect(() => {
    callbackRef.current = onSelectHotspot;
  }, [onSelectHotspot]);

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const map = L.map(mapRef.current, {
      center: HASSAN_CENTER,
      zoom: 10,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    leafletMapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    }).addTo(map);

    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, []);

  // Update markers when hotspots change (not when callback changes)
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || hotspots.length === 0) return;

    // Clear existing circle markers
    map.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker) map.removeLayer(layer);
    });

    hotspots.forEach((v) => {
      const color = getRiskColor(v.risk_score);
      const marker = L.circleMarker([v.lat, v.lng], {
        radius: 10 + v.risk_score * 14,
        color,
        fillColor: color,
        fillOpacity: 0.5,
        weight: 2.5,
      }).addTo(map);

      marker.bindPopup(`
        <div style="padding: 4px 8px; font-family: 'Space Grotesk', Inter, sans-serif; min-width: 160px;">
          <h3 style="margin: 0 0 6px; font-size: 14px; font-weight: 700; color: #1a1a2e;">${v.village_name}</h3>
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${color};"></span>
            <span style="font-size: 13px; font-weight: 600;">${(v.risk_score * 100).toFixed(0)}%</span>
            <span style="font-size: 11px; color: #666;">— ${getRiskLabel(v.risk_score)}</span>
          </div>
          <p style="margin: 0; font-size: 11px; color: #888;">${v.temp}°C · ${v.humidity}% humidity · ${v.status}</p>
        </div>
      `);

      marker.on('click', () => {
        callbackRef.current?.(v);
      });
    });
  }, [hotspots]);

  return (
    <div className={`rounded-2xl overflow-hidden border border-border/60 shadow-elevated ${className}`}>
      <div ref={mapRef} style={{ height: '100%', minHeight: 400 }} />
    </div>
  );
}
