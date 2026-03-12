-- Create RSVP responses table (public submissions, no auth needed)
CREATE TABLE public.rsvp_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT,
  guests INTEGER NOT NULL DEFAULT 1,
  attending BOOLEAN NOT NULL DEFAULT true,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rsvp_responses ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public form)
CREATE POLICY "Anyone can submit RSVP" ON public.rsvp_responses
  FOR INSERT WITH CHECK (true);

-- Only authenticated users (admin) can read
CREATE POLICY "Authenticated users can read RSVPs" ON public.rsvp_responses
  FOR SELECT TO authenticated USING (true);

-- Create gifts table
CREATE TABLE public.gifts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  value NUMERIC NOT NULL DEFAULT 0,
  icon TEXT DEFAULT '🎁',
  purchased BOOLEAN NOT NULL DEFAULT false,
  purchased_by TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

-- Anyone can read gifts
CREATE POLICY "Anyone can view gifts" ON public.gifts
  FOR SELECT USING (true);

-- Anyone can update gifts (mark as purchased)
CREATE POLICY "Anyone can purchase gifts" ON public.gifts
  FOR UPDATE USING (true) WITH CHECK (true);

-- Only authenticated can insert/delete
CREATE POLICY "Authenticated users can manage gifts" ON public.gifts
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can delete gifts" ON public.gifts
  FOR DELETE TO authenticated USING (true);

-- Insert initial gifts data
INSERT INTO public.gifts (name, description, value, icon) VALUES
  ('Lua de Mel', 'Ajude-nos a realizar a viagem dos sonhos', 500, '✈️'),
  ('Jantar Romântico', 'Um jantar especial para os noivos', 200, '🍷'),
  ('Sofá da Casa Nova', 'Para o cantinho de descanso do casal', 1500, '🛋️'),
  ('Geladeira', 'Para a cozinha do nosso novo lar', 2500, '❄️'),
  ('Viagem Especial', 'Uma experiência inesquecível para o casal', 800, '🌍'),
  ('Jogo de Cama', 'Lençóis de algodão egípcio para noites perfeitas', 350, '🛏️');