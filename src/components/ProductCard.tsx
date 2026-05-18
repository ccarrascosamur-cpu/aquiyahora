import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Eye } from 'lucide-react';
import type { Product } from '@/types/product';
import { CATEGORIES } from '@/types/product';

interface ProductCardProps {
  product: Product;
  isAdmin: boolean;
  onEdit: (product: Product) => void;
  onView: (product: Product) => void;
  index: number;
}

export function ProductCard({ product, isAdmin, onEdit, onView, index }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const categoryInfo = CATEGORIES.find(c => c.slug === product.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="group relative bg-white rounded-card border border-border-custom overflow-hidden hover:-translate-y-1 hover:shadow-card-hover transition-all duration-250 flex flex-col cursor-pointer"
      onClick={() => onView(product)}
    >
      {/* Image area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-bg-rose to-bg-lilac shrink-0">
        {product.image ? (
          <>
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-bg-rose to-bg-lilac animate-pulse" />
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-white/50 flex items-center justify-center mb-2">
                <span className="text-2xl font-display text-accent-rose/40">A&A</span>
              </div>
              <span className="font-body text-xs text-text-muted">Sin imagen</span>
            </div>
          </div>
        )}

        {/* Hover overlay with view icon */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg translate-y-2 group-hover:translate-y-0">
            <Eye size={20} className="text-text-primary" />
          </div>
        </div>

        {/* Admin edit button */}
        {isAdmin && (
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(product); }}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 hover:bg-accent-rose hover:text-white transition-all duration-200"
            aria-label="Editar producto"
          >
            <Pencil size={14} />
          </button>
        )}
      </div>

      {/* Content area */}
      <div className="p-4 md:p-5 flex flex-col flex-1">
        {/* Category badge */}
        <span
          className="inline-block self-start px-3 py-1 rounded-pill text-xs font-medium font-body mb-2"
          style={{
            backgroundColor: categoryInfo?.slug === 'velas' ? '#FCE8F0' :
              categoryInfo?.slug === 'aromatizantes' ? '#F0E6FF' :
              categoryInfo?.slug === 'difusores' ? '#E8F5E5' :
              categoryInfo?.slug === 'aceites' ? '#FFF0E5' :
              categoryInfo?.slug === 'sahumerios' ? '#FCE8F0' :
              categoryInfo?.slug === 'jabones' ? '#F0E6FF' :
              categoryInfo?.slug === 'papeleria' ? '#FFF0E8' : '#FFF0E5',
            color: '#6B5B6B',
          }}
        >
          {categoryInfo?.name || product.category}
        </span>

        {/* Product name */}
        <h3 className="font-body font-semibold text-text-primary text-[1.05rem] leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* Line */}
        {product.line && (
          <p className="font-body text-xs text-text-muted mt-1">
            {product.line}
          </p>
        )}

        {/* Description */}
        {product.description && (
          <p className="font-body text-xs text-text-secondary mt-2 line-clamp-3 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Aromas */}
        {product.aromas.length > 0 && product.aromas[0] !== '' && (
          <p className="font-body text-xs text-text-muted mt-3 pt-3 border-t border-border-custom/50 line-clamp-2">
            <span className="text-accent-rose font-medium">
              {product.category === 'papeleria' ? 'Diseños: ' : 'Aromas: '}
            </span>
            {product.aromas.join(', ')}
          </p>
        )}
      </div>
    </motion.div>
  );
}
