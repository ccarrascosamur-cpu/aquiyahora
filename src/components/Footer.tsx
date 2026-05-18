import { ExternalLink } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Catálogo', href: '#catalogo' },
  { label: 'Nosotros', href: '#nosotros' },
];

const CAT_LINKS = [
  'Velas', 'Aromatizantes', 'Difusores', 'Aceites', 'Sahumerios', 'Jabones', 'Sets', 'Papelería',
];

export function Footer() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-cream border-t border-border-custom">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 py-14 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand column */}
          <div>
            <h4 className="font-display font-bold text-xl text-text-primary">
              Aquí & Ahora
            </h4>
            <p className="font-body text-sm text-text-muted mt-2">
              Representante Oficial en Chile
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <a
                href="https://www.portalzen.cl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-lilac/60 text-text-primary font-body text-xs font-medium rounded-pill hover:bg-accent-lilac transition-colors"
              >
                portalzen.cl
                <ExternalLink size={10} />
              </a>
              <a
                href="https://www.portalzenmayorista.cl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-peach/60 text-text-primary font-body text-xs font-medium rounded-pill hover:bg-accent-peach transition-colors"
              >
                portalzenmayorista.cl
                <ExternalLink size={10} />
              </a>
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <h5 className="font-body font-semibold text-sm uppercase tracking-wider text-text-primary mb-4">
              Navegación
            </h5>
            <ul className="space-y-2.5">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                    className="font-body text-sm text-text-secondary hover:text-accent-rose transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories column */}
          <div>
            <h5 className="font-body font-semibold text-sm uppercase tracking-wider text-text-primary mb-4">
              Categorías
            </h5>
            <ul className="space-y-2">
              {CAT_LINKS.map(cat => (
                <li key={cat}>
                  <span className="font-body text-sm text-text-muted">{cat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h5 className="font-body font-semibold text-sm uppercase tracking-wider text-text-primary mb-4">
              Contacto
            </h5>
            <p className="font-body text-sm text-text-secondary mb-3">
              Encuentra nuestros productos en:
            </p>
            <a
              href="https://www.portalzen.cl"
              target="_blank"
              rel="noopener noreferrer"
              className="block font-body text-sm text-accent-rose hover:underline mb-2"
            >
              www.portalzen.cl
            </a>
            <a
              href="https://www.portalzenmayorista.cl"
              target="_blank"
              rel="noopener noreferrer"
              className="block font-body text-sm text-accent-rose hover:underline"
            >
              www.portalzenmayorista.cl
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border-custom">
          <p className="font-body text-xs text-text-muted text-center">
            Aquí & Ahora &copy; {new Date().getFullYear()} — Representantes Oficiales en Chile
          </p>
          <p className="font-body text-xs text-text-muted/60 text-center mt-2">
            Sitio creado por{' '}
            <a
              href="https://emmagination.cl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-rose hover:underline"
            >
              Emmagination.cl
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
