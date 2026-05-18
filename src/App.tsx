import { Routes, Route } from 'react-router-dom';
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
  aboutImage: string;
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
  aboutImage,
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
        <Hero image={heroImage} />
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
          onEditProduct={() => {}}
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
  } = useProducts();

  const { isAuthenticated } = useAuth();
  const { getImage, uploadImage: uploadSiteImage, resetImage } = useSiteImages();

  return (
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
            aboutImage={getImage('about')}
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
            heroImage={getImage('hero')}
            aboutImage={getImage('about')}
            onUploadHeroImage={(data: string) => uploadSiteImage('hero', data)}
            onResetHeroImage={() => resetImage('hero')}
            onUploadAboutImage={(data: string) => uploadSiteImage('about', data)}
            onResetAboutImage={() => resetImage('about')}
          />
        } 
      />
    </Routes>
  );
}

export default App;
