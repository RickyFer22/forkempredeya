import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, MessageCircle, ChevronRight, Clock, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Order, OrderStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';

const statusConfig: Record<OrderStatus, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pendiente', bg: 'bg-amber-100', text: 'text-amber-800' },
  confirmed: { label: 'Confirmado', bg: 'bg-blue-100', text: 'text-blue-800' },
  preparing: { label: 'En Preparación', bg: 'bg-purple-100', text: 'text-purple-800' },
  ready: { label: 'Listo', bg: 'bg-emerald-100', text: 'text-emerald-800' },
  delivered: { label: 'Entregado', bg: 'bg-zinc-100', text: 'text-zinc-800' },
  cancelled: { label: 'Cancelado', bg: 'bg-red-100', text: 'text-red-800' },
};

export const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, entrepreneur:entrepreneurs(business_name, phone_whatsapp, logo_url)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setOrders(data as Order[]);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-urbanist font-extrabold text-2xl text-[#1A1A1A]">
          Iniciá sesión para ver tus pedidos
        </h2>
        <Link
          to="/login"
          className="inline-block px-6 py-2.5 rounded-full bg-[#FF71C2] text-white text-xs font-bold"
        >
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Link
        to="/profile"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B7280] hover:text-[#FF71C2] transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Volver a Mi Perfil</span>
      </Link>

      <div>
        <h1 className="font-urbanist font-extrabold text-2xl text-[#1A1A1A]">
          Mis Pedidos ({orders.length})
        </h1>
        <p className="text-xs text-[#6B7280]">
          Historial de compras realizadas en emprendimientos de la app.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white rounded-3xl border border-[#E5E7EB] animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-[#E5E7EB] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#F6F7F8] text-[#9CA3AF] flex items-center justify-center mx-auto">
            <ShoppingBag size={24} />
          </div>
          <h3 className="font-urbanist font-bold text-base text-[#1A1A1A]">
            Aún no realizaste ningún pedido
          </h3>
          <p className="text-xs text-[#6B7280]">
            Cuando elijas productos y los envíes a un emprendedor, quedarán registrados aquí.
          </p>
          <Link
            to="/"
            className="inline-block px-5 py-2.5 rounded-full bg-[#FF71C2] text-white text-xs font-bold"
          >
            Explorar Tiendas
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = statusConfig[order.status] || statusConfig.pending;
            const itemsCount = order.items?.reduce((s, i) => s + (i.quantity || 1), 0) || 0;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-[#E5E7EB] p-5 shadow-xs space-y-4 hover:border-[#FF71C2] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FFCFED] text-[#E82985] font-bold text-sm flex items-center justify-center overflow-hidden">
                      {order.entrepreneur?.logo_url ? (
                        <img
                          src={order.entrepreneur.logo_url}
                          alt={order.entrepreneur.business_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        order.entrepreneur?.business_name?.charAt(0) || 'E'
                      )}
                    </div>
                    <div>
                      <h3 className="font-urbanist font-bold text-base text-[#1A1A1A]">
                        {order.entrepreneur?.business_name || 'Emprendedor'}
                      </h3>
                      <span className="text-[11px] text-[#9CA3AF]">
                        {new Date(order.created_at).toLocaleDateString('es-AR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.bg} ${statusInfo.text}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* Items preview */}
                <div className="p-3 rounded-2xl bg-[#F6F7F8] space-y-1 text-xs text-[#4B5563]">
                  {order.items?.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-semibold">${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <span className="text-[11px] text-[#9CA3AF] italic">
                      + {order.items.length - 3} producto(s) más
                    </span>
                  )}
                </div>

                {/* Footer total & contact */}
                <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB]">
                  <div>
                    <span className="text-[11px] text-[#9CA3AF]">Total del pedido:</span>
                    <p className="font-urbanist font-extrabold text-base text-[#1A1A1A]">
                      ${order.total.toLocaleString('es-AR')}
                    </p>
                  </div>

                  {order.entrepreneur?.phone_whatsapp && (
                    <a
                      href={`https://wa.me/${order.entrepreneur.phone_whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Hola! Te consulto sobre mi pedido de Emprende Ya (Total: $${order.total})`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white transition-colors text-xs font-bold"
                    >
                      <MessageCircle size={14} />
                      <span>Mensaje</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
