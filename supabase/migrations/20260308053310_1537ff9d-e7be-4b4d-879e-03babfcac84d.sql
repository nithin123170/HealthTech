
-- Update hotspots from Tumkur to Hassan district villages
UPDATE public.hotspots SET village_name = 'Hassan City', lat = 13.0068, lng = 76.1004 WHERE village_name = 'Tumkūr City';
UPDATE public.hotspots SET village_name = 'Channarayapatna', lat = 12.9200, lng = 76.0500 WHERE village_name = 'Gubbi';
UPDATE public.hotspots SET village_name = 'Arsikere', lat = 13.1200, lng = 76.0000 WHERE village_name = 'Sira';
UPDATE public.hotspots SET village_name = 'Holenarasipura', lat = 12.8600, lng = 75.9800 WHERE village_name = 'Kunigal';
UPDATE public.hotspots SET village_name = 'Belur', lat = 13.0500, lng = 75.9000 WHERE village_name = 'Tiptur';
UPDATE public.hotspots SET village_name = 'Arasikere', lat = 13.1600, lng = 76.2500 WHERE village_name = 'Madhugiri';
UPDATE public.hotspots SET village_name = 'Sakleshpur', lat = 12.7300, lng = 75.7900 WHERE village_name = 'Koratagere';
UPDATE public.hotspots SET village_name = 'Halebidu', lat = 13.0900, lng = 75.8500 WHERE village_name = 'Turuvekere';
UPDATE public.hotspots SET village_name = 'Javagal', lat = 13.2100, lng = 76.1500 WHERE village_name = 'Pavagada';
UPDATE public.hotspots SET village_name = 'Arkalgud', lat = 12.9500, lng = 76.2000 WHERE village_name = 'Chikkanayakanahalli';

-- Update alerts village names
UPDATE public.alerts SET village = 'Hassan City' WHERE village = 'Tumkūr City';
UPDATE public.alerts SET village = 'Arsikere' WHERE village = 'Sira';
UPDATE public.alerts SET village = 'Belur' WHERE village = 'Tiptur';
UPDATE public.alerts SET village = 'Arasikere' WHERE village = 'Madhugiri';
UPDATE public.alerts SET village = 'Javagal' WHERE village = 'Pavagada';
UPDATE public.alerts SET village = 'Halebidu' WHERE village = 'Turuvekere';

-- Update forecasts district
UPDATE public.forecasts SET district = 'Hassan' WHERE district = 'Tumkūr';
