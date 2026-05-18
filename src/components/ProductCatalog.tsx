import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Grid3X3 } from 'lucide-react';
import type { Product } from '@/types/product';
import { CATEGORIES } from '@/types/product';
import { useInView } from '@/hooks/useInView';
import { ProductCard } from './ProductCard';

interface ProductCatalogProps {
  products: Product[];
  filteredProducts: Product[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isAdmin: boolean;
  onEditProduct: (product: Product) => void;
  catalogExpanded: boolean;
  onExpandCatalog: () => void;
}

const FILTER_PILLS = [
  { label: 'Todos', value: 'todos' },
  ...CATEGORIES.map(c => ({ label: c.name, value: c.slug })),
];

// IDs de los 8 productos destacados para el preview
const PREVIEW_IDS = [
  'velas-soja-premium-ceremonia-magas',
  'difusores-varillas-aromaticos',
  'aceites-aromaticos',
  'jabones-naturales-150g',
  'aromatizantes-ambiente-tela',
  'sahumerios',
  'set-regalo-vela-antique-fosforos',
  'cuadernos-anillados-a5',
];

export function ProductCatalog({
  products,
  filteredProducts,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  isAdmin,
  onEditProduct,
  catalogExpanded,
  onExpandCatalog,
}: ProductCatalogProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);

  const isPreview = !catalogExpanded && activeCategory === 'todos' && !searchQuery;

  // Productos a mostrar: preview (8) o filtrados completos
  const displayProducts = isPreview
    ? PREVIEW_IDS.map(id => products.find(p => p.id === id)).filter(Boolean) as Product[]
    : filteredProducts;

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    onExpandCatalog();
  };

  return (
    <section id="catalogo" ref={sectionRef} className="w-full py-20 md:py-28 bg-cream">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-[2.8rem] font-semibold text-text-primary">
            {isPreview ? 'Descubre lo que tenemos' : 'Catálogo de Productos'}
          </h2>
          <p className="font-body text-base text-text-secondary mt-3">
            {isPreview
              ? 'Una muestra de nuestros productos artesanales'
              : `${filteredProducts.length} productos disponibles`
            }
          </p>
        </motion.div>

        {/* Search bar */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) onExpandCatalog();
              }}
              placeholder="Buscar productos o aromas..."
              className="w-full pl-11 pr-10 py-3 rounded-pill border border-border-custom bg-white font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-rose focus:ring-1 focus:ring-accent-rose/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Filter pills */}
        <div className="sticky top-16 z-30 py-4 -mx-6 md:-mx-12 px-6 md:px-12 mb-8 transition-all"
          style={{
            background: 'rgba(250, 247, 242, 0.95)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {FILTER_PILLS.map(pill => (
              <button
                key={pill.value}
                onClick={() => handleCategoryClick(pill.value)}
                className={`shrink-0 px-5 py-2.5 rounded-pill font-body text-sm font-medium transition-all duration-200 ${
                  activeCategory === pill.value
                    ? 'bg-accent-rose text-white shadow-md shadow-accent-rose/20'
                    : 'bg-white text-text-secondary border border-border-custom hover:border-accent-rose/30 hover:text-accent-rose'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          <AnimatePresence mode="popLayout">
            {displayProducts.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                isAdmin={isAdmin}
                onEdit={onEditProduct}
                index={i}
              />
            ))}

            {/* CTA Card para expandir el catálogo (solo en preview) */}
            {isPreview && (
              <motion.button
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, delay: displayProducts.length * 0.03 }}
                onClick={onExpandCatalog}
                className="group relative bg-gradient-to-br from-accent-rose/5 to-accent-lilac/5 rounded-card border-2 border-dashed border-accent-rose/30 hover:border-accent-rose/60 overflow-hidden hover:-translate-y-1 hover:shadow-card-hover transition-all duration-250 flex flex-col items-center justify-center min-h-[300px] cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-accent-rose/10 flex items-center justify-center mb-4 group-hover:bg-accent-rose/20 transition-colors">
                  <Grid3X3 size={28} className="text-accent-rose" />
                </div>
                <h3 className="font-body font-semibold text-text-primary text-lg mb-2">
                  Ver catálogo completo
                </h3>
                <p className="font-body text-sm text-text-secondary text-center px-6 mb-4">
                  Explora los {products.length} productos disponibles en todas nuestras categorías
                </p>
                <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-rose text-white font-body text-sm font-medium rounded-pill group-hover:bg-[#D88AAD] transition-colors">
                  Ver todo
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {!isPreview && filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="font-body text-text-muted text-lg">
              No se encontraron productos con tu búsqueda
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('todos'); }}
              className="mt-4 px-5 py-2.5 bg-accent-rose text-white rounded-pill font-body text-sm font-medium hover:bg-accent-rose/90 transition-colors"
            >
              Ver todos los productos
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
