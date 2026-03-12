-- Single-row site settings table for all editable content
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Couple
  groom_name TEXT NOT NULL DEFAULT 'João',
  bride_name TEXT NOT NULL DEFAULT 'Maria',
  couple_initials TEXT NOT NULL DEFAULT 'J & M',
  wedding_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '2026-08-15T16:00:00Z',
  -- Story
  story_quote TEXT NOT NULL DEFAULT '"O amor não se olha um para o outro, mas juntos na mesma direção."',
  story_text TEXT NOT NULL DEFAULT 'Nossa história começou como muitas grandes histórias de amor — por acaso. Um encontro inesperado que se transformou na aventura mais bonita de nossas vidas. Desde o primeiro olhar, soubemos que algo especial estava nascendo. Agora, anos depois, estamos prontos para dar o passo mais importante juntos.',
  timeline_events JSONB NOT NULL DEFAULT '[
    {"year":"2018","title":"O Primeiro Encontro","desc":"Nos conhecemos em uma festa de amigos em comum. Foi amor à primeira vista."},
    {"year":"2019","title":"Primeiro Namoro","desc":"Após meses de conversas e encontros, decidimos oficializar o relacionamento."},
    {"year":"2021","title":"Morar Juntos","desc":"Demos o próximo passo e começamos a construir nosso lar juntos."},
    {"year":"2025","title":"O Pedido","desc":"Em uma viagem especial, veio o pedido de casamento mais lindo do mundo."},
    {"year":"2026","title":"O Grande Dia","desc":"Finalmente, vamos celebrar nosso amor com todos que amamos!"}
  ]'::jsonb,
  -- Venue
  venue_name TEXT NOT NULL DEFAULT 'Espaço Villa Jardim',
  venue_address TEXT NOT NULL DEFAULT 'Rua das Flores, 1234 - Jardim Botânico, São Paulo - SP, 01234-000',
  ceremony_time TEXT NOT NULL DEFAULT '16h00',
  party_time TEXT NOT NULL DEFAULT '18h00',
  venue_map_url TEXT NOT NULL DEFAULT 'https://maps.google.com/?q=Jardim+Botanico+Sao+Paulo',
  venue_map_embed TEXT NOT NULL DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0!2d-46.6388!3d-23.5489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzAwLjAiUyA0NsKwMzgnMDAuMCJX!5e0!3m2!1spt-BR!2sbr!4v1',
  -- Photos (storage URLs)
  hero_photo_url TEXT,
  couple_photo_url TEXT,
  gallery_photo_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Meta
  welcome_text TEXT NOT NULL DEFAULT 'Nós vamos casar',
  footer_text TEXT NOT NULL DEFAULT 'Feito com ❤ para o nosso grande dia',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (public site)
CREATE POLICY "Anyone can read site settings" ON public.site_settings
  FOR SELECT USING (true);

-- Only authenticated (admin) can update
CREATE POLICY "Authenticated can update settings" ON public.site_settings
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Insert initial row
INSERT INTO public.site_settings (id) VALUES (gen_random_uuid());

-- Storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true);

-- Anyone can view photos
CREATE POLICY "Public photo access" ON storage.objects
  FOR SELECT USING (bucket_id = 'photos');

-- Authenticated can upload photos
CREATE POLICY "Auth upload photos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'photos');

-- Authenticated can update photos
CREATE POLICY "Auth update photos" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'photos');

-- Authenticated can delete photos
CREATE POLICY "Auth delete photos" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'photos');
