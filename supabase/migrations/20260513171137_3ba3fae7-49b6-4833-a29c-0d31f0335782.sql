CREATE TABLE public.gift_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gift_id UUID,
  gift_name TEXT NOT NULL,
  gift_value NUMERIC NOT NULL DEFAULT 0,
  buyer_name TEXT,
  buyer_message TEXT,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('pix','card')),
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gift_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create notifications"
ON public.gift_notifications FOR INSERT
TO public WITH CHECK (true);

CREATE POLICY "Authenticated can view notifications"
ON public.gift_notifications FOR SELECT
TO authenticated USING (true);

CREATE POLICY "Authenticated can update notifications"
ON public.gift_notifications FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX idx_gift_notifications_created_at ON public.gift_notifications (created_at DESC);
CREATE INDEX idx_gift_notifications_read ON public.gift_notifications (read);