
-- 1) Restrict practitioner.license_number column from anon
REVOKE SELECT (license_number) ON public.practitioner FROM anon;

-- 2) Replace permissive policies on junction tables
DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'activity_practitioners',
    'institution_peer_counselings',
    'organization_activities',
    'organization_peer_counselings',
    'organization_practitioners',
    'practitioner_peer_counselings',
    'service_peer_counselings',
    'service_locations'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Allow all operations for all users" ON public.%I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Public can view %1$s" ON public.%1$I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can manage %1$s" ON public.%1$I', t);
    EXECUTE format('CREATE POLICY "Public can view %1$s" ON public.%1$I FOR SELECT TO anon, authenticated USING (true)', t);
    EXECUTE format('CREATE POLICY "Authenticated users can manage %1$s" ON public.%1$I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t);
  END LOOP;
END $$;
