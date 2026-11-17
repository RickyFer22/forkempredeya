import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter, Store, Package, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Entrepreneur, Product } from '../types';
import { EntrepreneurCard } from '../components/EntrepreneurCard';
import { ProductCard } from '../components/ProductCard';
import { CategoryList } from '../components/CategoryList';

export const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'stores' | 'products'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [stores, setStores] = useState<Entrepreneur[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const q = query.trim();

      // Search stores
      let storeQuery = supabase
        .from('entrepreneurs')
        .select('*, category:categories(name)')
        .eq('status', 'approved')
        .eq('is_hidden', false);

      if (q) {
        storeQuery = storeQuery.ilike('business_name', `%${q}%`);
      }
      if (selectedCategory) {
        storeQuery = storeQuery.eq('category_id', selectedCategory);
      }

      const { data: storeData } = await storeQuery.limit(20);
      setStores((storeData as Entrepreneur[]) || []);

      // Search products
      let prodQuery = supabase
        .from('products')
        .select('*, entrepreneur:entrepreneurs(id, business_name, logo_url, phone_whatsapp)')
        .eq('is_available', true);

      if (q) {
        prodQuery = prodQuery.ilike('name', `%${q}%`);
      }
      if (selectedCategory) {
        prodQuery = prodQuery.eq('category_id', selectedCategory);
      }

      const { data: prodData } = await prodQuery.limit(20);
      setProducts((prodData as Product[]) || []);
    } catch (err) {
      console.error('Error during search:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearch();
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Search Input Box */}
      <div className="relative max-w-2xl mx-auto">
        <div className="flex items-center gap-3 p-2 pl-4 rounded-full bg-white border border-[#E5E7EB] shadow-sm focus-within:border-[#FF71C2] focus-within:ring-2 focus-within:ring-[#FF71C2]/20 transition-all">
          <SearchIcon size={20} className="text-[#FF71C2]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por negocio, producto o servicio..."
            className="flex-1 bg-transparent text-sm text-[#1A1A1A] outline-none placeholder:text-[#9CA3AF]"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 text-[#9CA3AF] hover:text-[#1A1A1A] rounded-full"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Categories Bar */}
      <CategoryList
        selectedCategoryId={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Tabs Filter */}
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'Todo' },
            { id: 'stores', label: `Emprendimientos (${stores.length})` },
            { id: 'products', label: `Productos (${products.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'bg-white text-[#6B7280] hover:bg-[#F6F7F8] border border-[#E5E7EB]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-[#9CA3AF] hidden sm:inline">
          {stores.length + products.length} resultados encontrados
        </span>
      </div>

      {/* Search Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-60 rounded-2xl bg-white border border-[#E5E7EB] animate-pulse" />
          ))}
        </div>
      ) : stores.length === 0 && products.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-[#E5E7EB] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FFCFED] text-[#E82985] flex items-center justify-center mx-auto">
            <SearchIcon size={24} />
          </div>
          <h3 className="font-urbanist font-bold text-base text-[#1A1A1A]">
            No encontramos resultados para tu búsqueda
          </h3>
          <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
            Probá buscando términos más generales o seleccionando otra categoría.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stores Section */}
          {(activeTab === 'all' || activeTab === 'stores') && stores.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Store size={18} className="text-[#FF71C2]" />
                <h2 className="font-urbanist font-bold text-lg text-[#1A1A1A]">
                  Emprendimientos
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stores.map((st) => (
                  <EntrepreneurCard key={st.id} entrepreneur={st} />
                ))}
              </div>
            </div>
          )}

          {/* Products Section */}
          {(activeTab === 'all' || activeTab === 'products') && products.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-[#7DB2FF]" />
                <h2 className="font-urbanist font-bold text-lg text-[#1A1A1A]">
                  Productos
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((pr) => (
                  <ProductCard key={pr.id} product={pr} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
