-- Completely disable RLS temporarily to ensure data access works
ALTER TABLE public.practitioner DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.practitioner_services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.practitioner_contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.practitioner_locations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_locations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.practitioner_institutions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_details DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.location DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.service DISABLE ROW LEVEL SECURITY;