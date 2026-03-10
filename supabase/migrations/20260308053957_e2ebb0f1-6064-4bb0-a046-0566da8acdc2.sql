
-- Drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Anyone can view alerts" ON public.alerts;
DROP POLICY IF EXISTS "Authenticated users can insert alerts" ON public.alerts;
DROP POLICY IF EXISTS "Authenticated users can update alerts" ON public.alerts;

DROP POLICY IF EXISTS "Anyone can view hotspots" ON public.hotspots;
DROP POLICY IF EXISTS "Authenticated users can insert hotspots" ON public.hotspots;
DROP POLICY IF EXISTS "Authenticated users can update hotspots" ON public.hotspots;

DROP POLICY IF EXISTS "Anyone can view forecasts" ON public.forecasts;
DROP POLICY IF EXISTS "Authenticated users can insert forecasts" ON public.forecasts;

-- Recreate as PERMISSIVE
CREATE POLICY "Anyone can view alerts" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert alerts" ON public.alerts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update alerts" ON public.alerts FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Anyone can view hotspots" ON public.hotspots FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert hotspots" ON public.hotspots FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update hotspots" ON public.hotspots FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Anyone can view forecasts" ON public.forecasts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert forecasts" ON public.forecasts FOR INSERT TO authenticated WITH CHECK (true);
