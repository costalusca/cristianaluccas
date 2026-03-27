import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const RSVPSection = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    attending: "yes",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("rsvp_responses").insert({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim() || null,
        guests: 1,
        attending: form.attending === "yes",
        message: form.message.trim() || null,
      });
      if (error) throw error;
      toast.success("Presença confirmada! Obrigado pela confirmação. 💝");
      setForm({ name: "", phone: "", email: "", address: "", attending: "yes", message: "" });
    } catch {
      toast.error("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-transparent border-b border-border py-3 px-1 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors";

  return (
    <section id="rsvp" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Esperamos por você
          </p>
          <h2 className="font-pinyon text-4xl md:text-5xl text-foreground">
            Confirme sua Presença
          </h2>
          <div className="w-16 h-px mx-auto mt-6 bg-navy" />
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          <input
            type="text"
            placeholder="Nome Completo"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <input
              type="tel"
              placeholder="Telefone / WhatsApp"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputClass}
            />
            <input
              type="email"
              placeholder="E-mail"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
            />
          </div>

          <input
            type="text"
            placeholder="Endereço"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className={inputClass}
          />

          <div>
            <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
              Confirmação
            </label>
            <div className="flex gap-6 pt-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="attending"
                  value="yes"
                  checked={form.attending === "yes"}
                  onChange={(e) => setForm({ ...form, attending: e.target.value })}
                  className="accent-gold"
                />
                <span className="font-body text-sm text-foreground">Vou ao casamento</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="attending"
                  value="no"
                  checked={form.attending === "no"}
                  onChange={(e) => setForm({ ...form, attending: e.target.value })}
                  className="accent-gold"
                />
                <span className="font-body text-sm text-foreground">Não poderei ir</span>
              </label>
            </div>
          </div>

          <textarea
            placeholder="Mensagem para os noivos (opcional)"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={4}
            className={`${inputClass} resize-none`}
          />

          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-foreground text-background font-body text-sm uppercase tracking-widest px-12 py-4 hover:bg-foreground/90 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar Confirmação"}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default RSVPSection;
