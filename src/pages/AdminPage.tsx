import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Pencil, Upload, Check, ChevronLeft, Trash2, LogOut, Search, Image, RotateCcw } from 'lucide-react';
import type { Product } from '@/types/product';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

interface AdminPageProps {
  products: Product[];
  onUploadImage: (productId: string, imageData: string) => void;
  onDeleteImage: (productId: string) => void;
  heroImage: string;
  aboutImage: string;
  onUploadHeroImage: (imageData: string) => void;
  onResetHeroImage: () => void;
  onUploadAboutImage: (imageData: string) => void;
  onResetAboutImage: () => void;
}

type View = 'login' | 'list' | 'edit' | 'home-images';

export function AdminPage({ products, onUploadImage, onDeleteImage, heroImage, aboutImage, onUploadHeroImage, onResetHeroImage, onUploadAboutImage, onResetAboutImage }: AdminPageProps) {
  const { isAuthenticated, login, logout } = useAuth();
  const { toasts, addToast } = useToast();
  const [view, setView] = useState<View>(isAuthenticated ? 'list' : 'login');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const homeImageInputRef = useRef<HTMLInputElement>(null);
  const aboutImageInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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
      setSelectedProduct(prev => prev ? { ...prev, image: imageData } : null);
      addToast('Imagen subida exitosamente', 'success');
    };
    reader.readAsDataURL(file);
  };

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  // Handle site image uploads
  const handleSiteImageUpload = (file: File, uploadFn: (data: string) => void, label: string) => {
    if (file.size > 2 * 1024 * 1024) {
      addToast('La imagen debe ser menor a 2MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      uploadFn(imageData);
      addToast(`${label} actualizada`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const filteredList = products.filter(p =>
    !searchQuery ||
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteImage = () => {
    if (!selectedProduct) return;
    onDeleteImage(selectedProduct.id);
    setSelectedProduct(prev => prev ? { ...prev, image: undefined } : null);
    addToast('Imagen eliminada', 'success');
  };

  const handleLogout = () => {
    logout();
    setView('login');
    addToast('Sesión cerrada', 'success');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border-custom">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-accent-rose/10 text-text-secondary transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="font-display text-lg font-semibold text-text-primary">
              Panel de Administración
            </h1>
          </div>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-pill text-sm font-body text-text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 py-8">
        {view === 'login' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto py-16"
          >
            <div className="bg-white rounded-2xl border border-border-custom p-8 shadow-sm">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-accent-rose/10 flex items-center justify-center mb-6">
                  <Lock size={28} className="text-accent-rose" />
                </div>
                <h2 className="font-display text-xl font-semibold text-text-primary mb-2">
                  Acceso Administrador
                </h2>
                <p className="font-body text-sm text-text-secondary text-center mb-8">
                  Ingresa la contraseña para gestionar las imágenes de productos
                </p>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setLoginError(false); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Contraseña"
                  className={`w-full px-4 py-3.5 rounded-xl border font-body text-sm focus:outline-none focus:ring-2 transition-all ${
                    loginError
                      ? 'border-red-300 bg-red-50 focus:ring-red-200'
                      : 'border-border-custom focus:border-accent-rose focus:ring-accent-rose/20'
                  }`}
                />
                {loginError && (
                  <p className="text-red-500 text-xs font-body mt-2 self-start">Contraseña incorrecta</p>
                )}
                <button
                  onClick={handleLogin}
                  className="w-full mt-5 py-3.5 bg-accent-rose text-white rounded-pill font-body font-medium text-sm hover:bg-[#D88AAD] transition-colors"
                >
                  Acceder
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'list' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Stats bar */}
            <div className="flex items-center gap-6 mb-8">
              <div className="bg-white rounded-xl px-5 py-3 border border-border-custom">
                <span className="font-body text-xs text-text-muted uppercase tracking-wider">Total productos</span>
                <p className="font-display text-xl font-bold text-text-primary">{products.length}</p>
              </div>
              <div className="bg-white rounded-xl px-5 py-3 border border-border-custom">
                <span className="font-body text-xs text-text-muted uppercase tracking-wider">Con imagen</span>
                <p className="font-display text-xl font-bold text-accent-rose">
                  {products.filter(p => p.image).length}
                </p>
              </div>
              <div className="bg-white rounded-xl px-5 py-3 border border-border-custom">
                <span className="font-body text-xs text-text-muted uppercase tracking-wider">Sin imagen</span>
                <p className="font-display text-xl font-bold text-text-muted">
                  {products.filter(p => !p.image).length}
                </p>
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => setView('home-images')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-border-custom rounded-xl font-body text-sm text-text-secondary hover:border-accent-rose/40 hover:text-accent-rose transition-colors"
              >
                <Image size={16} />
                Imágenes del Home
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar producto..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border-custom bg-white font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-rose transition-all"
              />
            </div>

            {/* Product list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredList.map(product => (
                <button
                  key={product.id}
                  onClick={() => handleEditProduct(product)}
                  className="bg-white rounded-card border border-border-custom p-4 hover:border-accent-rose/30 hover:shadow-card-hover transition-all text-left group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-bg-rose to-bg-lilac">
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
                      <p className="font-body text-xs text-text-muted capitalize mt-0.5">
                        {product.category}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <Pencil size={12} className="text-accent-rose" />
                        <span className="font-body text-xs text-accent-rose">
                          {product.image ? 'Cambiar imagen' : 'Agregar imagen'}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {view === 'home-images' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              onClick={() => setView('list')}
              className="mb-6 flex items-center gap-2 font-body text-sm text-text-secondary hover:text-accent-rose transition-colors"
            >
              <ChevronLeft size={16} />
              Volver al listado
            </button>

            <h2 className="font-display text-xl font-semibold text-text-primary mb-6">
              Imágenes del Home
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hero image */}
              <div className="bg-white rounded-2xl border border-border-custom p-6 shadow-sm">
                <h3 className="font-body font-semibold text-sm uppercase tracking-wider text-text-primary mb-4">
                  Imagen Principal (Hero)
                </h3>
                <div className="relative rounded-xl overflow-hidden bg-cream mb-4 aspect-[4/3]">
                  <img
                    src={heroImage}
                    alt="Hero preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => homeImageInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-accent-rose text-white rounded-pill font-body text-xs font-medium hover:bg-[#D88AAD] transition-colors"
                  >
                    <Upload size={14} />
                    Cambiar imagen
                  </button>
                  <input
                    ref={homeImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleSiteImageUpload(file, onUploadHeroImage, 'Hero');
                    }}
                    className="hidden"
                  />
                  <button
                    onClick={() => { onResetHeroImage(); addToast('Imagen restaurada', 'success'); }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border-custom rounded-pill font-body text-xs text-text-secondary hover:border-accent-rose/40 transition-colors"
                  >
                    <RotateCcw size={14} />
                    Restaurar original
                  </button>
                </div>
              </div>

              {/* About image */}
              <div className="bg-white rounded-2xl border border-border-custom p-6 shadow-sm">
                <h3 className="font-body font-semibold text-sm uppercase tracking-wider text-text-primary mb-4">
                  Imagen Nosotros (About)
                </h3>
                <div className="relative rounded-xl overflow-hidden bg-cream mb-4 aspect-[4/3]">
                  <img
                    src={aboutImage}
                    alt="About preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => aboutImageInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-accent-rose text-white rounded-pill font-body text-xs font-medium hover:bg-[#D88AAD] transition-colors"
                  >
                    <Upload size={14} />
                    Cambiar imagen
                  </button>
                  <input
                    ref={aboutImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleSiteImageUpload(file, onUploadAboutImage, 'Nosotros');
                    }}
                    className="hidden"
                  />
                  <button
                    onClick={() => { onResetAboutImage(); addToast('Imagen restaurada', 'success'); }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border-custom rounded-pill font-body text-xs text-text-secondary hover:border-accent-rose/40 transition-colors"
                  >
                    <RotateCcw size={14} />
                    Restaurar original
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'edit' && selectedProduct && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl mx-auto"
          >
            <button
              onClick={() => { setView('list'); setSelectedProduct(null); }}
              className="mb-6 flex items-center gap-2 font-body text-sm text-text-secondary hover:text-accent-rose transition-colors"
            >
              <ChevronLeft size={16} />
              Volver al listado
            </button>

            <div className="bg-white rounded-2xl border border-border-custom p-6 md:p-8 shadow-sm space-y-6">
              {/* Image Upload Area */}
              <div>
                <label className="font-body text-xs font-medium uppercase tracking-wider text-text-muted mb-3 block">
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
                        className="w-full max-h-64 object-contain rounded-lg mx-auto"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors rounded-lg flex items-center justify-center">
                        <Upload size={24} className="text-white opacity-0 hover:opacity-100 drop-shadow-lg" />
                      </div>
                    </div>
                  ) : (
                    <div className="py-6">
                      <Upload size={32} className="mx-auto text-text-muted mb-3" />
                      <p className="font-body text-sm text-text-secondary">
                        Arrastra una foto o haz clic para seleccionar
                      </p>
                      <p className="font-body text-xs text-text-muted mt-1">
                        JPG, PNG. Máx 2MB
                      </p>
                    </div>
                  )}
                </div>

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

              {/* Product info read-only */}
              <div className="space-y-4">
                <div>
                  <label className="font-body text-xs font-medium uppercase tracking-wider text-text-muted mb-2 block">
                    Nombre
                  </label>
                  <p className="font-body text-sm text-text-primary bg-cream rounded-lg px-4 py-2.5">
                    {selectedProduct.name}
                  </p>
                </div>
                <div>
                  <label className="font-body text-xs font-medium uppercase tracking-wider text-text-muted mb-2 block">
                    Categoría
                  </label>
                  <p className="font-body text-sm text-text-primary bg-cream rounded-lg px-4 py-2.5 capitalize">
                    {selectedProduct.category}
                  </p>
                </div>
                {selectedProduct.description && (
                  <div>
                    <label className="font-body text-xs font-medium uppercase tracking-wider text-text-muted mb-2 block">
                      Descripción
                    </label>
                    <p className="font-body text-sm text-text-secondary bg-cream rounded-lg px-4 py-2.5">
                      {selectedProduct.description}
                    </p>
                  </div>
                )}
                <div>
                  <label className="font-body text-xs font-medium uppercase tracking-wider text-text-muted mb-2 block">
                    Aromas
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
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 left-4 sm:left-auto space-y-2 pointer-events-none z-50">
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
    </div>
  );
}
