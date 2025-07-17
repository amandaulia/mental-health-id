-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create function to check if user has role (security definer to bypass RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  -- Give first user admin role, others get user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    CASE 
      WHEN (SELECT COUNT(*) FROM auth.users) = 1 THEN 'admin'::app_role
      ELSE 'user'::app_role
    END
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- User roles policies  
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Update existing table policies to require admin role
DROP POLICY IF EXISTS "Allow all operations for all users" ON public.practitioner;
CREATE POLICY "Admins can manage practitioners"
  ON public.practitioner FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view practitioners"
  ON public.practitioner FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations for all users" ON public.institution;
CREATE POLICY "Admins can manage institutions"
  ON public.institution FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view institutions"
  ON public.institution FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations for all users" ON public.organization;
CREATE POLICY "Admins can manage organizations"
  ON public.organization FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view organizations"
  ON public.organization FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations for all users" ON public.peer_counseling;
CREATE POLICY "Admins can manage peer_counseling"
  ON public.peer_counseling FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view peer_counseling"
  ON public.peer_counseling FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations for all users" ON public.activity;
CREATE POLICY "Admins can manage activities"
  ON public.activity FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view activities"
  ON public.activity FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations for all users" ON public.service;
CREATE POLICY "Admins can manage services"
  ON public.service FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view services"
  ON public.service FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations for all users" ON public.location;
CREATE POLICY "Admins can manage locations"
  ON public.location FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view locations"
  ON public.location FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations for all users" ON public.contact_details;
CREATE POLICY "Admins can manage contact_details"
  ON public.contact_details FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view contact_details"
  ON public.contact_details FOR SELECT
  USING (true);

-- Apply similar policies to all junction tables
DROP POLICY IF EXISTS "Allow all operations for all users" ON public.practitioner_contacts;
CREATE POLICY "Admins can manage practitioner_contacts"
  ON public.practitioner_contacts FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view practitioner_contacts"
  ON public.practitioner_contacts FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations for all users" ON public.practitioner_locations;
CREATE POLICY "Admins can manage practitioner_locations"
  ON public.practitioner_locations FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view practitioner_locations"
  ON public.practitioner_locations FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations for all users" ON public.practitioner_services;
CREATE POLICY "Admins can manage practitioner_services"
  ON public.practitioner_services FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view practitioner_services"
  ON public.practitioner_services FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations for all users" ON public.practitioner_institutions;
CREATE POLICY "Admins can manage practitioner_institutions"
  ON public.practitioner_institutions FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view practitioner_institutions"
  ON public.practitioner_institutions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations for all users" ON public.institution_contacts;
CREATE POLICY "Admins can manage institution_contacts"
  ON public.institution_contacts FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view institution_contacts"
  ON public.institution_contacts FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations for all users" ON public.institution_locations;
CREATE POLICY "Admins can manage institution_locations"
  ON public.institution_locations FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view institution_locations"
  ON public.institution_locations FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations for all users" ON public.institution_services;
CREATE POLICY "Admins can manage institution_services"
  ON public.institution_services FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view institution_services"
  ON public.institution_services FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations for all users" ON public.organization_contacts;
CREATE POLICY "Admins can manage organization_contacts"
  ON public.organization_contacts FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view organization_contacts"
  ON public.organization_contacts FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations for all users" ON public.organization_locations;
CREATE POLICY "Admins can manage organization_locations"
  ON public.organization_locations FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view organization_locations"
  ON public.organization_locations FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations for all users" ON public.activity_contacts;
CREATE POLICY "Admins can manage activity_contacts"
  ON public.activity_contacts FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view activity_contacts"
  ON public.activity_contacts FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations for all users" ON public.activity_locations;
CREATE POLICY "Admins can manage activity_locations"
  ON public.activity_locations FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view activity_locations"
  ON public.activity_locations FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations for all users" ON public.activity_institutions;
CREATE POLICY "Admins can manage activity_institutions"
  ON public.activity_institutions FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view activity_institutions"
  ON public.activity_institutions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations for all users" ON public.activity_organizations;
CREATE POLICY "Admins can manage activity_organizations"
  ON public.activity_organizations FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view activity_organizations"
  ON public.activity_organizations FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations for all users" ON public.peer_counseling_contacts;
CREATE POLICY "Admins can manage peer_counseling_contacts"
  ON public.peer_counseling_contacts FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view peer_counseling_contacts"
  ON public.peer_counseling_contacts FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations for all users" ON public.peer_counseling_locations;
CREATE POLICY "Admins can manage peer_counseling_locations"
  ON public.peer_counseling_locations FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view peer_counseling_locations"
  ON public.peer_counseling_locations FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations for all users" ON public.location_contacts;
CREATE POLICY "Admins can manage location_contacts"
  ON public.location_contacts FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view location_contacts"
  ON public.location_contacts FOR SELECT
  USING (true);