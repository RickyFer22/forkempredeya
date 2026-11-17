import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Store, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { EntrepreneurCard } from '../components/EntrepreneurCard';
import { useAuth } from '../contexts/AuthContext';
import { Favorite, Entrepreneur } from '../types';

export const Favorites: React.FC = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Entrepreneur[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select(`
            id,
            entrepreneur:entrepreneurs(
              id,
              business_name,
              cover_image_url,
              logo_url,
              average_rating,
              total_reviews,
              is_open,
              phone_whatsapp,
              category:categories(name)
            )
          `)
          .eq('user_id', user.id);

        if (!error && data) {
          const list = data
            .map((f: any) => f.entrepreneur)
            .filter(Boolean) as Entrepreneur[];
          setFavorites(list);
        }
      } catch (err) {
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-[#FFCFED] text-[#FF71C2] flex items-center justify-center mx-auto">
          <Heart size={28} />
        </div>
        <h2 className="font-urbanist font-extrabold text-2xl text-[#1A1A1A]">
          Guardá tus favoritos
        </h2>
        <p className="text-xs text-[#6B7280]">
          Iniciá sesión para guardar los emprendimientos que más te gustan y encontrarlos fácilmente.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-2.5 rounded-full bg-[#FF71C2] hover:bg-[#E82985] text-white text-xs font-bold transition-all shadow-md"
        >
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-urbanist font-extrabold text-2xl text-[#1A1A1A]">
            Tus Favoritos ({favorites.length})
          </h1>
          <p className="text-xs text-[#6B7280]">
            Emprendimientos guardados para contactar cuando quieras.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-60 rounded-2xl bg-white border border-[#E5E7EB] animate-pulse" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-[#E5E7EB] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#F6F7F8] text-[#9CA3AF] flex items-center justify-center mx-auto">
            <Heart size={24} />
          </div>
          <h3 className="font-urbanist font-bold text-base text-[#1A1A1A]">
            Aún no guardaste emprendimientos
          </h3>
          <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
            Tocá el ícono de corazón en cualquier negocio para guardarlo en esta lista.
          </p>
          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF71C2] hover:underline"
          >
            <span>Explorar emprendimientos</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {favorites.map((ent) => (
            <EntrepreneurCard key={ent.id} entrepreneur={ent} />
          ))}
        </div>
      )}
    </div>
  );
};
