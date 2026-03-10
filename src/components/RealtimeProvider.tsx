import { useRealtimeAlerts } from '@/hooks/useRealtimeAlerts';

export default function RealtimeProvider() {
  useRealtimeAlerts();
  return null;
}
