import { useState, useCallback } from 'react';
import type { Product } from '@/types/product';
import { PRODUCTS } from '@/data/products';
import { useLocalStorage } from './useLocalStorage';

const IMAGES_KEY = 'product_images';
const PRODUCTS_KEY = 'custom_products';

export function useProducts() {
  const [customProducts, setCustomProducts] = useLocalStorage<Product[]>(PRODUCTS_KEY, []);
  const [images, setImages] = useLocalStorage<Record<string, string>>(IMAGES_KEY, {});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('todos');

  // Merge: start with base products, then override with custom ones by id
  const customById = new Map(customProducts.map(p => [p.id, p]));
  const products = PRODUCTS.map(p => {
    const custom = customById.get(p.id);
    const merged = custom ? { ...p, ...custom } : p;
    return { ...merged, image: images[p.id] || merged.image };
  }).concat(
    // Add custom products that don't exist in base
    customProducts.filter(p => !PRODUCTS.some(bp => bp.id === p.id))
      .map(p => ({ ...p, image: images[p.id] || p.image }))
  );

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'todos' || p.category === activeCategory;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.aromas.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const uploadImage = useCallback((productId: string, imageData: string) => {
    setImages(prev => ({ ...prev, [productId]: imageData }));
  }, [setImages]);

  const deleteImage = useCallback((productId: string) => {
    setImages(prev => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }, [setImages]);

  const updateProduct = useCallback((productId: string, updates: Partial<Product>) => {
    // Check if it's a base product or custom product
    const isBaseProduct = PRODUCTS.some(p => p.id === productId);
    if (isBaseProduct) {
      // For base products, store overrides in customProducts
      setCustomProducts(prev => {
        const existing = prev.find(p => p.id === productId);
        if (existing) {
          return prev.map(p => p.id === productId ? { ...p, ...updates } : p);
        }
        const base = PRODUCTS.find(p => p.id === productId)!;
        return [...prev, { ...base, ...updates }];
      });
    } else {
      setCustomProducts(prev =>
        prev.map(p => p.id === productId ? { ...p, ...updates } : p)
      );
    }
  }, [setCustomProducts]);

  const addProduct = useCallback((product: Product) => {
    setCustomProducts(prev => [...prev, product]);
  }, [setCustomProducts]);

  const removeProduct = useCallback((productId: string) => {
    // Only allow removing custom products
    setCustomProducts(prev => prev.filter(p => p.id !== productId));
    // Also clean up image if exists
    setImages(prev => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }, [setCustomProducts, setImages]);

  return {
    products,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    uploadImage,
    deleteImage,
    updateProduct,
    addProduct,
    removeProduct,
  };
}
