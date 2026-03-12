import { motion } from "framer-motion";
import { MapPin, Clock, ExternalLink } from "lucide-react";

const VenueSection = () => (
  <section id="local" className="py-24 md:py-32 bg-muted/30">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <p className="font-body text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">
          Onde será a celebração
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-foreground">Local do Evento</h2>
        <div className="w-16 h-px bg-gold mx-auto mt-6" />
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div>
            <h3 className="font-display text-2xl text-foreground mb-4">Espaço Villa Jardim</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gold mt-1 shrink-0" />
                <p className="font-body text-muted-foreground">
                  Rua das Flores, 1234 - Jardim Botânico
                  <br />
                  São Paulo - SP, 01234-000
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-gold mt-1 shrink-0" />
                <div className="font-body text-muted-foreground">
                  <p>Cerimônia: 16h00</p>
                  <p>Festa: 18h00</p>
                </div>
              </div>
            </div>
          </div>

          <a
            href="https://maps.google.com/?q=Jardim+Botanico+Sao+Paulo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-foreground text-background font-body text-sm uppercase tracking-widest px-8 py-3 hover:bg-foreground/90 transition-colors duration-300"
          >
            <ExternalLink size={14} /> Abrir Rota no Google Maps
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="h-[400px] shadow-lg overflow-hidden"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0!2d-46.6388!3d-23.5489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzAwLjAiUyA0NsKwMzgnMDAuMCJX!5e0!3m2!1spt-BR!2sbr!4v1"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Local do casamento"
          />
        </motion.div>
      </div>
    </div>
  </section>
);

export default VenueSection;
