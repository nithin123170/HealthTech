export interface Hotspot {
  id: string;
  lat: number;
  lng: number;
  temp: number;
  humidity: number;
  rain_mm: number;
  water_stagnation_days: number;
  risk_score: number;
  village_name: string;
  photo_url: string;
  timestamp: string;
  status: 'active' | 'resolved' | 'monitoring';
}

export interface Forecast {
  date: string;
  risk_level: number;
  confidence: number;
  district: string;
}

export interface Alert {
  id: string;
  hotspot_id: string;
  village: string;
  sent_to: string;
  status: 'sent' | 'read' | 'resolved';
  timestamp: string;
  risk_score: number;
}

export const HASSAN_CENTER: [number, number] = [13.0068, 76.1004];

export const VILLAGES: Hotspot[] = [
  { id: '1', lat: 13.0068, lng: 76.1004, temp: 38, humidity: 72, rain_mm: 2, water_stagnation_days: 5, risk_score: 0.85, village_name: 'Hassan City', photo_url: '', timestamp: '2026-03-07T10:30:00Z', status: 'active' },
  { id: '2', lat: 12.9200, lng: 76.0500, temp: 35, humidity: 65, rain_mm: 8, water_stagnation_days: 3, risk_score: 0.62, village_name: 'Channarayapatna', photo_url: '', timestamp: '2026-03-07T09:15:00Z', status: 'monitoring' },
  { id: '3', lat: 13.1200, lng: 76.0000, temp: 40, humidity: 80, rain_mm: 0, water_stagnation_days: 7, risk_score: 0.92, village_name: 'Arsikere', photo_url: '', timestamp: '2026-03-06T14:00:00Z', status: 'active' },
  { id: '4', lat: 12.8600, lng: 75.9800, temp: 33, humidity: 60, rain_mm: 12, water_stagnation_days: 1, risk_score: 0.35, village_name: 'Holenarasipura', photo_url: '', timestamp: '2026-03-07T11:00:00Z', status: 'resolved' },
  { id: '5', lat: 13.0500, lng: 75.9000, temp: 36, humidity: 68, rain_mm: 5, water_stagnation_days: 4, risk_score: 0.71, village_name: 'Belur', photo_url: '', timestamp: '2026-03-06T16:30:00Z', status: 'active' },
  { id: '6', lat: 13.1600, lng: 76.2500, temp: 39, humidity: 75, rain_mm: 1, water_stagnation_days: 6, risk_score: 0.88, village_name: 'Arasikere', photo_url: '', timestamp: '2026-03-07T08:00:00Z', status: 'active' },
  { id: '7', lat: 12.7300, lng: 75.7900, temp: 32, humidity: 55, rain_mm: 15, water_stagnation_days: 0, risk_score: 0.22, village_name: 'Sakleshpur', photo_url: '', timestamp: '2026-03-07T12:00:00Z', status: 'resolved' },
  { id: '8', lat: 13.0900, lng: 75.8500, temp: 37, humidity: 70, rain_mm: 3, water_stagnation_days: 5, risk_score: 0.78, village_name: 'Halebidu', photo_url: '', timestamp: '2026-03-06T15:00:00Z', status: 'monitoring' },
  { id: '9', lat: 13.2100, lng: 76.1500, temp: 41, humidity: 82, rain_mm: 0, water_stagnation_days: 8, risk_score: 0.95, village_name: 'Javagal', photo_url: '', timestamp: '2026-03-07T07:00:00Z', status: 'active' },
  { id: '10', lat: 12.9500, lng: 76.2000, temp: 34, humidity: 63, rain_mm: 10, water_stagnation_days: 2, risk_score: 0.45, village_name: 'Arkalgud', photo_url: '', timestamp: '2026-03-07T13:00:00Z', status: 'monitoring' },
];

export function predictRisk(temp: number, humidity: number, rain_mm: number, water_stagnation_days: number): number {
  const rain_lag = Math.max(0, 1 - rain_mm / 20);
  const stag = Math.min(water_stagnation_days / 10, 1);
  const t = Math.min(Math.max((temp - 25) / 20, 0), 1);
  const h = humidity / 100;
  const score = 0.41 * t + 0.39 * rain_lag + 0.20 * h * stag;
  return Math.min(Math.max(score, 0), 1);
}

export function getRiskColor(score: number): string {
  if (score >= 0.7) return 'hsl(0, 72%, 51%)';
  if (score >= 0.3) return 'hsl(45, 93%, 52%)';
  return 'hsl(160, 64%, 40%)';
}

export function getRiskLabel(score: number): string {
  if (score >= 0.7) return 'High Risk';
  if (score >= 0.3) return 'Medium Risk';
  return 'Low Risk';
}

export function getRiskBgClass(score: number): string {
  if (score >= 0.7) return 'gradient-danger';
  if (score >= 0.3) return 'gradient-warning';
  return 'gradient-primary';
}

export const MOCK_FORECASTS: Forecast[] = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return {
    date: d.toISOString().split('T')[0],
    risk_level: +(0.4 + Math.random() * 0.5).toFixed(2),
    confidence: +(0.7 + Math.random() * 0.25).toFixed(2),
    district: 'Hassan',
  };
});

export const MOCK_ALERTS: Alert[] = VILLAGES.filter(v => v.risk_score >= 0.7).map((v, i) => ({
  id: `alert-${i}`,
  hotspot_id: v.id,
  village: v.village_name,
  sent_to: `+91 98765 ${43210 + i}`,
  status: i % 3 === 0 ? 'resolved' : i % 2 === 0 ? 'read' : 'sent',
  timestamp: v.timestamp,
  risk_score: v.risk_score,
}));
