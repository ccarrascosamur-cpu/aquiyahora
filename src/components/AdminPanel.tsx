import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Pencil, Upload, Check, ChevronLeft, Trash2, LogOut, Search } from 'lucide-react';
import type { Product } from '@/types/product';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUploadImage: (productId: string, imageData: string) => void;
  onDeleteImage: (productId: string) => void;
}

type View = 'login' | 'list' | 'edit';

export function AdminPanel({ isOpen, onClose, products, onUploadImage, onDeleteImage }: AdminPanelProps) {
  const { isAuthenticated, login, logout } = useAuth();
  const { toasts, addToast } = useToast();
  const [view, setView] = useState<View>('login');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle login submit
  const handleLogin = () => {
    if (login(password)) {
      setLoginError(false);
      setView('list');
      addToast('Acceso concedido', 'success');
    } else {
      setLoginError(true);
    }
  };

  // Handle product selection
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setView('edit');
  };

  // Handle image upload
  const handleImageUpload = (file: File) => {
    if (!selectedProduct) return;
    if (file.size > 2 * 1024 * 1024) {
      addToast('La imagen debe ser menor a 2MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      onUploadImage(selectedProduct.id, imageData);
      // Update the selected product's image locally
      setSelectedProduct(prev => prev ? { ...prev, image: imageData } : null);
      addToast('Imagen subida exitosamente', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  // Filtered products for list
  const filteredList = products.filter(p =>
    !searchQuery ||
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle delete image
  const handleDeleteImage = () => {
    if (!selectedProduct) return;
    onDeleteImage(selectedProduct.id);
    setSelectedProduct(prev => prev ? { ...prev, image: undefined } : null);
    addToast('Imagen eliminada', 'success');
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setView('login');
    onClose();
    addToast('Sesión cerrada', 'success');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] bg-white z-50 shadow-[-4px_0_24px_rgba(0,0,0,0.08)] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border-custom">
              <div className="flex items-center gap-3">
                {view === 'edit' && (
                  <button
                    onClick={() => { setView('list'); setSelectedProduct(null); }}
                    className="p-1.5 rounded-lg hover:bg-accent-rose/10 text-text-secondary transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                <h3 className="font-display text-lg font-semibold text-text-primary">
                  {view === 'login' && 'Acceso Admin'}
                  {view === 'list' && 'Panel de Administración'}
                  {view === 'edit' && selectedProduct?.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-500 transition-colors"
                    title="Cerrar sesión"
                  >
                    <LogOut size={18} />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-accent-rose/10 text-text-secondary transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {view === 'login' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6"
                >
                  <div className="flex flex-col items-center py-8">
                    <div className="w-16 h-16 rounded-full bg-accent-rose/10 flex items-center justify-center mb-4">
                      <Lock size={28} className="text-accent-rose" />
                    </div>
                    <p className="font-body text-text-secondary text-center text-sm mb-6">
                      Ingresa la contraseña de administrador para gestionar los productos
                    </p>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setLoginError(false); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      placeholder="Contraseña"
                      className={`w-full px-4 py-3 rounded-xl border font-body text-sm focus:outline-none focus:ring-2 transition-all ${
                        loginError
                          ? 'border-red-300 bg-red-50 focus:ring-red-200'
                          : 'border-border-custom focus:border-accent-rose focus:ring-accent-rose/20'
                      }`}
                    />
                    {loginError && (
                      <p className="text-red-500 text-xs font-body mt-2">Contraseña incorrecta</p>
                    )}
                    <button
                      onClick={handleLogin}
                      className="w-full mt-4 py-3 bg-accent-rose text-white rounded-pill font-body font-medium text-sm hover:bg-accent-rose/90 transition-colors"
                    >
                      Acceder
                    </button>
                    <p className="text-xs text-text-muted font-body mt-4">
                      Contraseña para demo: aquiyahora2025
                    </p>
                  </div>
                </motion.div>
              )}

              {view === 'list' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6"
                >
                  {/* Search */}
                  <div className="relative mb-4">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar producto..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border-custom bg-cream font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-rose transition-all"
                    />
                  </div>

                  {/* Product list */}
                  <div className="space-y-2">
                    {filteredList.map(product => (
                      <button
                        key={product.id}
                        onClick={() => handleEditProduct(product)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent-rose/5 transition-colors text-left group"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-bg-rose to-bg-lilac">
                          {product.image ? (
                            <img src={product.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-[10px] text-text-muted font-body">Sin foto</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm font-medium text-text-primary truncate">
                            {product.name}
                          </p>
                          <p className="font-body text-xs text-text-muted capitalize">
                            {product.category}
                          </p>
                        </div>
                        <Pencil size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {view === 'edit' && selectedProduct && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 space-y-6"
                >
                  {/* Image Upload Area */}
                  <div>
                    <label className="font-body text-xs font-medium uppercase tracking-wider text-text-muted mb-2 block">
                      Imagen del Producto
                    </label>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                        isDragging
                          ? 'border-accent-lilac bg-accent-lilac/10'
                          : 'border-border-custom hover:border-accent-rose/50'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {selectedProduct.image ? (
                        <div className="relative">
                          <img
                            src={selectedProduct.image}
                            alt={selectedProduct.name}
                            className="w-full h-48 object-contain rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                            <Upload size={24} className="text-white opacity-0 hover:opacity-100 drop-shadow-lg" />
                          </div>
                        </div>
                      ) : (
                        <div className="py-4">
                          <Upload size={28} className="mx-auto text-text-muted mb-2" />
                          <p className="font-body text-sm text-text-secondary">
                            Arrastra una foto o haz clic para seleccionar
                          </p>
                          <p className="font-body text-xs text-text-muted mt-1">
                            JPG, PNG. Máx 2MB
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Delete image button */}
                    {selectedProduct.image && (
                      <button
                        onClick={handleDeleteImage}
                        className="mt-2 flex items-center gap-1.5 text-xs font-body text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={12} />
                        Eliminar imagen
                      </button>
                    )}
                  </div>

                  {/* Product Name (read-only) */}
                  <div>
                    <label className="font-body text-xs font-medium uppercase tracking-wider text-text-muted mb-2 block">
                      Nombre del Producto
                    </label>
                    <input
                      type="text"
                      value={selectedProduct.name}
                      readOnly
                      className="w-full px-4 py-2.5 rounded-xl border border-border-custom bg-cream font-body text-sm text-text-primary cursor-not-allowed"
                    />
                  </div>

                  {/* Category (read-only) */}
                  <div>
                    <label className="font-body text-xs font-medium uppercase tracking-wider text-text-muted mb-2 block">
                      Categoría
                    </label>
                    <input
                      type="text"
                      value={selectedProduct.category}
                      readOnly
                      className="w-full px-4 py-2.5 rounded-xl border border-border-custom bg-cream font-body text-sm text-text-primary capitalize cursor-not-allowed"
                    />
                  </div>

                  {/* Aromas display (read-only info) */}
                  <div>
                    <label className="font-body text-xs font-medium uppercase tracking-wider text-text-muted mb-2 block">
                      Aromas Disponibles
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.aromas.map(aroma => (
                        <span
                          key={aroma}
                          className="px-3 py-1.5 rounded-pill bg-accent-rose/10 text-accent-rose font-body text-xs font-medium"
                        >
                          {aroma}
                        </span>
                      ))}
                    </div>
                    <p className="font-body text-xs text-text-muted mt-2 italic">
                      Los aromas se gestionan desde el catálogo central
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Toasts */}
            <div className="absolute bottom-4 right-4 left-4 space-y-2 pointer-events-none">
              <AnimatePresence>
                {toasts.map(toast => (
                  <motion.div
                    key={toast.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-pill shadow-lg font-body text-sm text-white ${
                      toast.type === 'success' ? 'bg-text-primary' : 'bg-red-500'
                    }`}
                  >
                    <Check size={14} />
                    {toast.message}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
