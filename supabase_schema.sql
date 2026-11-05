-- ==============================================================================
-- GREENOFFICE — Sistem Informasi Pemantauan Energi dan Pengelolaan Sampah
-- Sekretariat Daerah Kota Cirebon, Jawa Barat
-- Database Schema for Supabase PostgreSQL with Row Level Security (RLS)
-- ==============================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('pegawai', 'admin', 'pimpinan')) DEFAULT 'pegawai',
  role_title TEXT,
  department TEXT NOT NULL,
  avatar_url TEXT,
  eco_points INTEGER DEFAULT 0,
  level TEXT DEFAULT 'Peduli Lingkungan',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- 2. Buildings Table
CREATE TABLE IF NOT EXISTS public.buildings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  floors_count INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Energy Readings Table (Electricity & Water)
CREATE TABLE IF NOT EXISTS public.energy_readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT CHECK (type IN ('listrik', 'air')) NOT NULL,
  building TEXT NOT NULL,
  room TEXT NOT NULL,
  meter_number TEXT NOT NULL,
  reading_date DATE NOT NULL,
  value NUMERIC(10, 2) NOT NULL CHECK (value >= 0),
  cost_estimate NUMERIC(12, 2) DEFAULT 0,
  notes TEXT,
  status TEXT CHECK (status IN ('Menunggu', 'Disetujui', 'Ditolak')) DEFAULT 'Menunggu',
  recorded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.energy_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Energy readings readable by all authenticated users"
  ON public.energy_readings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Pegawai can insert energy readings"
  ON public.energy_readings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update energy readings"
  ON public.energy_readings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'pimpinan')
    )
  );

-- 4. Waste Records Table
CREATE TABLE IF NOT EXISTS public.waste_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  building TEXT NOT NULL,
  department TEXT NOT NULL,
  category TEXT CHECK (category IN ('Organik', 'Anorganik', 'Kertas', 'Plastik', 'Logam', 'Residu')) NOT NULL,
  amount_kg NUMERIC(8, 2) NOT NULL CHECK (amount_kg > 0),
  collection_date DATE NOT NULL,
  responsible_staff TEXT NOT NULL,
  status TEXT CHECK (status IN ('Menunggu', 'Disetujui', 'Ditolak', 'Terpilah', 'Didaur Ulang')) DEFAULT 'Menunggu',
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.waste_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Waste records viewable by all authenticated users"
  ON public.waste_records FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can insert waste records"
  ON public.waste_records FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update waste records"
  ON public.waste_records FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'pimpinan')
    )
  );

-- 5. Eco Challenges & Rewards
CREATE TABLE IF NOT EXISTS public.eco_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  points INTEGER NOT NULL,
  category TEXT NOT NULL,
  deadline_days INTEGER DEFAULT 7,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_challenge_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES public.eco_challenges(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- 6. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT CHECK (category IN ('energi', 'air', 'sampah', 'poin', 'sistem')),
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only read their notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);
