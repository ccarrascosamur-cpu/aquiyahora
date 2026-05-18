import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface SiteImages {
  hero: string | null;
  about: string | null;
}

const STORAGE_KEY = 'site_images';

const DEFAULT_IMAGES: SiteImages = {
  hero: '/hero-lifestyle.jpg',
  about: '/about-showcase.jpg',
};

export function useSiteImages() {
  const [images, setImages] = useLocalStorage<SiteImages>(STORAGE_KEY, DEFAULT_IMAGES);

  const uploadImage = useCallback((key: keyof SiteImages, imageData: string) => {
    setImages(prev => ({ ...prev, [key]: imageData }));
  }, [setImages]);

  const deleteImage = useCallback((key: keyof SiteImages) => {
    setImages(prev => ({ ...prev, [key]: null }));
  }, [setImages]);

  const resetImage = useCallback((key: keyof SiteImages) => {
    setImages(prev => ({ ...prev, [key]: DEFAULT_IMAGES[key] }));
  }, [setImages]);

  const getImage = useCallback((key: keyof SiteImages): string => {
    return images[key] || DEFAULT_IMAGES[key] || '';
  }, [images]);

  return {
    images,
    uploadImage,
    deleteImage,
    resetImage,
    getImage,
  };
}
