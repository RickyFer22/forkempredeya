import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { BannerCarousel } from '../components/BannerCarousel';
import { CategoryList } from '../components/CategoryList';
import { EntrepreneurCard } from '../components/EntrepreneurCard';
import { ProductCard } from '../components/ProductCard';
import { supabase } from '../lib/supabase';
import { Entrepreneur, Product } from '../types';
import { useLocation } from '../contexts/LocationContext';

export const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { coords, calculateDistance } = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch approved entrepreneurs
        let query = supabase
          .from('entrepreneurs')
          .select('*, category:categories(name)')
          .eq('status', 'approved')
          .eq('is_hidden', false);

        if (selectedCategory) {
          query = query.eq('category_id', selectedCategory);
        }

        const { data: entData } = await query.limit(20);

        if (entData) {
          // Sort by distance if coordinates available
          let sorted = [...(entData as Entrepreneur[])];
          if (coords) {
            sorted.sort((a, b) => {
              const distA = a.latitude && a.longitude ? calculateDistance(a.latitude, a.longitude) ?? 9999 : 9999;
              const distB = b.latitude && b.longitude ? calculateDistance(b.latitude, b.longitude) ?? 9999 : 9999;
              return distA - distB;
            });
          }
          setEntrepreneurs(sorted);
        }

        // Fetch recent products
        const { data: prodData } = await supabase
          .from('products')
          .select('*, entrepreneur:entrepreneurs(id, business_name, logo_url, phone_whatsapp)')
          .eq('is_available', true)
          .limit(8);

        if (prodData) {
          setFeaturedProducts(prodData as Product[]);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, coords]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Category selector */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-urbanist font-bold text-lg text-[#1A1A1A]">
            Categorías
          </h2>
          <Link to="/search" className="text-xs font-semibold text-[#FF71C2] hover:text-[#E82985] flex items-center gap-1">
            <span>Ver mapa</span>
            <ArrowRight size={13} />
          </Link>
        </div>
        <CategoryList
          selectedCategoryId={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </section>

      {/* Featured / Nearby Entrepreneurs */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-urbanist font-extrabold text-xl text-[#1A1A1A]">
              Emprendimientos Destacados
            </h2>
            {coords && (
              <span className="text-xs font-medium text-[#6B7280] hidden sm:inline flex items-center gap-0.5">
                <MapPin size={12} className="text-[#FF71C2]" /> Cerca de tu ubicación
              </span>
            )}
          </div>
          <Link
            to="/search"
            className="text-xs font-semibold text-[#FF71C2] hover:text-[#E82985] flex items-center gap-1"
          >
            <span>Ver todos</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-white border border-[#E5E7EB] animate-pulse p-4 space-y-4">
                <div className="h-32 bg-[#F6F7F8] rounded-xl" />
                <div className="h-4 bg-[#F6F7F8] rounded w-3/4" />
                <div className="h-3 bg-[#F6F7F8] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : entrepreneurs.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] text-center space-y-2">
            <p className="text-sm text-[#6B7280] font-medium">
              No encontramos emprendimientos para la categoría seleccionada.
            </p>
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-bold text-[#FF71C2] hover:underline"
            >
              Ver todas las categorías
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {entrepreneurs.map((ent) => (
              <EntrepreneurCard key={ent.id} entrepreneur={ent} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-urbanist font-extrabold text-xl text-[#1A1A1A]">
              Productos Populares
            </h2>
            <Link
              to="/search"
              className="text-xs font-semibold text-[#FF71C2] hover:text-[#E82985] flex items-center gap-1"
            >
              <span>Explorar catálogo</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* Emprende Ya Plus Promotional Banner */}
      <section className="bg-gradient-to-r from-[#FF71C2] via-[#E82985] to-[#7DB2FF] rounded-3xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl space-y-3 z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Emprende Ya Plus</span>
          </div>
          <h3 className="font-urbanist font-extrabold text-2xl sm:text-3xl leading-tight">
            ¿Tenés un emprendimiento? Potenciá tus ventas hoy mismo.
          </h3>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
            Publicá tu catálogo ilimitado, gestioná pedidos en tiempo real, recibí pagos directos y conectá con miles de clientes en tu zona.
          </p>
          <div className="pt-2">
            <Link
              to="/plus"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#E82985] font-urbanist font-extrabold text-sm shadow-md hover:bg-[#FFCFED] transition-all hover:scale-105"
            >
              <span>Conocé los Planes Plus</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="w-full md:w-auto flex justify-center z-10">
          <img
            src="/assets/store-mockup.png"
            alt="Emprende Ya Tienda"
            className="max-h-56 object-contain drop-shadow-xl"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/logo-icon.png';
            }}
          />
        </div>
      </section>
    </div>
  );
};
