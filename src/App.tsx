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

function HomePage({
  products,
  filteredProducts,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  isAdmin,
}: {
  products: ReturnType<typeof useProducts>['products'];
  filteredProducts: ReturnType<typeof useProducts>['filteredProducts'];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isAdmin: boolean;
}) {
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
        <Hero />
        <About />
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
          />
        } 
      />
    </Routes>
  );
}

export default App;
