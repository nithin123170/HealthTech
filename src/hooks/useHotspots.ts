import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type Hotspot = Tables<'hotspots'>;
export type HotspotInsert = TablesInsert<'hotspots'>;

export function useHotspots() {
  return useQuery({
    queryKey: ['hotspots'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hotspots')
        .select('*')
        .order('risk_score', { ascending: false });
      if (error) throw error;
      return data as Hotspot[];
    },
  });
}

export function useInsertHotspot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (hotspot: HotspotInsert) => {
      const { data, error } = await supabase.from('hotspots').insert(hotspot).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hotspots'] }),
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('alerts').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alerts'] }),
  });
}

export function useInsertAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (alert: TablesInsert<'alerts'>) => {
      const { data, error } = await supabase.from('alerts').insert(alert).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alerts'] }),
  });
}

// Helper functions kept for compatibility
export function predictRisk(temp: number, humidity: number, rain_mm: number, water_stagnation_days: number): number {
  const rain_lag = Math.max(0, 1 - rain_mm / 20);
  const stag = Math.min(water_stagnation_days / 10, 1);
  const t = Math.min(Math.max((temp - 25) / 20, 0), 1);
  const h = humidity / 100;
  const score = 0.41 * t + 0.39 * rain_lag + 0.20 * h * stag;
  return Math.min(Math.max(score, 0), 1);
}

export function getRiskColor(score: number): string {
  if (score >= 0.7) return 'hsl(0, 84%, 60%)';
  if (score >= 0.3) return 'hsl(38, 95%, 54%)';
  return 'hsl(152, 68%, 38%)';
}

export function getRiskLabel(score: number): string {
  if (score >= 0.7) return 'High Risk';
  if (score >= 0.3) return 'Medium Risk';
  return 'Low Risk';
}
