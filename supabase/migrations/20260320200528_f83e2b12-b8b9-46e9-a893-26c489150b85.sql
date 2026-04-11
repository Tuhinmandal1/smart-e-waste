
CREATE TABLE public.sensor_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL DEFAULT 'esp32-001',
  temperature REAL,
  humidity REAL,
  proximity REAL,
  material TEXT,
  confidence REAL,
  weight_kg REAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (ESP32 doesn't have auth)
CREATE POLICY "Allow public insert" ON public.sensor_readings
  FOR INSERT TO anon WITH CHECK (true);

-- Allow authenticated users to read
CREATE POLICY "Allow authenticated read" ON public.sensor_readings
  FOR SELECT TO authenticated USING (true);

-- Allow anon to read too (for edge function)
CREATE POLICY "Allow anon read" ON public.sensor_readings
  FOR SELECT TO anon USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.sensor_readings;
