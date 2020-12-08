--
--
-- Fix the sequence issue 
SELECT setval('city_info_city_id_seq', max(city_id)) FROM city_info;

SELECT setval('infraction_type_infractiontype_id_seq', max(infractiontype_id)) FROM infraction_type;
--
-- Inserting data into table public.city_info
--
INSERT INTO public.city_info(city, city_contact_no, city_contact_email, state) VALUES
(E'Washington', E'1234567890', E'DocklessMobility@Washington.com', E'');

-- Infraction Types
INSERT INTO public.infraction_type(infraction_description, infraction_severity) VALUES
('Reducing pedestrian travel space to under 5 ft.',	10),
('Blocking ADA access', 10),
('Not within the sidewalk’s furniture zone where it exists',	9),
('Blocking vehicular travel area (e.g. driving lanes)',	8),
('Blocking access to private property entrance or driveway',	7),
('Fastened to fire hydrants and police/fire call boxes',	6),
('Blocking access to transit stops and shelters',	6),
('Blocking access to Capital Bikeshare stations',	6),
('Fastened to poles within a bus zone or 25 ft. of an intersection',	5),
('Fastened to electric traffic signal poles',	5),
('Bike is not locked to legal street infrastructure',	4),
('In private property without consent',	3),
('Bike/scooter in same location for 5 days',	2),
('Toppled / Not parked upright',	1);



