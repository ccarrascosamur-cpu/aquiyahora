import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollPosition';

interface NavigationProps {
  onSearchClick: () => void;
}

const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Catálogo', href: '#catalogo' },
  { label: 'Nosotros', href: '#nosotros' },
];

export function Navigation({ onSearchClick }: NavigationProps) {
  const scrollY = useScrollPosition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isScrolled = scrollY > 80;

  const scrollToSection = (href: string) => {
    setMobileMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav shadow-nav'
            : 'bg-[#2D1F2D]/85 backdrop-blur-md'
        }`}
        style={{ height: 64 }}
      >
        <div className="max-w-[1320px] mx-auto px-6 md:px-12 h-full flex items-center justify-between">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? 'text-text-secondary hover:bg-accent-rose/10' : 'text-white hover:bg-white/10'
            }`}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Brand */}
          <a
            href="#inicio"
            onClick={(e) => { e.preventDefault(); scrollToSection('#inicio'); }}
            className={`font-display font-bold text-lg md:text-xl tracking-wide transition-colors ${
              isScrolled ? 'text-accent-rose' : 'text-white'
            }`}
          >
            Aquí & Ahora
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                className={`relative font-body text-[0.85rem] font-medium uppercase tracking-[0.08em] transition-colors group ${
                  isScrolled
                    ? 'text-text-secondary hover:text-accent-rose'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-accent-rose scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
              </a>
            ))}
          </div>

          {/* Right actions - solo search */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSearchClick}
              className={`p-2 rounded-lg transition-colors ${
                isScrolled
                  ? 'text-text-secondary hover:bg-accent-rose/10'
                  : 'text-white/80 hover:bg-white/10'
              }`}
              aria-label="Buscar"
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-[#2D1F2D]/95 backdrop-blur-xl md:hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-6">
              <span className="font-display font-bold text-lg text-white/90">Aquí & Ahora</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Cerrar menu"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center h-full gap-2 px-6">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.15, duration: 0.4 }}
                  onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                  className="font-display text-3xl text-white font-semibold py-3 hover:text-accent-rose transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="w-16 h-px bg-white/20 my-4"
              />
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col items-center gap-3 mt-2"
              >
                <span className="font-body text-xs uppercase tracking-[0.15em] text-white/40">Disponible en</span>
                <a
                  href="https://www.portalzen.cl"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-body text-sm text-white/70 hover:text-accent-rose transition-colors"
                >
                  portalzen.cl
                </a>
                <a
                  href="https://www.portalzenmayorista.cl"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-body text-sm text-white/70 hover:text-accent-rose transition-colors"
                >
                  portalzenmayorista.cl
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
