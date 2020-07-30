-- Infraction city xref and companies 

--
-- Inserting data into table public.infraction_city_xref
-- The infraction ids are read from pgAdmin
-- 
INSERT INTO public.infraction_city_xref(infractiontype_id, city_id) VALUES
(128, 10),
(129, 10),
(130, 10),
(131, 10),
(132, 10),
(133, 10),
(134, 10),
(135, 10),
(136, 10),
(137, 10),
(138, 10),
(139, 10),
(140, 10),
(141, 10);

-- Company
INSERT INTO public.micromobility_company(company_name, company_contact_no, company_contact_email) VALUES
('Helbiz', '1234567890', 'helbiz_central@helbiz.com');

-- This company ID will feed into the next script

