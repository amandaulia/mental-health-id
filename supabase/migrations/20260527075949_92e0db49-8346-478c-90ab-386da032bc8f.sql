
-- Storage RLS policies for public buckets
CREATE POLICY "Public can view practitioners files"
ON storage.objects FOR SELECT
USING (bucket_id = 'practitioners');

CREATE POLICY "Admins can upload practitioners files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'practitioners' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update practitioners files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'practitioners' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete practitioners files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'practitioners' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view institutions files"
ON storage.objects FOR SELECT
USING (bucket_id = 'institutions');

CREATE POLICY "Admins can upload institutions files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'institutions' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update institutions files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'institutions' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete institutions files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'institutions' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view placeholders files"
ON storage.objects FOR SELECT
USING (bucket_id = 'placeholders');

CREATE POLICY "Admins can upload placeholders files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'placeholders' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update placeholders files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'placeholders' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete placeholders files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'placeholders' AND public.has_role(auth.uid(), 'admin'));

-- Lock down location_name_review (internal moderation data) to admins
ALTER TABLE public.location_name_review ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage location_name_review"
ON public.location_name_review FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Revoke public execute on sensitive SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.update_user_app_metadata(uuid, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
