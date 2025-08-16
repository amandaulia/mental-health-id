-- Fix RLS policies to ensure public read access works correctly
-- Drop existing policies
DROP POLICY IF EXISTS "Public can view practitioners" ON public.practitioner;
DROP POLICY IF EXISTS "Public can view institutions" ON public.institution;

-- Create new public read policies that definitely work
CREATE POLICY "Enable read access for all users" ON public.practitioner
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.institution
    FOR SELECT USING (true);

-- Also fix other related tables that might have the same issue
DROP POLICY IF EXISTS "Public can view practitioner_services" ON public.practitioner_services;
DROP POLICY IF EXISTS "Public can view institution_services" ON public.institution_services;
DROP POLICY IF EXISTS "Public can view practitioner_contacts" ON public.practitioner_contacts;
DROP POLICY IF EXISTS "Public can view institution_contacts" ON public.institution_contacts;
DROP POLICY IF EXISTS "Public can view practitioner_locations" ON public.practitioner_locations;
DROP POLICY IF EXISTS "Public can view institution_locations" ON public.institution_locations;
DROP POLICY IF EXISTS "Public can view practitioner_institutions" ON public.practitioner_institutions;
DROP POLICY IF EXISTS "Public can view contact_details" ON public.contact_details;
DROP POLICY IF EXISTS "Public can view locations" ON public.location;
DROP POLICY IF EXISTS "Public can view services" ON public.service;

CREATE POLICY "Enable read access for all users" ON public.practitioner_services
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.institution_services
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.practitioner_contacts
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.institution_contacts
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.practitioner_locations
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.institution_locations
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.practitioner_institutions
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.contact_details
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.location
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.service
    FOR SELECT USING (true);