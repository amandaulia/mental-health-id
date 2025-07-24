-- Create tables for mental health directory

-- Create institution table
CREATE TABLE public.institution (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  description TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'Indonesia',
  languages TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create practitioner table
CREATE TABLE public.practitioner (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  profession_type TEXT[],
  specializations TEXT[],
  languages TEXT[],
  bio TEXT,
  education TEXT[],
  certifications TEXT[],
  years_experience INTEGER,
  consultation_fee_min INTEGER,
  consultation_fee_max INTEGER,
  consultation_methods TEXT[],
  availability TEXT,
  institution_id UUID REFERENCES public.institution(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create organization table
CREATE TABLE public.organization (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  description TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  services TEXT[],
  target_audience TEXT[],
  languages TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create peer_counseling table
CREATE TABLE public.peer_counseling (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  contact_method TEXT,
  contact_info TEXT,
  availability TEXT,
  languages TEXT[],
  specializations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activity table
CREATE TABLE public.activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  description TEXT,
  category TEXT,
  location TEXT,
  contact_info TEXT,
  website TEXT,
  cost TEXT,
  schedule TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table for admin access
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable Row Level Security
ALTER TABLE public.institution ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practitioner ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peer_counseling ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access (since this is a public directory)
CREATE POLICY "Allow public read access to institutions" 
ON public.institution FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to practitioners" 
ON public.practitioner FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to organizations" 
ON public.organization FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to peer_counseling" 
ON public.peer_counseling FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to activities" 
ON public.activity FOR SELECT 
USING (true);

-- Admin policies for data management
CREATE POLICY "Allow authenticated users to insert institutions" 
ON public.institution FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update institutions" 
ON public.institution FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete institutions" 
ON public.institution FOR DELETE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to insert practitioners" 
ON public.practitioner FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update practitioners" 
ON public.practitioner FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete practitioners" 
ON public.practitioner FOR DELETE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to insert organizations" 
ON public.organization FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update organizations" 
ON public.organization FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete organizations" 
ON public.organization FOR DELETE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to insert peer_counseling" 
ON public.peer_counseling FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update peer_counseling" 
ON public.peer_counseling FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete peer_counseling" 
ON public.peer_counseling FOR DELETE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to insert activities" 
ON public.activity FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update activities" 
ON public.activity FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete activities" 
ON public.activity FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- User roles policies
CREATE POLICY "Users can view their own roles" 
ON public.user_roles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Allow inserting user roles" 
ON public.user_roles FOR INSERT 
WITH CHECK (true);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_institution_updated_at
    BEFORE UPDATE ON public.institution
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_practitioner_updated_at
    BEFORE UPDATE ON public.practitioner
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organization_updated_at
    BEFORE UPDATE ON public.organization
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_peer_counseling_updated_at
    BEFORE UPDATE ON public.peer_counseling
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_activity_updated_at
    BEFORE UPDATE ON public.activity
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();