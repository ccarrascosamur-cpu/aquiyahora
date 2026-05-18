// ProductDetailPage - no navigation needed
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, Sparkles, Wind, Droplets, Flame, Heart, Gift, PenTool, Wand2, Layers } from 'lucide-react';
import type { Product } from '@/types/product';
import { CATEGORIES } from '@/types/product';
import { useState, useEffect } from 'react';

interface ProductDetailPageProps {
  product: Product;
  onClose: () => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  velas: <Flame size={16} />,
  aromatizantes: <Droplets size={16} />,
  difusores: <Wind size={16} />,
  aceites: <Sparkles size={16} />,
  sahumerios: <Wand2 size={16} />,
  jabones: <Heart size={16} />,
  sets: <Gift size={16} />,
  papeleria: <PenTool size={16} />,
};

export function ProductDetailPage({ product, onClose }: ProductDetailPageProps) {
  // No navigation needed
  const [imageLoaded, setImageLoaded] = useState(false);
  const categoryInfo = CATEGORIES.find(c => c.slug === product.category);

  // Lock body scroll when open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, []);

  // Close on escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const isPapeleria = product.category === 'papeleria';
  const aromaLabel = isPapeleria ? 'Diseños' : 'Aromas disponibles';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-[#2D1F2D]/60 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
          style={{ scrollbarWidth: 'thin' }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-accent-rose hover:text-white transition-all duration-200"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Section */}
            <div className="relative aspect-square md:aspect-auto md:min-h-[500px] bg-gradient-to-br from-bg-rose to-bg-lilac overflow-hidden">
              {product.image ? (
                <>
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-bg-rose to-bg-lilac animate-pulse" />
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto rounded-full bg-white/50 flex items-center justify-center mb-3">
                      <span className="text-4xl font-display text-accent-rose/40">A&A</span>
                    </div>
                    <span className="font-body text-sm text-text-muted">Sin imagen</span>
                  </div>
                </div>
              )}

              {/* Category badge on image */}
              <div className="absolute top-4 left-4">
                <span
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-pill text-xs font-medium font-body bg-white/90 backdrop-blur-sm shadow-sm"
                  style={{ color: '#6B5B6B' }}
                >
                  {CATEGORY_ICONS[product.category]}
                  {categoryInfo?.name || product.category}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 md:p-10 flex flex-col">
              {/* Line */}
              {product.line && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-elegant text-accent-rose text-lg mb-2"
                >
                  {product.line}
                </motion.p>
              )}

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-text-primary leading-tight mb-4"
              >
                {product.name}
              </motion.h1>

              {/* Divider */}
              <div className="w-12 h-0.5 bg-accent-rose/30 rounded-full mb-6" />

              {/* Description */}
              {product.description && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-body text-text-secondary leading-relaxed mb-8"
                >
                  {product.description}
                </motion.p>
              )}

              {/* Model (for papeleria) */}
              {isPapeleria && product.model && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 }}
                  className="mb-6"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Layers size={16} className="text-accent-lilac" />
                    <span className="font-body text-xs font-medium uppercase tracking-wider text-text-muted">
                      Modelo
                    </span>
                  </div>
                  <p className="font-body text-text-primary font-medium">{product.model}</p>
                </motion.div>
              )}

              {/* Aromas / Diseños */}
              {product.aromas.length > 0 && product.aromas[0] !== '' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="mb-8"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-accent-rose" />
                    <span className="font-body text-xs font-medium uppercase tracking-wider text-text-muted">
                      {aromaLabel}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.aromas.map((aroma, i) => (
                      <motion.span
                        key={aroma}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.04 }}
                        className="px-3.5 py-1.5 rounded-pill bg-bg-rose text-text-secondary font-body text-sm font-medium"
                      >
                        {aroma}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-auto pt-4"
              >
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent-rose text-white font-body text-sm font-medium rounded-pill hover:bg-[#D88AAD] transition-colors shadow-md shadow-accent-rose/20"
                >
                  <ChevronLeft size={16} />
                  Volver al catálogo
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
