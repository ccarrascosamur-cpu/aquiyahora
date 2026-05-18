export type Category = 'velas' | 'aromatizantes' | 'difusores' | 'aceites' | 'sahumerios' | 'jabones' | 'sets' | 'papeleria';

export interface Product {
  id: string;
  name: string;
  category: Category;
  aromas: string[];
  image?: string;
  line?: string;
  description?: string;
}

export interface CategoryInfo {
  slug: Category;
  name: string;
  nameEn: string;
  icon: string;
  count: number;
  image: string;
  gradient: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: 'velas',
    name: 'Velas',
    nameEn: 'Candles',
    icon: 'Flame',
    count: 16,
    image: '/category-velas.jpg',
    gradient: 'from-rose-50 to-cream',
  },
  {
    slug: 'aromatizantes',
    name: 'Aromatizantes',
    nameEn: 'Aromatizers',
    icon: 'Droplets',
    count: 4,
    image: '/category-aromatizantes.jpg',
    gradient: 'from-purple-50 to-cream',
  },
  {
    slug: 'difusores',
    name: 'Difusores',
    nameEn: 'Diffusers',
    icon: 'Wind',
    count: 8,
    image: '/category-difusores.jpg',
    gradient: 'from-green-50 to-cream',
  },
  {
    slug: 'aceites',
    name: 'Aceites Aromáticos',
    nameEn: 'Essential Oils',
    icon: 'Sparkles',
    count: 4,
    image: '/category-aceites.jpg',
    gradient: 'from-orange-50 to-cream',
  },
  {
    slug: 'sahumerios',
    name: 'Sahumerios',
    nameEn: 'Incense',
    icon: 'Wand2',
    count: 4,
    image: '/category-sahumerios.jpg',
    gradient: 'from-rose-50/80 to-cream',
  },
  {
    slug: 'jabones',
    name: 'Jabones & Cuidado',
    nameEn: 'Body Care',
    icon: 'Heart',
    count: 6,
    image: '/category-jabones.jpg',
    gradient: 'from-purple-50/80 to-cream',
  },
  {
    slug: 'sets',
    name: 'Sets y Packs',
    nameEn: 'Gift Sets',
    icon: 'Gift',
    count: 6,
    image: '/category-sets.jpg',
    gradient: 'from-orange-50/80 to-cream',
  },
  {
    slug: 'papeleria',
    name: 'Papelería',
    nameEn: 'Stationery',
    icon: 'PenTool',
    count: 11,
    image: '/category-papeleria.jpg',
    gradient: 'from-pink-50/80 to-cream',
  },
];

export const CATEGORY_LABELS: Record<Category, string> = {
  velas: 'Velas',
  aromatizantes: 'Aromatizantes',
  difusores: 'Difusores',
  aceites: 'Aceites',
  sahumerios: 'Sahumerios',
  jabones: 'Jabones',
  sets: 'Sets',
  papeleria: 'Papelería',
};
