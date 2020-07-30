-- For PDX only now 
INSERT INTO micromobility_city_xref (micromobilityservice_id, city_id, micromobility_city_contact_email)
VALUES (26, 7, 'pdx_scooter@lime.com'), (27, 7, 'pdx_scooter@bolt.com'), (28, 7, 'pdx_scooter@spin.com');

-- Fix the company_id for Bolt 
UPDATE micromobility_type SET company_id = 11 where micromobilitytype_id = 14;