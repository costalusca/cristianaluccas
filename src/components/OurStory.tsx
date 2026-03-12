import { motion } from "framer-motion";
import coupleImage from "@/assets/couple-story.jpg";

const timeline = [
  { year: "2018", title: "O Primeiro Encontro", desc: "Nos conhecemos em uma festa de amigos em comum. Foi amor à primeira vista." },
  { year: "2019", title: "Primeiro Namoro", desc: "Após meses de conversas e encontros, decidimos oficializar o relacionamento." },
  { year: "2021", title: "Morar Juntos", desc: "Demos o próximo passo e começamos a construir nosso lar juntos." },
  { year: "2025", title: "O Pedido", desc: "Em uma viagem especial, veio o pedido de casamento mais lindo do mundo." },
  { year: "2026", title: "O Grande Dia", desc: "Finalmente, vamos celebrar nosso amor com todos que amamos!" },
];

const OurStory = () => (
  <section id="historia" className="py-24 md:py-32 bg-background">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <p className="font-body text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">
          Como tudo começou
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-foreground">Nossa História</h2>
        <div className="w-16 h-px bg-gold mx-auto mt-6" />
      </motion.div>

      <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={coupleImage}
            alt="João e Maria"
            className="w-full h-[500px] object-cover shadow-lg"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-display text-2xl italic text-foreground mb-6">
            "O amor não se olha um para o outro, mas juntos na mesma direção."
          </p>
          <p className="font-body text-muted-foreground leading-relaxed">
            Nossa história começou como muitas grandes histórias de amor — por acaso. 
            Um encontro inesperado que se transformou na aventura mais bonita de nossas vidas. 
            Desde o primeiro olhar, soubemos que algo especial estava nascendo. 
            Agora, anos depois, estamos prontos para dar o passo mais importante juntos.
          </p>
        </motion.div>
      </div>

      {/* Timeline */}
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-border" />
        {timeline.map((item, i) => (
          <motion.div
            key={item.year}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className={`relative flex items-center mb-12 ${
              i % 2 === 0 ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <div className={`w-1/2 ${i % 2 === 0 ? "pr-10 text-right" : "pl-10 text-left"}`}>
              <span className="font-display text-gold text-lg">{item.year}</span>
              <h3 className="font-display text-xl text-foreground mt-1">{item.title}</h3>
              <p className="font-body text-sm text-muted-foreground mt-2">{item.desc}</p>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gold border-2 border-background" />
            <div className="w-1/2" />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default OurStory;
