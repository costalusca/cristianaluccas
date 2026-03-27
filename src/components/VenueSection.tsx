import { motion } from "framer-motion";
import { MapPin, Clock, ExternalLink } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";

const VenueSection = () => {
  const { settings, loading } = useSiteSettings();

  if (loading) return null;

  return (
    <section id="local" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="text-center mb-16">
          <p className="font-body text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">Onde será a celebração</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground">Local do Evento</h2>
          <div className="w-16 h-px mx-auto mt-6 bg-primary" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="space-y-8">
            <div>
              <h3 className="font-display text-2xl text-foreground mb-4">{settings.venue_name}</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-1 shrink-0 border-navy text-slate-800" />
                  <p className="font-body text-muted-foreground whitespace-pre-line">{settings.venue_address}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="mt-1 shrink-0 bg-navy border-navy text-slate-800" />
                  <div className="font-body text-muted-foreground">
                    <p>Cerimônia: {settings.ceremony_time}</p>
                    <p>Festa: {settings.party_time}</p>
                  </div>
                </div>
              </div>
            </div>
            <a href={settings.venue_map_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-foreground text-background font-body text-sm uppercase tracking-widest px-8 py-3 hover:bg-foreground/90 transition-colors duration-300">
              <ExternalLink size={14} /> Abrir Rota no Google Maps
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="h-[400px] shadow-lg overflow-hidden">
            <iframe src={settings.venue_map_embed} width="100%" height="100%" style={{ border: 0 }}
              allowFullScreen loading="lazy" title="Local do casamento" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VenueSection;
