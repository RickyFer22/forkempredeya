import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Phone, 
  Instagram, 
  Facebook, 
  MessageCircle, 
  Clock, 
  Heart, 
  Share2, 
  Store as StoreIcon,
  ArrowLeft
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Entrepreneur, Product, Review } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ReviewList } from '../components/ReviewList';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';

export const StoreDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [entrepreneur, setEntrepreneur] = useState<Entrepreneur | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'reviews'>('products');
  const { user } = useAuth();
  const { calculateDistance, formatDistance } = useLocation();

  const fetchStoreData = async () => {
    if (!id) return;
    try {
      // 1. Fetch store info
      const { data: entData } = await supabase
        .from('entrepreneurs')
        .select('*, category:categories(name)')
        .eq('id', id)
        .maybeSingle();

      if (entData) {
        setEntrepreneur(entData as Entrepreneur);
      }

      // 2. Fetch products
      const { data: prodData } = await supabase
        .from('products')
        .select('*')
        .eq('entrepreneur_id', id)
        .eq('is_available', true);

      if (prodData) {
        setProducts(prodData as Product[]);
      }

      // 3. Fetch reviews with reviewer profile
      const { data: revData } = await supabase
        .from('reviews')
        .select('*, reviewer:profiles!reviewer_id(full_name, avatar_url)')
        .eq('entrepreneur_id', id)
        .order('created_at', { ascending: false });

      if (revData) {
        setReviews(revData as Review[]);
      }

      // 4. Check if favorite
      if (user) {
        const { data: favData } = await supabase
          .from('favorites')
          .select('id')
          .eq('entrepreneur_id', id)
          .eq('user_id', user.id)
          .maybeSingle();

        setIsFavorite(!!favData);
      }
    } catch (err) {
      console.error('Error fetching store data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user) {
      alert('Debes iniciar sesión para guardar favoritos');
      return;
    }
    if (!id) return;

    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('entrepreneur_id', id)
          .eq('user_id', user.id);
        setIsFavorite(false);
      } else {
        await supabase
          .from('favorites')
          .insert({ entrepreneur_id: id, user_id: user.id });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: entrepreneur?.business_name,
        text: `¡Mirá este emprendimiento en Emprende Ya!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-pulse">
        <div className="h-48 bg-zinc-200 rounded-3xl" />
        <div className="h-10 bg-zinc-200 rounded w-1/3" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 bg-zinc-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!entrepreneur) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-urbanist font-extrabold text-xl text-[#1A1A1A]">
          Emprendimiento no encontrado
        </h2>
        <p className="text-xs text-[#6B7280]">
          El negocio que buscás no existe o fue dado de baja.
        </p>
        <Link
          to="/"
          className="inline-block px-5 py-2.5 rounded-full bg-[#FF71C2] text-white text-xs font-bold"
        >
          Volver al Inicio
        </Link>
      </div>
    );
  }

  const distance =
    entrepreneur.latitude && entrepreneur.longitude
      ? calculateDistance(entrepreneur.latitude, entrepreneur.longitude)
      : null;

  const whatsappHref = entrepreneur.phone_whatsapp
    ? `https://wa.me/${entrepreneur.phone_whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
        entrepreneur.whatsapp_message || `¡Hola ${entrepreneur.business_name}! Te encontré en Emprende Ya y quiero hacer una consulta.`
      )}`
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B7280] hover:text-[#FF71C2] transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Volver a la búsqueda</span>
      </Link>

      {/* Header Profile Hero */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        {/* Cover */}
        <div className="relative h-48 sm:h-64 w-full bg-gradient-to-tr from-[#FFCFED] to-[#CFEAFF]">
          {entrepreneur.cover_image_url ? (
            <img
              src={entrepreneur.cover_image_url}
              alt={entrepreneur.business_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-30">
              <StoreIcon size={64} className="text-[#E82985]" />
            </div>
          )}

          {/* Action buttons (top right) */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-[#1A1A1A] flex items-center justify-center shadow-md transition-all"
              title="Compartir"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={toggleFavorite}
              className={`w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center shadow-md transition-all ${
                isFavorite
                  ? 'bg-[#FF71C2] text-white'
                  : 'bg-white/90 hover:bg-white text-[#1A1A1A]'
              }`}
              title="Guardar en favoritos"
            >
              <Heart size={16} className={isFavorite ? 'fill-white' : ''} />
            </button>
          </div>

          {/* Logo circle */}
          <div className="absolute -bottom-7 left-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center">
            {entrepreneur.logo_url ? (
              <img
                src={entrepreneur.logo_url}
                alt={entrepreneur.business_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#FF71C2] text-white flex items-center justify-center font-bold text-2xl">
                {entrepreneur.business_name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Info & Stats */}
        <div className="pt-10 p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-urbanist font-extrabold text-2xl sm:text-3xl text-[#1A1A1A]">
                  {entrepreneur.business_name}
                </h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    entrepreneur.is_open ?? true
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {entrepreneur.is_open ?? true ? 'Abierto' : 'Cerrado'}
                </span>
              </div>

              {/* Category & Rating */}
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-[#6B7280]">
                {entrepreneur.category?.name && (
                  <span className="font-semibold text-[#FF71C2] bg-[#FFCFED]/40 px-2.5 py-0.5 rounded-full">
                    {entrepreneur.category.name}
                  </span>
                )}
                <div className="flex items-center gap-1 font-bold text-[#1A1A1A]">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span>{entrepreneur.average_rating ? entrepreneur.average_rating.toFixed(1) : 'Nuevo'}</span>
                  {entrepreneur.total_reviews ? (
                    <span className="text-[#9CA3AF] font-normal">({entrepreneur.total_reviews} reseñas)</span>
                  ) : null}
                </div>
                {distance !== null && (
                  <div className="flex items-center gap-1">
                    <MapPin size={13} className="text-[#FF71C2]" />
                    <span>A {formatDistance(distance)} de vos</span>
                  </div>
                )}
              </div>
            </div>

            {/* Direct WhatsApp CTA */}
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-urbanist font-bold text-sm shadow-md transition-all hover:scale-105"
              >
                <MessageCircle size={18} />
                <span>Hablar por WhatsApp</span>
              </a>
            )}
          </div>

          {/* Description */}
          {entrepreneur.description && (
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed max-w-2xl">
              {entrepreneur.description}
            </p>
          )}

          {/* Contact Details & Socials */}
          <div className="pt-3 border-t border-[#E5E7EB] flex flex-wrap items-center gap-4 text-xs text-[#6B7280]">
            {entrepreneur.address && (
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-[#9CA3AF]" />
                <span>{entrepreneur.address}</span>
              </div>
            )}
            {entrepreneur.phone_whatsapp && (
              <div className="flex items-center gap-1.5">
                <Phone size={14} className="text-[#9CA3AF]" />
                <span>{entrepreneur.phone_whatsapp}</span>
              </div>
            )}
            {entrepreneur.instagram && (
              <a
                href={`https://instagram.com/${entrepreneur.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-[#FF71C2]"
              >
                <Instagram size={14} />
                <span>@{entrepreneur.instagram.replace('@', '')}</span>
              </a>
            )}
            {entrepreneur.facebook && (
              <a
                href={entrepreneur.facebook.startsWith('http') ? entrepreneur.facebook : `https://facebook.com/${entrepreneur.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-[#7DB2FF]"
              >
                <Facebook size={14} />
                <span>Facebook</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E7EB] gap-6 text-sm font-urbanist font-bold">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'products'
              ? 'border-[#FF71C2] text-[#FF71C2]'
              : 'border-transparent text-[#6B7280] hover:text-[#1A1A1A]'
          }`}
        >
          Catálogo de Productos ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'reviews'
              ? 'border-[#FF71C2] text-[#FF71C2]'
              : 'border-transparent text-[#6B7280] hover:text-[#1A1A1A]'
          }`}
        >
          Reseñas y Calificaciones ({reviews.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'products' ? (
        products.length === 0 ? (
          <div className="p-12 bg-white rounded-2xl border border-[#E5E7EB] text-center text-xs text-[#6B7280]">
            Este emprendedor aún no ha cargado productos en su catálogo digital. Contactalo por WhatsApp para conocer sus novedades.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} entrepreneur={entrepreneur} />
            ))}
          </div>
        )
      ) : (
        <ReviewList
          entrepreneurId={entrepreneur.id}
          reviews={reviews}
          onReviewAdded={fetchStoreData}
        />
      )}
    </div>
  );
};
