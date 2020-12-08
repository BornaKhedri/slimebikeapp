--
-- Inserting data into table public.city_info
--
INSERT INTO public.city_info(city, city_contact_no, city_contact_email, state) VALUES
(E'Boise', E'1234567890', E'DocklessMobility@Boise.com', E'');

-- Infraction Types
INSERT INTO public.infraction_type(infraction_description, infraction_severity) VALUES
('Reducing pedestrian travel space to under 6 ft.',	10),
('Blocking ADA accommodations (e.g. ramps / signal buttons)', 10),
('On curb ramps or curb cuts',	9),
('In a vehicular travel lane or bike lane',	8),
('Obstructing pedestrian or vehicular traffic',	7),
('On a block without a sidewalk',	7),
('Blocking street furniture (e.g. pay stations)',	6),
('In entryways and exits (e.g. building evacuation exit)',	6),
('On driveways',	5),
('In on-street parking spaces',	5),
('In transit zones (e.g. bus stops / shelters)',	4),
('In loading zones',	4),
('In geo-fenced parking restricted areas',	3),
('Not on hard surface / Placed on vegetation',	2),
('In the same location for 24 hours or more',	2),
('Toppled / Not parked upright',	1);