-- Add persisted popularity counts for resource cards.
CREATE TABLE IF NOT EXISTS public.resource_popularity (
  resource_type text NOT NULL CHECK (resource_type IN ('practitioner', 'institution')),
  resource_id bigint NOT NULL,
  click_count bigint NOT NULL DEFAULT 0 CHECK (click_count >= 0),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (resource_type, resource_id)
);

ALTER TABLE public.resource_popularity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read resource popularity" ON public.resource_popularity;
CREATE POLICY "Anyone can read resource popularity"
ON public.resource_popularity
FOR SELECT
TO anon, authenticated
USING (true);

CREATE OR REPLACE FUNCTION public.increment_resource_click(
  resource_type_input text,
  resource_id_input bigint
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF resource_type_input NOT IN ('practitioner', 'institution') THEN
    RAISE EXCEPTION 'Unsupported resource type: %', resource_type_input;
  END IF;

  INSERT INTO public.resource_popularity (resource_type, resource_id, click_count, updated_at)
  VALUES (resource_type_input, resource_id_input, 1, now())
  ON CONFLICT (resource_type, resource_id)
  DO UPDATE SET
    click_count = public.resource_popularity.click_count + 1,
    updated_at = now();
END;
$$;

REVOKE ALL ON FUNCTION public.increment_resource_click(text, bigint) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_resource_click(text, bigint) TO anon, authenticated;

-- Coordinates are optional so existing location records remain valid.
ALTER TABLE public.location
  ADD COLUMN IF NOT EXISTS latitude numeric,
  ADD COLUMN IF NOT EXISTS longitude numeric;
