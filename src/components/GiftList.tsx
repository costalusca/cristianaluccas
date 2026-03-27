import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface GiftItem {
  id: string;
  name: string;
  description: string | null;
  value: number;
  purchased: boolean;
  icon: string | null;
  payment_url: string | null;
}

const GiftList = () => {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGifts = async () => {
      const { data, error } = await supabase
        .from("gifts")
        .select("*")
        .order("created_at");
      if (!error && data) setGifts(data);
      setLoading(false);
    };
    fetchGifts();
  }, []);

  if (loading) return null;

  return (
    <section id="presentes" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Sua presença é o melhor presente
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground">
            Lista de Presentes
          </h2>
          <div className="w-16 h-px mx-auto mt-6 bg-navy" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {gifts.map((gift, i) => (
            <motion.div
              key={gift.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`group border border-border p-8 text-center transition-all duration-300 hover:shadow-lg ${
                gift.purchased ? "opacity-60" : "hover:border-gold"
              }`}
            >
              <span className="text-4xl mb-4 block">{gift.icon || "🎁"}</span>
              <h3 className="font-display text-xl text-foreground mb-2">{gift.name}</h3>
              <p className="font-body text-sm text-muted-foreground mb-4">{gift.description}</p>
              <p className="font-display text-2xl text-gold mb-6">
                R$ {Number(gift.value).toLocaleString("pt-BR")}
              </p>

              {gift.purchased ? (
                <span className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground">
                  <Check size={16} /> Presenteado
                </span>
              ) : gift.payment_url ? (
                <a
                  href={gift.payment_url.startsWith("http") ? gift.payment_url : `https://${gift.payment_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-foreground text-background font-body text-sm uppercase tracking-widest px-8 py-3 hover:bg-foreground/90 transition-colors duration-300"
                >
                  <Heart size={14} /> Presentear
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground cursor-not-allowed opacity-50">
                  <Heart size={14} /> Sem link de pagamento
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GiftList;
