-- Enable public read access for the mental health directory

-- Allow public read access to practitioner data
CREATE POLICY "Enable read access for all users" ON public.practitioner
    FOR SELECT USING (true);

-- Allow public read access to institution data  
CREATE POLICY "Enable read access for all users" ON public.institution
    FOR SELECT USING (true);

-- Allow public read access to location data
CREATE POLICY "Enable read access for all users" ON public.location
    FOR SELECT USING (true);

-- Allow public read access to services data
CREATE POLICY "Enable read access for all users" ON public.services
    FOR SELECT USING (true);

-- Allow public read access to contact details data
CREATE POLICY "Enable read access for all users" ON public.contact_details
    FOR SELECT USING (true);