import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AshaWorker {
  id: string;
  name: string;
  phone: string;
  village_name: string;
  area: string;
  status: string;
  created_at: string;
}

export function useAshaWorkers() {
  return useQuery({
    queryKey: ['asha_workers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('asha_workers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as AshaWorker[];
    },
  });
}

export function useInsertAshaWorker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (worker: Omit<AshaWorker, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('asha_workers').insert(worker).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['asha_workers'] }),
  });
}

export interface Village {
  id: string;
  name: string;
  taluk: string;
  district: string;
  created_at: string;
}

export function useVillages() {
  return useQuery({
    queryKey: ['villages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('villages')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Village[];
    },
  });
}

export function useInsertVillage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (village: { name: string; taluk?: string; district?: string }) => {
      const { data, error } = await supabase.from('villages').insert(village).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['villages'] }),
  });
}
