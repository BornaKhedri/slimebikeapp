-- Add entries to micromobility_city_xref 

-- For SF 

INSERT INTO micromobility_city_xref (micromobilityservice_id, city_id, micromobility_city_contact_email)
values (23, 8, 'sanfran_scooters@lime.com'), 
(24, 8, 'sanfran_scooters@spin.com'), 
(25, 8, 'sanfran_ebike@lyft.com');


-- For PDX 
INSERT INTO micromobility_services (micromobilitytype_id) values (4), (14), (5);

-- Update the company_id for Bolt scooters 
UPDATE  micromobility_type SET company_id = 11 where company_id = NULL;