import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteSettings } from "@/hooks/use-site-settings";

const navItems = [
  { label: "Início", href: "#inicio" },
  { label: "RSVP", href: "#rsvp" },
  { label: "Presentes", href: "#presentes" },
  { label: "Local", href: "#local" },
  { label: "Galeria", href: "#galeria" },
];

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
      isScrolled ? "bg-card/95 backdrop-blur-lg shadow-sm py-3" : "bg-transparent py-8"
    }`}>
      <div className="container mx-auto flex items-center justify-between px-6">
        <a href="#inicio" className="font-pinyon text-2xl text-foreground">
          {settings.couple_initials}
        </a>
        <ul className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href}
                className="font-body text-[11px] uppercase tracking-[0.25em] text-foreground/60 hover:text-foreground transition-colors duration-500 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-px after:bg-gold after:transition-all after:duration-500 hover:after:w-full">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground" aria-label="Menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card/98 backdrop-blur-lg border-t border-border overflow-hidden">
            <ul className="flex flex-col items-center py-8 gap-5">
              {navItems.map((item, i) => (
                <motion.li key={item.href} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <a href={item.href} onClick={() => setIsOpen(false)}
                    className="font-body text-sm uppercase tracking-[0.2em] text-foreground/70 hover:text-foreground transition-colors">
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
