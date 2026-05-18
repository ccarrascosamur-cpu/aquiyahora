import { useState, useCallback } from 'react';
import type { Product } from '@/types/product';
import { PRODUCTS } from '@/data/products';
import { useLocalStorage } from './useLocalStorage';

const IMAGES_KEY = 'product_images';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [images, setImages] = useLocalStorage<Record<string, string>>(IMAGES_KEY, {});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('todos');

  // Merge images into products
  const productsWithImages = products.map(p => ({
    ...p,
    image: images[p.id] || p.image,
  }));

  // Filter products
  const filteredProducts = productsWithImages.filter(p => {
    const matchesCategory = activeCategory === 'todos' || p.category === activeCategory;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.aromas.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const uploadImage = useCallback((productId: string, imageData: string) => {
    setImages(prev => ({ ...prev, [productId]: imageData }));
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, image: imageData } : p
    ));
  }, [setImages]);

  const deleteImage = useCallback((productId: string) => {
    setImages(prev => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, image: undefined } : p
    ));
  }, [setImages]);

  return {
    products: productsWithImages,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    uploadImage,
    deleteImage,
  };
}
