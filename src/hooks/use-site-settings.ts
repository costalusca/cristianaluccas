import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TimelineEvent {
  year: string;
  title: string;
  desc: string;
}

export interface SiteSettings {
  id: string;
  groom_name: string;
  bride_name: string;
  couple_initials: string;
  wedding_date: string;
  story_quote: string;
  story_text: string;
  timeline_events: TimelineEvent[];
  venue_name: string;
  venue_address: string;
  ceremony_time: string;
  party_time: string;
  venue_map_url: string;
  venue_map_embed: string;
  hero_photo_url: string | null;
  couple_photo_url: string | null;
  gallery_photo_urls: string[];
  welcome_text: string;
  footer_text: string;
}

const defaults: SiteSettings = {
  id: "",
  groom_name: "Cristiana",
  bride_name: "Luccas",
  couple_initials: "C & L",
  wedding_date: "2026-06-13T16:00:00Z",
  story_quote: '"O amor não se olha um para o outro, mas juntos na mesma direção."',
  story_text: "Nossa história começou como muitas grandes histórias de amor — por acaso.",
  timeline_events: [],
  venue_name: "Casa Fróes",
  venue_address: "Alameda Jandira Fróes, 42 - São Francisco, Niterói - RJ, 24360-017",
  ceremony_time: "16h00",
  party_time: "18h00",
  venue_map_url: "",
  venue_map_embed: "",
  hero_photo_url: null,
  couple_photo_url: null,
  gallery_photo_urls: [],
  welcome_text: "Nós vamos casar",
  footer_text: "Nosso grande dia.",
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .single();
      if (data) {
        setSettings({
          ...data,
          timeline_events: (data.timeline_events as unknown as TimelineEvent[]) || [],
          gallery_photo_urls: (data.gallery_photo_urls as unknown as string[]) || [],
        });
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return { settings, loading };
}
