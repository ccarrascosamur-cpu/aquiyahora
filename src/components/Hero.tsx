import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

interface VideoEmbed {
  type: 'youtube' | 'vimeo' | 'direct';
  src: string;
}

function parseVideoUrl(url: string): VideoEmbed | null {
  if (!url?.trim()) return null;
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    const id = ytMatch[1];
    return {
      type: 'youtube',
      src: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&controls=0&playlist=${id}&showinfo=0&rel=0&disablekb=1&iv_load_policy=3`,
    };
  }
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return {
      type: 'vimeo',
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&loop=1&background=1`,
    };
  }
  return { type: 'direct', src: url };
}

interface HeroProps {
  image?: string | null;
  videoUrl?: string | null;
}

export function Hero({ image, videoUrl }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.4], [0, -60]);

  const scrollToCatalog = () => {
    const el = document.querySelector('#catalogo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const videoEmbed = videoUrl ? parseVideoUrl(videoUrl) : null;
  const hasVideo = !!videoEmbed;

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="relative min-h-[100dvh] w-full overflow-hidden flex items-center"
    >
      {hasVideo ? (
        <>
          {/* Video background */}
          <div className="absolute inset-0 bg-black z-0">
            {videoEmbed!.type === 'direct' ? (
              <video
                src={videoEmbed!.src}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <iframe
                src={videoEmbed!.src}
                className="absolute border-0 pointer-events-none"
                style={{
                  width: '100vw',
                  height: '56.25vw',
                  minWidth: '177.78vh',
                  minHeight: '100vh',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                allow="autoplay; fullscreen"
                title="Hero background video"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/55 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#FAF7F2] to-transparent pointer-events-none" />
          </div>

          {/* Centered content overlay */}
          <motion.div
            style={{ opacity: textOpacity, y: textY }}
            className="relative z-10 w-full max-w-[860px] mx-auto px-6 md:px-12 pt-28 pb-16 text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-white/15 backdrop-blur-sm border border-white/25 mb-7"
            >
              <Sparkles size={14} className="text-white/90" />
              <span className="font-body text-xs font-medium uppercase tracking-[0.1em] text-white/90">
                Representante Oficial en Chile
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-bold text-white leading-[1.05] tracking-tight drop-shadow-2xl"
            >
              Aquí
              <br />
              <span className="text-accent-rose">&</span> Ahora
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-body text-lg md:text-xl text-white/80 mt-6 font-light max-w-[480px] mx-auto leading-relaxed"
            >
              Velas de soja artesanales, aromaterapia y papelería premium.
              Bienestar sensorial para tu espacio, diseñado con intención.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-9"
            >
              <button
                onClick={scrollToCatalog}
                className="inline-flex items-center gap-3 px-8 py-4 bg-accent-rose text-white font-body font-semibold text-sm rounded-pill hover:bg-[#D88AAD] transition-all duration-300 shadow-xl shadow-accent-rose/30 hover:-translate-y-0.5"
              >
                Explorar Catálogo
                <ArrowRight size={18} />
              </button>
              <a
                href="https://www.portalzen.cl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/15 backdrop-blur-sm text-white font-body font-medium text-sm rounded-pill border border-white/30 hover:bg-white/25 transition-all duration-300"
              >
                Visitar Portal Zen
                <ArrowRight size={14} />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex items-center justify-center gap-8 mt-12"
            >
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-white">59+</p>
                <p className="font-body text-xs text-white/60 mt-0.5">Productos</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-white">8</p>
                <p className="font-body text-xs text-white/60 mt-0.5">Categorías</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-white">100%</p>
                <p className="font-body text-xs text-white/60 mt-0.5">Artesanal</p>
              </div>
            </motion.div>
          </motion.div>
        </>
      ) : (
        <>
          {/* Layered gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FDF6F9] via-[#F8F0FF] to-[#FAF7F2]" />

          {/* Animated orbs */}
          <motion.div
            style={{ y: bgY }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] rounded-full bg-gradient-radial from-accent-rose/25 via-accent-rose/5 to-transparent blur-3xl" />
            <div className="absolute bottom-[15%] right-[8%] w-[600px] h-[600px] rounded-full bg-gradient-radial from-accent-lilac/20 via-accent-lilac/5 to-transparent blur-3xl" />
            <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full bg-gradient-radial from-accent-peach/15 to-transparent blur-3xl" />
          </motion.div>

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-accent-rose/30"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${20 + (i % 3) * 25}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 0.7, 0.3],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.8,
                }}
              />
            ))}
          </div>

          {/* Content container */}
          <div className="relative z-10 w-full max-w-[1320px] mx-auto px-6 md:px-12 pt-24 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[70vh]">

              {/* Left: Text content */}
              <motion.div
                style={{ opacity: textOpacity, y: textY }}
                className="order-2 lg:order-1 text-center lg:text-left"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-white/70 backdrop-blur-sm border border-border-custom/50 mb-6"
                >
                  <Sparkles size={14} className="text-accent-rose" />
                  <span className="font-body text-xs font-medium uppercase tracking-[0.1em] text-text-secondary">
                    Representante Oficial en Chile
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[5.5rem] font-bold text-text-primary leading-[1.05] tracking-tight"
                >
                  Aquí
                  <br />
                  <span className="text-accent-rose">&</span> Ahora
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="font-body text-lg md:text-xl text-text-secondary mt-6 font-light max-w-md mx-auto lg:mx-0 leading-relaxed"
                >
                  Velas de soja artesanales, aromaterapia y papelería premium.
                  Bienestar sensorial para tu espacio, diseñado con intención.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex flex-col sm:flex-row items-center gap-4 mt-8 justify-center lg:justify-start"
                >
                  <button
                    onClick={scrollToCatalog}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-accent-rose text-white font-body font-semibold text-sm rounded-pill hover:bg-[#D88AAD] transition-all duration-300 shadow-xl shadow-accent-rose/20 hover:shadow-accent-rose/30 hover:-translate-y-0.5"
                  >
                    Explorar Catálogo
                    <ArrowRight size={18} />
                  </button>
                  <a
                    href="https://www.portalzen.cl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/60 backdrop-blur-sm text-text-primary font-body font-medium text-sm rounded-pill border border-border-custom hover:bg-white hover:border-accent-rose/30 transition-all duration-300"
                  >
                    Visitar Portal Zen
                    <ArrowRight size={14} />
                  </a>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="flex items-center gap-6 mt-10 justify-center lg:justify-start"
                >
                  <div className="text-center lg:text-left">
                    <p className="font-display text-2xl font-bold text-accent-rose">59+</p>
                    <p className="font-body text-xs text-text-muted mt-0.5">Productos</p>
                  </div>
                  <div className="w-px h-8 bg-border-custom" />
                  <div className="text-center lg:text-left">
                    <p className="font-display text-2xl font-bold text-accent-rose">8</p>
                    <p className="font-body text-xs text-text-muted mt-0.5">Categorías</p>
                  </div>
                  <div className="w-px h-8 bg-border-custom" />
                  <div className="text-center lg:text-left">
                    <p className="font-display text-2xl font-bold text-accent-rose">100%</p>
                    <p className="font-body text-xs text-text-muted mt-0.5">Artesanal</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right: Hero image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                className="order-1 lg:order-2 relative"
              >
                <div className="relative">
                  <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-accent-rose/10 via-accent-lilac/10 to-accent-peach/10" />
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-text-primary/5">
                    <img
                      src={image || '/hero-lifestyle.jpg'}
                      alt="Velas de soja artesanales, difusores y productos de bienestar Aquí y Ahora"
                      className="w-full h-auto object-cover aspect-[4/5] lg:aspect-[3/4]"
                    />
                    <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.03)]" />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    className="absolute -top-4 -left-4 md:top-4 md:-left-8 bg-white/80 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg border border-white/50"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="font-body text-xs font-medium text-text-secondary">Disponible en Chile</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="absolute -bottom-4 -right-4 md:bottom-6 md:-right-6 bg-white/80 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg border border-white/50 max-w-[180px]"
                  >
                    <p className="font-body text-[11px] text-text-muted leading-snug">
                      Envíos a todo Chile a través de{' '}
                      <span className="text-accent-rose font-medium">Portal Zen</span>
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream to-transparent pointer-events-none" />
        </>
      )}
    </section>
  );
}
