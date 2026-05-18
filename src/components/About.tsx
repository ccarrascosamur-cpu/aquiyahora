import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

interface AboutProps {
  image?: string | null;
}

export function About({ image }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);

  return (
    <section
      id="nosotros"
      ref={sectionRef}
      className="w-full py-20 md:py-32 bg-cream"
    >
      <div className="max-w-[1320px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-center">
          {/* Left column — text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="font-body text-xs font-medium uppercase tracking-[0.12em] text-accent-rose">
              Representante Oficial en Chile
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[2.4rem] font-semibold text-text-primary mt-3 leading-tight">
              Llevamos el bienestar a tu hogar
            </h2>
            <p className="font-body text-base text-text-secondary mt-6 leading-relaxed max-w-[48ch]">
              Somos los representantes oficiales de Aquí & Ahora en Chile, la marca argentina líder en velas de soja, 
              aromaterapia y productos de bienestar. Cada pieza está elaborada artesanalmente con ingredientes naturales, 
              diseñada para transformar tus espacios en santuarios de calma y armonía.
            </p>
            <p className="font-body text-base text-text-secondary mt-4">
              Encuentra nuestros productos disponibles en:
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <a
                href="https://www.portalzen.cl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-lilac text-text-primary font-body font-medium text-sm rounded-pill hover:bg-accent-lilac/80 transition-colors"
              >
                portalzen.cl
                <ExternalLink size={14} />
              </a>
              <a
                href="https://www.portalzenmayorista.cl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-peach text-text-primary font-body font-medium text-sm rounded-pill hover:bg-accent-peach/80 transition-colors"
              >
                portalzenmayorista.cl
                <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>

          {/* Right column — image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src={image || '/about-showcase.jpg'}
                alt="Productos Aquí y Ahora"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent-rose/20 rounded-full blur-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
