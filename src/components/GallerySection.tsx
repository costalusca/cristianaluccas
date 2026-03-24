import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import coupleStory from "@/assets/couple-story.jpg";
import heroWedding from "@/assets/hero-wedding.jpg";

const fallbackPhotos = [
  { src: gallery1, alt: "Mesa de jantar", span: "md:col-span-2" },
  { src: gallery2, alt: "Buquê da noiva", span: "md:row-span-2" },
  { src: gallery3, alt: "Alianças", span: "" },
  { src: gallery4, alt: "Cerimônia", span: "md:col-span-2" },
  { src: coupleStory, alt: "O casal", span: "" },
  { src: heroWedding, alt: "Decoração", span: "" },
];

const spanClasses = ["md:col-span-2", "md:row-span-2", "", "md:col-span-2", "", ""];

const GallerySection = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const { settings, loading } = useSiteSettings();

  if (loading) return null;

  const hasDbPhotos = settings.gallery_photo_urls.length > 0;
  const photos = hasDbPhotos
    ? settings.gallery_photo_urls.map((url, i) => ({
        src: url,
        alt: `Foto ${i + 1}`,
        span: spanClasses[i % spanClasses.length],
      }))
    : fallbackPhotos;

  return (
    <section id="galeria" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="text-center mb-16">
          <p className="font-body text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">Nossos momentos</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground">Galeria</h2>
          <div className="w-16 h-px mx-auto mt-6 bg-navy" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 max-w-5xl mx-auto">
          {photos.map((photo, i) => (
            <motion.button key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              onClick={() => setSelected(photo.src)}
              className="overflow-hidden group cursor-pointer aspect-square">
              <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-6">
            <button onClick={() => setSelected(null)} className="absolute top-6 right-6 text-primary-foreground hover:text-gold transition-colors">
              <X size={32} />
            </button>
            <motion.img initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              src={selected} alt="Foto ampliada" className="max-w-full max-h-[85vh] object-contain" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
