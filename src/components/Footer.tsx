import { Heart } from "lucide-react";

const Footer = () => (
  <footer className="py-16 bg-foreground text-primary-foreground">
    <div className="container mx-auto px-6 text-center">
      <p className="font-display text-3xl mb-4">João & Maria</p>
      <p className="font-body text-sm text-primary-foreground/60 tracking-widest uppercase mb-6">
        15 de Agosto de 2026
      </p>
      <div className="w-16 h-px bg-gold mx-auto mb-6" />
      <p className="font-body text-xs text-primary-foreground/40 flex items-center justify-center gap-1">
        Feito com <Heart size={12} className="text-gold" /> para o nosso grande dia
      </p>
    </div>
  </footer>
);

export default Footer;
