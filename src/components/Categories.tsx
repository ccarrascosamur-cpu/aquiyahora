import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Flame, Droplets, Wind, Sparkles, Wand2, Heart, Gift, ArrowRight, PenTool, RefreshCw } from 'lucide-react';
import { CATEGORIES } from '@/types/product';
import { useInView } from '@/hooks/useInView';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Flame,
  Droplets,
  Wind,
  Sparkles,
  Wand2,
  Heart,
  Gift,
  PenTool,
  RefreshCw,
};

interface CategoriesProps {
  onSelectCategory: (category: string) => void;
  activeCategory?: string;
}

export function Categories({ onSelectCategory, activeCategory }: CategoriesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);

  const handleClick = (slug: string) => {
    onSelectCategory(slug);
  };

  return (
    <section ref={sectionRef} className="w-full py-20 md:py-28 bg-white">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-[2.8rem] font-semibold text-text-primary">
            Nuestro Catálogo
          </h2>
          <p className="font-body text-base text-text-secondary mt-4 max-w-[56ch] mx-auto leading-relaxed">
            Selecciona una categoría para explorar todos los productos que tenemos para ti
          </p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.icon];
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => handleClick(cat.slug)}
                className={`group relative flex flex-col items-start p-6 md:p-8 rounded-card border transition-all duration-250 hover:-translate-y-1.5 hover:shadow-card-hover cursor-pointer text-left ${
                  isActive
                    ? 'bg-accent-rose/10 border-accent-rose/40 shadow-md'
                    : `bg-gradient-to-br ${cat.gradient} border-border-custom/50 hover:border-accent-rose/30`
                }`}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-250 ${
                  isActive ? 'bg-accent-rose/20' : 'bg-white/80'
                }`}>
                  {Icon && <Icon size={24} className={isActive ? 'text-accent-rose' : 'text-accent-rose'} />}
                </div>

                {/* Name */}
                <h3 className="font-body font-semibold text-text-primary text-[1.05rem] leading-tight">
                  {cat.name}
                </h3>

                {/* Count */}
                <span className="font-body text-xs text-text-muted mt-1.5">
                  {cat.count} productos
                </span>

                {/* Active indicator */}
                {isActive && (
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-accent-rose" />
                )}

                {/* Arrow */}
                <ArrowRight
                  size={18}
                  className={`absolute top-6 right-6 transition-all duration-250 ${
                    isActive 
                      ? 'text-accent-rose translate-x-1' 
                      : 'text-text-muted group-hover:text-accent-rose group-hover:translate-x-1'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
