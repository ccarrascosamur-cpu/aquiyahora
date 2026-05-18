import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '56923872498';
const WHATSAPP_MESSAGE = 'Hola Portal Zen, vi el catálogo de Aquí & Ahora y me gustaría consultar sobre sus productos.';

export function WhatsAppButton() {
  const handleClick = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 260, damping: 20 }}
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 pl-4 pr-5 py-3.5 bg-[#25D366] text-white rounded-full shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 hover:-translate-y-0.5 transition-all duration-300 group"
      aria-label="Chatear por WhatsApp con Portal Zen"
      title="Chatear por WhatsApp"
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 pointer-events-none" />
      
      <MessageCircle size={22} className="relative z-10 fill-white" />
      <span className="relative z-10 font-body text-sm font-medium hidden sm:inline">
        Escríbenos
      </span>
    </motion.button>
  );
}
