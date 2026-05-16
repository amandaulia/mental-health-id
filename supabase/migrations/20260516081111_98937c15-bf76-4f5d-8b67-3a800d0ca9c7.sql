
-- Replace permissive "authenticated can manage" policies with admin-only on all directory tables

DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'activity','activity_contacts','activity_institutions','activity_locations','activity_organizations','activity_practitioners',
    'contact_details',
    'institution','institution_contacts','institution_locations','institution_peer_counselings','institution_services',
    'location','location_contacts',
    'organization','organization_activities','organization_contacts','organization_locations','organization_peer_counselings','organization_practitioners',
    'peer_counseling','peer_counseling_contacts','peer_counseling_locations',
    'practitioner','practitioner_contacts','practitioner_institutions','practitioner_locations','practitioner_peer_counselings','practitioner_services',
    'service','service_locations','service_peer_counselings'
  ];
  pol record;
BEGIN
  FOREACH t IN ARRAY tables LOOP
    -- Drop any existing "Authenticated users can manage *" policies
    FOR pol IN
      SELECT policyname FROM pg_policies
      WHERE schemaname='public' AND tablename=t
        AND policyname ILIKE 'Authenticated users can manage%'
    LOOP
      EXECUTE format('DROP POLICY %I ON public.%I', pol.policyname, t);
    END LOOP;

    -- Create admin-only management policy
    EXECUTE format(
      'CREATE POLICY "Admins can manage %I" ON public.%I FOR ALL TO authenticated USING (public.has_role(auth.uid(), ''admin''::app_role)) WITH CHECK (public.has_role(auth.uid(), ''admin''::app_role))',
      t, t
    );
  END LOOP;
END $$;

-- Tighten SECURITY DEFINER function permissions
REVOKE ALL ON FUNCTION public.update_user_app_metadata(uuid, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
