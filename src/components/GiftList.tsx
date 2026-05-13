import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Check, CreditCard, Copy, CheckCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import pixQrCode from "@/assets/pix-qrcode.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface GiftItem {
  id: string;
  name: string;
  description: string | null;
  value: number;
  purchased: boolean;
  icon: string | null;
  payment_url: string | null;
}

const PIX_KEY = "21988375483";
const PIX_BENEFICIARY = "Cristiana e Luccas";

const INITIAL_COUNT = 6;
const LOAD_MORE_COUNT = 12;

// Reorganiza os presentes alternando faixas de valor (baixa, média, alta)
// para evitar blocos seguidos de itens caros ou baratos.
const interleaveByValue = (items: GiftItem[]): GiftItem[] => {
  if (items.length <= 2) return items;
  const sorted = [...items].sort((a, b) => Number(a.value) - Number(b.value));
  const third = Math.ceil(sorted.length / 3);
  const low = sorted.slice(0, third);
  const mid = sorted.slice(third, third * 2);
  const high = sorted.slice(third * 2);
  const result: GiftItem[] = [];
  const max = Math.max(low.length, mid.length, high.length);
  for (let i = 0; i < max; i++) {
    if (low[i]) result.push(low[i]);
    if (mid[i]) result.push(mid[i]);
    if (high[i]) result.push(high[i]);
  }
  return result;
};

