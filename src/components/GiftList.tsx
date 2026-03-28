import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Check, CreditCard, Copy, CheckCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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

const GiftList = () => {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pixGift, setPixGift] = useState<GiftItem | null>(null);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(PIX_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {gifts.map((gift, i) => (
              <motion.div
                key={gift.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
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
                      <a
                        href={gift.payment_url.startsWith("http") ? gift.payment_url : `https://${gift.payment_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-foreground text-background font-body text-sm uppercase tracking-widest px-6 py-3 hover:bg-foreground/90 transition-colors duration-300"
                      >
                        <CreditCard size={14} /> Pagar com Cartão
                      </a>
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
        </div>
      </section>

      <Dialog open={!!pixGift} onOpenChange={(open) => !open && setPixGift(null)}>
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GiftList;
