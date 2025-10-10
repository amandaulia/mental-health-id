-- Allow public read access to contact_details
DROP POLICY IF EXISTS "Authenticated users can view contact_details" ON contact_details;

CREATE POLICY "Public can view contact_details"
ON contact_details
FOR SELECT
TO public
USING (true);