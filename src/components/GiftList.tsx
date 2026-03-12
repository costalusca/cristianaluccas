import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Check, X, QrCode, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface GiftItem {
  id: string;
  name: string;
  description: string | null;
  value: number;
  purchased: boolean;
  icon: string | null;
}

const GiftList = () => {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState<GiftItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [buyerName, setBuyerName] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    const { data, error } = await supabase
      .from("gifts")
      .select("*")
      .order("created_at");
    if (!error && data) setGifts(data);
    setLoading(false);
  };

  const handlePurchase = async () => {
    if (!paymentModal || !buyerName.trim()) {
      toast.error("Por favor, insira seu nome.");
      return;
    }
    setProcessing(true);
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2000));

    const { error } = await supabase
      .from("gifts")
      .update({
        purchased: true,
        purchased_by: buyerName.trim(),
        purchased_at: new Date().toISOString(),
      })
      .eq("id", paymentModal.id)
      .eq("purchased", false);

    if (error) {
      toast.error("Erro ao processar. Tente novamente.");
    } else {
      toast.success("Obrigado pelo presente! 💝");
      setGifts((prev) =>
        prev.map((g) => (g.id === paymentModal.id ? { ...g, purchased: true } : g))
      );
    }
    setProcessing(false);
    setPaymentModal(null);
    setPaymentMethod(null);
    setBuyerName("");
  };

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
              ) : (
                <button
                  onClick={() => setPaymentModal(gift)}
                  className="inline-flex items-center gap-2 bg-foreground text-background font-body text-sm uppercase tracking-widest px-8 py-3 hover:bg-foreground/90 transition-colors duration-300"
                >
                  <Heart size={14} /> Presentear
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {paymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => { setPaymentModal(null); setPaymentMethod(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card w-full max-w-md p-8 relative"
            >
              <button
                onClick={() => { setPaymentModal(null); setPaymentMethod(null); }}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6">
                <span className="text-3xl block mb-2">{paymentModal.icon}</span>
                <h3 className="font-display text-2xl text-foreground">{paymentModal.name}</h3>
                <p className="font-display text-xl text-gold mt-2">
                  R$ {Number(paymentModal.value).toLocaleString("pt-BR")}
                </p>
              </div>

              <input
                type="text"
                placeholder="Seu nome completo"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full border-b border-border bg-transparent py-3 px-1 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors mb-6"
              />

              <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-4">
                Escolha a forma de pagamento
              </p>

              <div className="space-y-3 mb-6">
                {[
                  { id: "pix", label: "Pix (QR Code)", icon: <QrCode size={18} /> },
                  { id: "credit", label: "Cartão de Crédito", icon: <CreditCard size={18} /> },
                  { id: "debit", label: "Cartão de Débito", icon: <CreditCard size={18} /> },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full flex items-center gap-3 p-4 border transition-all duration-200 font-body text-sm ${
                      paymentMethod === method.id
                        ? "border-gold bg-gold/5 text-foreground"
                        : "border-border text-muted-foreground hover:border-foreground/30"
                    }`}
                  >
                    {method.icon}
                    {method.label}
                  </button>
                ))}
              </div>

              {paymentMethod === "pix" && (
                <div className="text-center mb-6 p-4 border border-border">
                  <div className="w-32 h-32 mx-auto bg-muted flex items-center justify-center mb-3">
                    <QrCode size={80} className="text-foreground" />
                  </div>
                  <p className="font-body text-xs text-muted-foreground">
                    Escaneie o QR Code com seu aplicativo bancário
                  </p>
                </div>
              )}

              <button
                onClick={handlePurchase}
                disabled={!paymentMethod || !buyerName.trim() || processing}
                className="w-full bg-foreground text-background font-body text-sm uppercase tracking-widest py-4 hover:bg-foreground/90 transition-colors duration-300 disabled:opacity-50"
              >
                {processing ? "Processando..." : "Confirmar Pagamento"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GiftList;
