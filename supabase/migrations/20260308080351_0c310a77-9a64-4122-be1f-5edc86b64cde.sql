
-- Asha Workers table
CREATE TABLE public.asha_workers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  village_name TEXT NOT NULL,
  area TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.asha_workers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view asha workers" ON public.asha_workers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert asha workers" ON public.asha_workers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update asha workers" ON public.asha_workers FOR UPDATE TO authenticated USING (true);

-- Villages master list table
CREATE TABLE public.villages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  taluk TEXT NOT NULL DEFAULT 'Hassan',
  district TEXT NOT NULL DEFAULT 'Hassan',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.villages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view villages" ON public.villages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert villages" ON public.villages FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update villages" ON public.villages FOR UPDATE TO authenticated USING (true);
