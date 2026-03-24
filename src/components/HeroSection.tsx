import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/use-site-settings";
import heroFallback from "@/assets/hero-wedding.jpg";

const HeroSection = () => {
  const { settings, loading } = useSiteSettings();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const calc = () => {
      const diff = new Date(settings.wedding_date).getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };
    setTimeLeft(calc());
    const timer = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(timer);
  }, [settings.wedding_date]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const weddingDate = new Date(settings.wedding_date);
  const dateStr = weddingDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, " / ");

  if (loading) return <div className="min-h-screen bg-background" />;

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0" style={{ transform: `translateY(${scrollY * 0.4}px)` }}>
        <img src={settings.hero_photo_url || heroFallback} alt="Casamento" className="w-full h-[120%] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/40 to-foreground/60" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
          className="font-body text-sm uppercase tracking-[0.5em] text-primary-foreground/80 mb-6">
          {settings.welcome_text}
        </motion.p>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.3 }}
          className="font-pinyon text-6xl md:text-7xl lg:text-9xl text-primary-foreground mb-4 leading-[0.9]">
          {settings.groom_name} <span className="font-pinyon italic text-gold">&</span> {settings.bride_name}
        </motion.h1>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.8 }}
          className="w-32 h-px bg-navy mx-auto mb-6" />

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}
          className="font-display text-xl md:text-2xl text-primary-foreground/90 italic mb-12">
          {dateStr}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2 }}
          className="flex justify-center gap-8 md:gap-12 mb-14">
          {[
            { value: timeLeft.days, label: "Dias" },
            { value: timeLeft.hours, label: "Horas" },
            { value: timeLeft.minutes, label: "Min" },
            { value: timeLeft.seconds, label: "Seg" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <span className="block font-display text-4xl md:text-6xl text-primary-foreground tabular-nums">
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="font-body text-[10px] uppercase tracking-[0.3em] text-primary-foreground/50 mt-2 block">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>

        <motion.a href="#rsvp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.5 }}
          className="inline-block text-accent-foreground font-body text-xs uppercase tracking-[0.3em] px-12 py-5 transition-all duration-500 backdrop-blur-sm bg-slate-100">
          Confirmar Presença
        </motion.a>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="w-px h-12 bg-primary-foreground/30" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
