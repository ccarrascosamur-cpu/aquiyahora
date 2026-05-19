import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Categories } from '@/components/Categories';
import { ProductCatalog } from '@/components/ProductCatalog';
import { BrandPartners } from '@/components/BrandPartners';
import { CorporateGifts } from '@/components/CorporateGifts';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { ProductDetailPage } from '@/components/ProductDetailPage';
import { AdminPage } from '@/pages/AdminPage';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { useSiteImages } from '@/hooks/useSiteImages';
import type { Product } from '@/types/product';

interface HomePageProps {
  products: Product[];
  filteredProducts: Product[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isAdmin: boolean;
  heroImage: string;
  heroVideo: string | null;
  aboutImage: string;
  onViewProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
}

function HomePage({
  products,
  filteredProducts,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  isAdmin,
  heroImage,
  heroVideo,
  aboutImage,
  onViewProduct,
  onEditProduct,
}: HomePageProps) {
  const [catalogExpanded, setCatalogExpanded] = useState(false);

  const handleExpandCatalog = useCallback(() => {
    setCatalogExpanded(true);
  }, []);

  const handleSelectCategory = useCallback((category: string) => {
    setActiveCategory(category);
    setCatalogExpanded(true);
    setTimeout(() => {
      const el = document.querySelector('#catalogo');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [setActiveCategory]);

  return (
    <div className="min-h-screen bg-cream">
      <Navigation onSearchClick={() => {}} />

      <main>
        <Hero image={heroImage} videoUrl={heroVideo} />
        <About image={aboutImage} />
        <Categories 
          onSelectCategory={handleSelectCategory} 
          activeCategory={activeCategory}
        />
        <ProductCatalog
          products={products}
          filteredProducts={filteredProducts}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isAdmin={isAdmin}
          onEditProduct={onEditProduct}
          onViewProduct={onViewProduct}
          catalogExpanded={catalogExpanded}
          onExpandCatalog={handleExpandCatalog}
        />
        <BrandPartners />
        <CorporateGifts />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function App() {
  const {
    products,
    filteredProducts,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    uploadImage,
    deleteImage,
    updateProduct,
    addProduct,
    removeProduct,
  } = useProducts();

  const { isAuthenticated } = useAuth();
  const { getImage, uploadImage: uploadSiteImage, resetImage, setHeroVideo, getHeroVideo } = useSiteImages();
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleViewProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    navigate(`/?product=${product.id}`, { replace: true });
  }, [navigate]);

  const handleCloseProduct = useCallback(() => {
    setSelectedProduct(null);
    navigate('/', { replace: true });
  }, [navigate]);

  const handleEditProduct = useCallback((_product: Product) => {
    navigate('/admin');
  }, [navigate]);

  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              products={products}
              filteredProducts={filteredProducts}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isAdmin={isAuthenticated}
              heroImage={getImage('hero')}
              heroVideo={getHeroVideo()}
              aboutImage={getImage('about')}
              onViewProduct={handleViewProduct}
              onEditProduct={handleEditProduct}
            />
          } 
        />
        <Route 
          path="/admin" 
          element={
            <AdminPage 
              products={products} 
              onUploadImage={uploadImage} 
              onDeleteImage={deleteImage}
              onUpdateProduct={updateProduct}
              onAddProduct={addProduct}
              onRemoveProduct={removeProduct}
              heroImage={getImage('hero')}
              heroVideo={getHeroVideo()}
              aboutImage={getImage('about')}
              onUploadHeroImage={(data: string) => uploadSiteImage('hero', data)}
              onResetHeroImage={() => resetImage('hero')}
              onUploadAboutImage={(data: string) => uploadSiteImage('about', data)}
              onResetAboutImage={() => resetImage('about')}
              onSaveHeroVideo={setHeroVideo}
            />
          } 
        />
      </Routes>

      {selectedProduct && (
        <ProductDetailPage 
          product={selectedProduct} 
          onClose={handleCloseProduct} 
        />
      )}
    </>
  );
}

export default App;
