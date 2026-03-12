import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Heart, Check } from "lucide-react";
import { toast } from "sonner";

interface GiftItem {
  id: number;
  name: string;
  description: string;
  value: number;
  purchased: boolean;
  icon: string;
}

const initialGifts: GiftItem[] = [
  { id: 1, name: "Lua de Mel", description: "Ajude-nos a realizar a viagem dos sonhos", value: 500, purchased: false, icon: "✈️" },
  { id: 2, name: "Jantar Romântico", description: "Um jantar especial para os noivos", value: 200, purchased: false, icon: "🍷" },
  { id: 3, name: "Sofá da Casa Nova", description: "Para o cantinho de descanso do casal", value: 1500, purchased: false, icon: "🛋️" },
  { id: 4, name: "Geladeira", description: "Para a cozinha do nosso novo lar", value: 2500, purchased: false, icon: "❄️" },
  { id: 5, name: "Viagem Especial", description: "Uma experiência inesquecível para o casal", value: 800, purchased: false, icon: "🌍" },
  { id: 6, name: "Jogo de Cama", description: "Lençóis de algodão egípcio para noites perfeitas", value: 350, purchased: false, icon: "🛏️" },
];

const GiftList = () => {
  const [gifts, setGifts] = useState(initialGifts);

  const handleGift = (id: number) => {
    // TODO: Integrate with payment (Stripe/Pix)
    setGifts(gifts.map((g) => (g.id === id ? { ...g, purchased: true } : g)));
    toast.success("Obrigado pelo presente! 💝");
  };

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
          <div className="w-16 h-px bg-gold mx-auto mt-6" />
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
              <span className="text-4xl mb-4 block">{gift.icon}</span>
              <h3 className="font-display text-xl text-foreground mb-2">{gift.name}</h3>
              <p className="font-body text-sm text-muted-foreground mb-4">{gift.description}</p>
              <p className="font-display text-2xl text-gold mb-6">
                R$ {gift.value.toLocaleString("pt-BR")}
              </p>

              {gift.purchased ? (
                <span className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground">
                  <Check size={16} /> Presenteado
                </span>
              ) : (
                <button
                  onClick={() => handleGift(gift.id)}
                  className="inline-flex items-center gap-2 bg-foreground text-background font-body text-sm uppercase tracking-widest px-8 py-3 hover:bg-foreground/90 transition-colors duration-300"
                >
                  <Heart size={14} /> Presentear
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GiftList;
