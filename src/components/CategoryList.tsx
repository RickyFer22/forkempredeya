import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Category } from '../types';
import { 
  ShoppingBag, 
  Utensils, 
  Sparkles, 
  Palette, 
  Cpu, 
  Home, 
  Scissors, 
  Gift, 
  Car, 
  Tag 
} from 'lucide-react';

interface CategoryListProps {
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
}

const defaultIcons: Record<string, React.ReactNode> = {
  gastronomia: <Utensils size={18} />,
  indumentaria: <ShoppingBag size={18} />,
  belleza: <Sparkles size={18} />,
  artesanias: <Palette size={18} />,
  tecnologia: <Cpu size={18} />,
  hogar: <Home size={18} />,
  servicios: <Scissors size={18} />,
  regalos: <Gift size={18} />,
  vehiculos: <Car size={18} />,
};

export const CategoryList: React.FC<CategoryListProps> = ({
  selectedCategoryId,
  onSelectCategory,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, slug')
          .order('name');

        if (!error && data && data.length > 0) {
          setCategories(data as Category[]);
        } else {
          // Standard defaults observed in Emprende Ya
          setCategories([
            { id: '1', name: 'Gastronomía', slug: 'gastronomia' },
            { id: '2', name: 'Indumentaria', slug: 'indumentaria' },
            { id: '3', name: 'Belleza y Cuidado', slug: 'belleza' },
            { id: '4', name: 'Artesanías y Deco', slug: 'artesanias' },
            { id: '5', name: 'Tecnología', slug: 'tecnologia' },
            { id: '6', name: 'Hogar y Limpieza', slug: 'hogar' },
            { id: '7', name: 'Servicios', slug: 'servicios' },
          ]);
        }
      } catch {
        setCategories([
          { id: '1', name: 'Gastronomía', slug: 'gastronomia' },
          { id: '2', name: 'Indumentaria', slug: 'indumentaria' },
          { id: '3', name: 'Belleza y Cuidado', slug: 'belleza' },
          { id: '4', name: 'Artesanías y Deco', slug: 'artesanias' },
        ]);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="py-2">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => onSelectCategory(null)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
            selectedCategoryId === null
              ? 'bg-[#FF71C2] text-white border-[#FF71C2] shadow-sm'
              : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#FF71C2]'
          }`}
        >
          <Tag size={16} />
          <span>Todos</span>
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const slugKey = cat.slug || cat.name.toLowerCase();
          const icon = defaultIcons[slugKey] || <ShoppingBag size={16} />;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-[#FF71C2] text-white border-[#FF71C2] shadow-sm'
                  : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#FF71C2]'
              }`}
            >
              <span>{icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