const GiftList = () => {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pixGift, setPixGift] = useState<GiftItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [pixBuyerName, setPixBuyerName] = useState("");
  const [pixSubmitting, setPixSubmitting] = useState(false);
  const [cardConfirmGift, setCardConfirmGift] = useState<GiftItem | null>(null);
  const [cardBuyerName, setCardBuyerName] = useState("");
  const [cardSubmitting, setCardSubmitting] = useState(false);

  useEffect(() => {
    const fetchGifts = async () => {
      const { data, error } = await supabase
        .from("gifts")
        .select("*")
        .order("value", { ascending: true });
      if (!error && data) setGifts(interleaveByValue(data));
      setLoading(false);
    };
    fetchGifts();
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(PIX_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, gifts.length));
  };

  const registerNotification = async (
    gift: GiftItem,
    method: "pix" | "card",
    buyerName: string,
  ) => {
    const { error } = await supabase.from("gift_notifications").insert({
      gift_id: gift.id,
      gift_name: gift.name,
      gift_value: gift.value,
      buyer_name: buyerName.trim() || null,
      payment_method: method,
    });
    if (error) {
      toast.error("Não foi possível registrar. Tente novamente.");
      return false;
    }
    toast.success("Obrigado! Sua contribuição foi registrada com carinho. 💛");
    return true;
  };

  const handlePixConfirm = async () => {
    if (!pixGift) return;
    setPixSubmitting(true);
    const ok = await registerNotification(pixGift, "pix", pixBuyerName);
    setPixSubmitting(false);
    if (ok) {
      setPixGift(null);
      setPixBuyerName("");
    }
  };

  const handleCardClick = (gift: GiftItem) => {
    if (!gift.payment_url) return;
    const url = gift.payment_url.startsWith("http")
      ? gift.payment_url
      : `https://${gift.payment_url}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setCardConfirmGift(gift);
    setCardBuyerName("");
  };

  const handleCardConfirm = async () => {
    if (!cardConfirmGift) return;
    setCardSubmitting(true);
    const ok = await registerNotification(cardConfirmGift, "card", cardBuyerName);
    setCardSubmitting(false);
    if (ok) {
      setCardConfirmGift(null);
      setCardBuyerName("");
    }
  };

  const allVisible = visibleCount >= gifts.length;
  const nearEnd = visibleCount + LOAD_MORE_COUNT >= gifts.length;

  if (loading) return null;

  return (
    <>
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
          <p className="font-body text-sm md:text-base text-muted-foreground mt-8 max-w-2xl mx-auto leading-relaxed text-center">
            Os presentes da lista são fictícios, e os valores carinhosamente recebidos serão destinados às prioridades deste novo começo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {gifts.slice(0, visibleCount).map((gift, i) => (
              <motion.div
                key={gift.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i >= visibleCount - LOAD_MORE_COUNT && i >= INITIAL_COUNT ? (i % LOAD_MORE_COUNT) * 0.05 : 0 }}
                className={`group border border-slate-900 bg-transparent text-navy p-8 text-center transition-all duration-300 hover:shadow-lg ${
                  gift.purchased ? "opacity-60" : "hover:border-gold"
                }`}
              >
                <span className="text-4xl mb-4 block">{gift.icon || "🎁"}</span>
                <h3 className="font-display text-xl text-foreground mb-2">{gift.name}</h3>
                <p className="font-body text-sm text-muted-foreground mb-4">{gift.description}</p>
                <p className="font-display text-2xl mb-6 text-primary">
                  R$ {Number(gift.value).toLocaleString("pt-BR")}
                </p>

                {gift.purchased ? (
                  <span className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground">
                    <Check size={16} /> Presenteado
                  </span>
                ) : (
                  <div className="flex flex-col gap-3">
                    {gift.payment_url && (
                      <button
                        onClick={() => handleCardClick(gift)}
                        className="inline-flex items-center justify-center gap-2 bg-foreground text-background font-body text-sm uppercase tracking-widest px-6 py-3 hover:bg-foreground/90 transition-colors duration-300"
                      >
                        <CreditCard size={14} /> Pagar com Cartão
                      </button>
                    )}
                    <button
                      onClick={() => { setPixGift(gift); setCopied(false); }}
                      className="inline-flex items-center justify-center gap-2 border border-foreground text-foreground font-body text-sm uppercase tracking-widest px-6 py-3 hover:bg-foreground/10 transition-colors duration-300"
                    >
                      <Heart size={14} /> Pagar com Pix
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {!allVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center mt-12"
            >
              <button
                onClick={handleLoadMore}
                className="font-body text-sm uppercase tracking-widest border border-foreground text-foreground px-8 py-3 hover:bg-foreground hover:text-background transition-colors duration-300"
              >
                {nearEnd ? "Ver todos" : "Ver mais presentes"}
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <Dialog open={!!pixGift} onOpenChange={(open) => { if (!open) { setPixGift(null); setPixBuyerName(""); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-center">
              Pagar com Pix
            </DialogTitle>
            {pixGift && (
              <DialogDescription className="text-center">
                {pixGift.name} — R$ {Number(pixGift.value).toLocaleString("pt-BR")}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="space-y-5 pt-2">
            <div className="flex justify-center">
              <img src={pixQrCode} alt="QR Code Pix" className="w-48 h-48 rounded-lg border border-border" />
            </div>

            <div className="space-y-2">
              <p className="font-body text-sm text-muted-foreground">Beneficiário</p>
              <p className="font-body text-base font-medium text-foreground">{PIX_BENEFICIARY}</p>
            </div>

            <div className="space-y-2">
              <p className="font-body text-sm text-muted-foreground">Chave Pix (telefone)</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-muted px-3 py-2 rounded text-sm font-mono text-foreground break-all">
                  {PIX_KEY}
                </code>
                <button
                  onClick={handleCopy}
                  className="shrink-0 p-2 border border-input rounded hover:bg-accent transition-colors"
                  title="Copiar chave Pix"
                >
                  {copied ? <CheckCheck size={16} className="text-green-600" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div className="bg-muted/50 border border-border rounded p-4">
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Após realizar o pagamento via Pix, pedimos que se identifique com seu nome para que possamos registrar o presente corretamente.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              <label className="font-body text-xs uppercase tracking-widest text-muted-foreground">
                Seu nome (opcional)
              </label>
              <input
                type="text"
                value={pixBuyerName}
                onChange={(e) => setPixBuyerName(e.target.value)}
                placeholder="Como gostaria de se identificar"
                className="w-full bg-transparent border border-border rounded px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors"
              />
              <button
                onClick={handlePixConfirm}
                disabled={pixSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-foreground text-background font-body text-sm uppercase tracking-widest px-6 py-3 hover:bg-foreground/90 transition-colors duration-300 disabled:opacity-60"
              >
                <Check size={14} /> {pixSubmitting ? "Registrando..." : "Já realizei o pagamento"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!cardConfirmGift}
        onOpenChange={(open) => { if (!open) { setCardConfirmGift(null); setCardBuyerName(""); } }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-center">
              Confirmação do presente
            </DialogTitle>
            {cardConfirmGift && (
              <DialogDescription className="text-center">
                {cardConfirmGift.name} — R$ {Number(cardConfirmGift.value).toLocaleString("pt-BR")}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="space-y-5 pt-2">
            <div className="bg-muted/50 border border-border rounded p-4">
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Assim que concluir o pagamento na página externa, clique abaixo para que possamos registrar com carinho.
              </p>
            </div>

            <div className="space-y-2">
              <label className="font-body text-xs uppercase tracking-widest text-muted-foreground">
                Seu nome (opcional)
              </label>
              <input
                type="text"
                value={cardBuyerName}
                onChange={(e) => setCardBuyerName(e.target.value)}
                placeholder="Como gostaria de se identificar"
                className="w-full bg-transparent border border-border rounded px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors"
              />
            </div>

            <button
              onClick={handleCardConfirm}
              disabled={cardSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-foreground text-background font-body text-sm uppercase tracking-widest px-6 py-3 hover:bg-foreground/90 transition-colors duration-300 disabled:opacity-60"
            >
              <Check size={14} /> {cardSubmitting ? "Registrando..." : "Já realizei o pagamento"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GiftList;
