import { Heart } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";

const Footer = () => {
  const { settings, loading } = useSiteSettings();

  if (loading) return null;

  const dateStr = new Date(settings.wedding_date).toLocaleDateString("pt-BR", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <footer className="py-16 bg-foreground text-primary-foreground">
      <div className="container mx-auto px-6 text-center">
        <p className="font-pinyon text-4xl mb-4">{settings.groom_name} & {settings.bride_name}</p>
        <p className="font-body text-sm text-primary-foreground/60 tracking-widest uppercase mb-6">{dateStr}</p>
        <div className="w-16 h-px mx-auto mb-6 bg-slate-100" />
        <p className="font-body text-xs text-primary-foreground/40 flex items-center justify-center gap-1">
          {settings.footer_text}
        </p>
        <a
          href="/login"
          className="inline-block mt-6 font-body text-[10px] text-primary-foreground/25 hover:text-primary-foreground/40 uppercase tracking-widest transition-colors"
        >
          Área dos Noivos
        </a>
      </div>
    </footer>
  );
};

export default Footer;
