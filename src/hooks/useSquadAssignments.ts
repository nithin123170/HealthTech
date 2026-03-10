import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SquadAssignment {
  id: string;
  squad_name: string;
  villages: string[];
  assigned_by: string | null;
  status: string;
  notes: string;
  created_at: string;
}

export function useSquadAssignments() {
  return useQuery({
    queryKey: ['squad_assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('squad_assignments' as any)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as unknown as SquadAssignment[];
    },
  });
}
