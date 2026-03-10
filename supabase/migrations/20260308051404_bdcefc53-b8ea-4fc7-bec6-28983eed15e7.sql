
-- Create hotspots table
CREATE TABLE public.hotspots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  temp DOUBLE PRECISION NOT NULL,
  humidity DOUBLE PRECISION NOT NULL,
  rain_mm DOUBLE PRECISION NOT NULL DEFAULT 0,
  water_stagnation_days INTEGER NOT NULL DEFAULT 0,
  risk_score DOUBLE PRECISION NOT NULL DEFAULT 0,
  village_name TEXT NOT NULL,
  photo_url TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'monitoring')),
  reported_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hotspot_id UUID REFERENCES public.hotspots(id) ON DELETE CASCADE NOT NULL,
  village TEXT NOT NULL,
  sent_to TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'read', 'resolved')),
  risk_score DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create forecasts table
CREATE TABLE public.forecasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  risk_level DOUBLE PRECISION NOT NULL,
  confidence DOUBLE PRECISION NOT NULL,
  district TEXT NOT NULL DEFAULT 'Tumkūr',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hotspots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forecasts ENABLE ROW LEVEL SECURITY;

-- Hotspots policies
CREATE POLICY "Anyone can view hotspots" ON public.hotspots FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert hotspots" ON public.hotspots FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update hotspots" ON public.hotspots FOR UPDATE TO authenticated USING (true);

-- Alerts policies
CREATE POLICY "Anyone can view alerts" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert alerts" ON public.alerts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update alerts" ON public.alerts FOR UPDATE TO authenticated USING (true);

-- Forecasts policies
CREATE POLICY "Anyone can view forecasts" ON public.forecasts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert forecasts" ON public.forecasts FOR INSERT TO authenticated WITH CHECK (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_hotspots_updated_at
  BEFORE UPDATE ON public.hotspots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
