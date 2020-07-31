-- This script will delete all reports prior to July-1, 2020. 

-- CASCASE DELETE
-- begin;

alter table misparking_report_infraction_xref
drop constraint misparking_report_infraction_xref_mispark_id_fkey;

alter table misparking_report_infraction_xref
add constraint misparking_report_infraction_xref
foreign key (mispark_id)
references misparking_report (mispark_id)
on delete cascade;

-- commit;

-- Now DELETE

DELETE from misparking_report where report_datetime <= '2020-07-01';