import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, MessageCircle, Store, Check, Plus, Minus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, entrepreneur:entrepreneurs(*)')
          .eq('id', id)
          .maybeSingle();

        if (!error && data) {
          setProduct(data as Product);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !product.entrepreneur) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product, product.entrepreneur);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4 animate-pulse">
        <div className="h-8 bg-zinc-200 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-80 bg-zinc-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-zinc-200 rounded w-3/4" />
            <div className="h-6 bg-zinc-200 rounded w-1/3" />
            <div className="h-24 bg-zinc-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-urbanist font-extrabold text-xl text-[#1A1A1A]">
          Producto no encontrado
        </h2>
        <Link
          to="/"
          className="inline-block px-5 py-2.5 rounded-full bg-[#FF71C2] text-white text-xs font-bold"
        >
          Volver al Inicio
        </Link>
      </div>
    );
  }

  const ent = product.entrepreneur;
  const directWhatsApp = ent?.phone_whatsapp
    ? `https://wa.me/${ent.phone_whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
        `¡Hola ${ent.business_name}! Estoy interesado en comprar: *${product.name}* ($${product.price.toLocaleString('es-AR')}). ¿Tenés disponibilidad?`
      )}`
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Back link */}
      {ent ? (
        <Link
          to={`/store/${ent.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B7280] hover:text-[#FF71C2] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Volver a {ent.business_name}</span>
        </Link>
      ) : (
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B7280] hover:text-[#FF71C2] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Volver al catálogo</span>
        </Link>
      )}

      {/* Main Product Card */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Photo */}
        <div className="relative h-80 sm:h-96 w-full rounded-2xl bg-[#F6F7F8] overflow-hidden flex items-center justify-center border border-[#E5E7EB]">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-[#9CA3AF] text-sm">Sin imagen</div>
          )}
        </div>

        {/* Info & Buy actions */}
        <div className="space-y-6">
          <div>
            {ent && (
              <Link
                to={`/store/${ent.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6F7F8] hover:bg-[#E5E7EB] text-xs font-bold text-[#6B7280] mb-2 transition-colors"
              >
                <Store size={14} className="text-[#FF71C2]" />
                <span>{ent.business_name}</span>
              </Link>
            )}

            <h1 className="font-urbanist font-extrabold text-2xl sm:text-3xl text-[#1A1A1A]">
              {product.name}
            </h1>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-urbanist font-extrabold text-3xl text-[#1A1A1A]">
                ${product.price.toLocaleString('es-AR')}
              </span>
              {product.is_available === false && (
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                  Sin Stock
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
                Descripción
              </h4>
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Quantity Selector & Add */}
          <div className="pt-4 border-t border-[#E5E7EB] space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-[#1A1A1A]">Cantidad:</span>
              <div className="flex items-center border border-[#E5E7EB] rounded-full p-1 bg-[#F6F7F8]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-[#FFCFED] shadow-xs"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 text-xs font-bold text-[#1A1A1A]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-[#FFCFED] shadow-xs"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.is_available === false}
                className={`flex-1 py-3 px-6 rounded-full font-urbanist font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all ${
                  added
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[#FF71C2] hover:bg-[#E82985] text-white hover:scale-102'
                }`}
              >
                {added ? (
                  <>
                    <Check size={18} />
                    <span>¡Agregado al carrito!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>Agregar al Carrito</span>
                  </>
                )}
              </button>

              {directWhatsApp && (
                <a
                  href={directWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-6 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-urbanist font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-102"
                >
                  <MessageCircle size={18} />
                  <span>Pedir directo</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
