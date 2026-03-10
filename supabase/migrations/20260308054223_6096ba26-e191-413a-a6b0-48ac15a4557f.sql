
CREATE TABLE public.squad_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  squad_name text NOT NULL,
  villages text[] NOT NULL DEFAULT '{}',
  assigned_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active',
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.squad_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view squad assignments" ON public.squad_assignments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert squad assignments" ON public.squad_assignments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update squad assignments" ON public.squad_assignments FOR UPDATE TO authenticated USING (true);

-- Seed initial assignments
INSERT INTO public.squad_assignments (squad_name, villages, status, notes) VALUES
  ('Squad Alpha', ARRAY['Hassan City', 'Arsikere'], 'active', 'Primary spray operations'),
  ('Squad Beta', ARRAY['Belur', 'Halebidu'], 'active', 'Monitoring & prevention'),
  ('Squad Gamma', ARRAY['Channarayapatna', 'Holenarasipura'], 'active', 'Field surveys');
