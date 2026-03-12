import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/use-site-settings";
import coupleFallback from "@/assets/couple-story.jpg";

const OurStory = () => {
  const { settings, loading } = useSiteSettings();

  if (loading) return null;

  return (
    <section id="historia" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="text-center mb-16">
          <p className="font-body text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">Como tudo começou</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground">Nossa História</h2>
          <div className="w-16 h-px bg-gold mx-auto mt-6" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <img src={settings.couple_photo_url || coupleFallback} alt="O casal" className="w-full h-[500px] object-cover shadow-lg" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <p className="font-display text-2xl italic text-foreground mb-6">{settings.story_quote}</p>
            <p className="font-body text-muted-foreground leading-relaxed whitespace-pre-line">{settings.story_text}</p>
          </motion.div>
        </div>

        {settings.timeline_events.length > 0 && (
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-border" />
            {settings.timeline_events.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative flex items-center mb-12 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                <div className={`w-1/2 ${i % 2 === 0 ? "pr-10 text-right" : "pl-10 text-left"}`}>
                  <span className="font-display text-gold text-lg">{item.year}</span>
                  <h3 className="font-display text-xl text-foreground mt-1">{item.title}</h3>
                  <p className="font-body text-sm text-muted-foreground mt-2">{item.desc}</p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gold border-2 border-background" />
                <div className="w-1/2" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OurStory;
