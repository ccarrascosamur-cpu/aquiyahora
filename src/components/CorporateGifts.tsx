import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Gift, Briefcase, ArrowRight, Heart, Package, Leaf, Droplets, Globe } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

export function CorporateGifts() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);

  return (
    <section ref={sectionRef} className="w-full py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-rose/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-lilac/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-accent-rose/10 border border-accent-rose/20 mb-6">
              <Briefcase size={14} className="text-accent-rose" />
              <span className="font-body text-xs font-semibold uppercase tracking-[0.1em] text-accent-rose">
                Regalos Corporativos
              </span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl lg:text-[2.8rem] font-semibold text-text-primary leading-tight">
              Regalos que dejan huella en tu equipo y clientes
            </h2>

            <p className="font-body text-base text-text-secondary mt-5 leading-relaxed max-w-lg">
              Ofrecemos soluciones personalizadas de regalos corporativos con productos 
              Aquí & Ahora: velas de soja artesanales, aromaterapia, papelería premium 
              y sets de bienestar. Cada detalle pensado para transmitir calidad, 
              cuidado y una experiencia sensorial memorable.
            </p>

            <p className="font-body text-base text-text-secondary mt-4 leading-relaxed max-w-lg">
              Ideal para agasajar colaboradores, agradecer a clientes estratégicos, 
              eventos de fin de año, lanzamientos o cualquier momento que merezca 
              un gesto especial y consciente.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-8">
              <a
                href="https://www.portalzen.cl/pages/corporativos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-accent-rose text-white font-body font-medium text-sm rounded-pill hover:bg-[#D88AAD] transition-all duration-300 shadow-lg shadow-accent-rose/15"
              >
                <Gift size={16} />
                Cotizar regalos corporativos
                <ArrowRight size={14} />
              </a>
              <a
                href="https://www.portalzenmayorista.cl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 text-text-secondary font-body font-medium text-sm hover:text-accent-rose transition-colors"
              >
                Ver precios mayoristas
                <ArrowRight size={14} />
              </a>
            </div>
          </motion.div>

          {/* Right: Features grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {[
              {
                icon: Package,
                title: 'Sets personalizados',
                desc: 'Armamos packs a medida según tu presupuesto y necesidad.',
              },
              {
                icon: Leaf,
                title: 'Extractos naturales',
                desc: 'Fórmulas con ingredientes de origen natural y esencias puras.',
              },
              {
                icon: Heart,
                title: 'Bienestar consciente',
                desc: 'Productos naturales, veganos y hechos artesanalmente.',
              },
              {
                icon: Briefcase,
                title: 'Branding opcional',
                desc: 'Posibilidad de incluir tu logo o mensaje personalizado.',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="p-6 rounded-card bg-cream border border-border-custom/60 hover:border-accent-rose/30 hover:shadow-card-hover transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-accent-rose/10 flex items-center justify-center mb-4">
                  <feature.icon size={20} className="text-accent-rose" />
                </div>
                <h4 className="font-body font-semibold text-text-primary text-sm mb-1.5">
                  {feature.title}
                </h4>
                <p className="font-body text-xs text-text-secondary leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}

            {/* Brand values badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="sm:col-span-2 mt-2"
            >
              <div className="flex flex-wrap items-center justify-center gap-6 p-5 rounded-card bg-cream border border-border-custom/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full border-2 border-accent-rose/40 flex items-center justify-center">
                    <Globe size={16} className="text-accent-rose" />
                  </div>
                  <span className="font-body text-xs font-medium text-text-secondary">Earth Friendly</span>
                </div>
                <div className="w-px h-6 bg-border-custom hidden sm:block" />
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full border-2 border-accent-rose/40 flex items-center justify-center">
                    <Leaf size={16} className="text-accent-rose" />
                  </div>
                  <span className="font-body text-xs font-medium text-text-secondary">Natural Extracts</span>
                </div>
                <div className="w-px h-6 bg-border-custom hidden sm:block" />
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full border-2 border-accent-rose/40 flex items-center justify-center">
                    <Droplets size={16} className="text-accent-rose" />
                  </div>
                  <span className="font-body text-xs font-medium text-text-secondary">Silicone Free</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
