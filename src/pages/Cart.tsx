import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, MessageCircle, ArrowLeft, Store, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export const Cart: React.FC = () => {
  const { items, currentEntrepreneur, updateQuantity, removeFromCart, clearCart, totalPrice, createWhatsAppLink } = useCart();
  const { user } = useAuth();
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!currentEntrepreneur) return;
    setSubmitting(true);

    try {
      // 1. Try to record in Supabase orders table if logged in
      if (user) {
        await supabase.from('orders').insert({
          user_id: user.id,
          entrepreneur_id: currentEntrepreneur.id,
          items: items.map((i) => ({
            product_id: i.product_id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          total: totalPrice,
          status: 'pending',
          whatsapp_sent: true,
          notes: notes.trim() || null,
        });
      }

      // 2. Open WhatsApp link
      const whatsappUrl = createWhatsAppLink(notes);
      if (whatsappUrl) {
        window.open(whatsappUrl, '_blank');
      }

      // 3. Clear cart and navigate
      clearCart();
      alert('¡Tu pedido ha sido generado con éxito! Te redirigimos a WhatsApp para coordinar con el emprendedor.');
      navigate('/');
    } catch (err) {
      console.error('Error during checkout:', err);
      // Still open WhatsApp as fallback
      const whatsappUrl = createWhatsAppLink(notes);
      if (whatsappUrl) window.open(whatsappUrl, '_blank');
      clearCart();
      navigate('/');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FFCFED] text-[#E82985] flex items-center justify-center mx-auto">
          <ShoppingBag size={28} />
        </div>
        <h2 className="font-urbanist font-extrabold text-2xl text-[#1A1A1A]">
          Tu carrito está vacío
        </h2>
        <p className="text-xs text-[#6B7280]">
          Explorá los emprendimientos locales y sumá productos para coordinar tu compra directa.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 rounded-full bg-[#FF71C2] hover:bg-[#E82985] text-white text-xs font-bold transition-all shadow-md"
        >
          Explorar Emprendimientos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B7280] hover:text-[#FF71C2] transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Seguir comprando</span>
      </Link>

      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Store header banner */}
        {currentEntrepreneur && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FFCFED]/30 border border-[#FFCFED]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FF71C2] text-white flex items-center justify-center font-bold text-sm overflow-hidden">
                {currentEntrepreneur.logo_url ? (
                  <img
                    src={currentEntrepreneur.logo_url}
                    alt={currentEntrepreneur.business_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  currentEntrepreneur.business_name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E82985]">
                  Pedido para
                </span>
                <h3 className="font-urbanist font-bold text-base text-[#1A1A1A]">
                  {currentEntrepreneur.business_name}
                </h3>
              </div>
            </div>

            <button
              onClick={clearCart}
              className="text-xs text-[#EF4444] hover:underline font-semibold"
            >
              Vaciar carrito
            </button>
          </div>
        )}

        {/* Item list */}
        <div className="divide-y divide-[#E5E7EB]">
          {items.map((item) => (
            <div key={item.product_id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#F6F7F8] border border-[#E5E7EB] overflow-hidden flex items-center justify-center text-xs">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingBag size={18} className="text-[#9CA3AF]" />
                  )}
                </div>
                <div>
                  <h4 className="font-urbanist font-bold text-sm text-[#1A1A1A] line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-xs text-[#6B7280]">
                    ${item.price.toLocaleString('es-AR')} c/u
                  </p>
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#E5E7EB] rounded-full p-1 bg-[#F6F7F8]">
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-[#FFCFED]"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="px-3 text-xs font-bold text-[#1A1A1A]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-[#FFCFED]"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <span className="font-urbanist font-bold text-sm text-[#1A1A1A] min-w-[70px] text-right">
                  ${(item.price * item.quantity).toLocaleString('es-AR')}
                </span>

                <button
                  onClick={() => removeFromCart(item.product_id)}
                  className="p-1.5 text-[#9CA3AF] hover:text-red-500 rounded-full"
                  title="Eliminar producto"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-[#1A1A1A]">
            Aclaraciones o notas para el emprendedor (opcional):
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej: Dirección de entrega, horario preferido, talle o variedad..."
            rows={2}
            className="w-full text-xs p-3 rounded-xl border border-[#E5E7EB] focus:border-[#FF71C2] outline-none"
          />
        </div>

        {/* Summary */}
        <div className="pt-4 border-t border-[#E5E7EB] space-y-3">
          <div className="flex justify-between items-center text-sm font-medium text-[#6B7280]">
            <span>Subtotal de productos:</span>
            <span>${totalPrice.toLocaleString('es-AR')}</span>
          </div>

          <div className="flex justify-between items-center text-xs text-[#9CA3AF]">
            <span>Envío / Entrega:</span>
            <span>A coordinar con el negocio</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-[#E5E7EB]">
            <span className="font-urbanist font-extrabold text-lg text-[#1A1A1A]">
              Total estimado:
            </span>
            <span className="font-urbanist font-extrabold text-2xl text-[#E82985]">
              ${totalPrice.toLocaleString('es-AR')}
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleCheckout}
          disabled={submitting}
          className="w-full py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-urbanist font-extrabold text-base shadow-md flex items-center justify-center gap-2 transition-all hover:scale-101 disabled:opacity-50"
        >
          <MessageCircle size={20} />
          <span>{submitting ? 'Generando pedido...' : 'Enviar Pedido por WhatsApp'}</span>
        </button>
      </div>
    </div>
  );
};
