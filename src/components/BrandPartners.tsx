import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

export function BrandPartners() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);

  return (
    <section ref={sectionRef} className="w-full py-16 md:py-20 bg-bg-rose/30">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="font-body text-xs font-medium uppercase tracking-[0.12em] text-text-muted">
            Encuentra Nuestros Productos
          </span>
          <h3 className="font-display text-2xl md:text-[1.8rem] font-semibold text-text-primary mt-3">
            Disponible en Chile a través de
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <motion.a
              href="https://www.portalzen.cl"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-accent-lilac text-text-primary font-body font-medium rounded-pill hover:bg-accent-lilac/80 transition-colors shadow-md"
            >
              Portal Zen
              <ExternalLink size={16} />
            </motion.a>
            <motion.a
              href="https://www.portalzenmayorista.cl"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-accent-peach text-text-primary font-body font-medium rounded-pill hover:bg-accent-peach/80 transition-colors shadow-md"
            >
              Portal Zen Mayorista
              <ExternalLink size={16} />
            </motion.a>
          </div>

          <p className="font-body text-sm text-text-secondary mt-6">
            Representantes oficiales de Aquí & Ahora en Chile
          </p>
        </motion.div>
      </div>
    </section>
  );
}
