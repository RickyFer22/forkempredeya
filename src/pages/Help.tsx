import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, MessageCircle, ShoppingBag, Store } from 'lucide-react';

export const Help: React.FC = () => {
  const faqs = [
    {
      q: '¿Cómo compro en Emprende Ya?',
      a: 'Podés navegar por los emprendimientos en el mapa o catálogo, agregar los productos que quieras al carrito y tocar "Enviar Pedido por WhatsApp". La app armará el pedido listo para que coordines el pago y la entrega directamente con el vendedor.',
    },
    {
      q: '¿Emprende Ya cobra comisiones por venta?',
      a: 'No. Emprende Ya es una plataforma de conexión directa. No cobra comisiones sobre las ventas ni retiene tu dinero.',
    },
    {
      q: '¿Cómo publico mi emprendimiento?',
      a: 'Podés registrarte como "Emprendedor", completar el perfil de tu negocio (nombre, logo, ubicación, WhatsApp) y cargar tus productos en el catálogo digital.',
    },
    {
      q: '¿Qué es Emprende Ya Plus?',
      a: 'Es la membresía especial para emprendedores que buscan potenciar su negocio con herramientas avanzadas: catálogo ilimitado, panel de pedidos, estadísticas y mayor visibilidad en el mapa.',
    },
    {
      q: '¿Cómo se realizan los pagos y envíos?',
      a: 'El pago y envío se acuerda directamente entre vos y el emprendedor a través del chat de WhatsApp (por transferencia bancaria, Mercado Pago, efectivo o envío a domicilio).',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/profile"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B7280] hover:text-[#FF71C2] transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Volver a Mi Perfil</span>
      </Link>

      <div className="space-y-2">
        <h1 className="font-urbanist font-extrabold text-3xl text-[#1A1A1A]">
          Centro de Ayuda y Preguntas Frecuentes
        </h1>
        <p className="text-xs text-[#6B7280]">
          Todo lo que necesitás saber para aprovechar Emprende Ya al máximo.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs space-y-2">
            <h3 className="font-urbanist font-bold text-base text-[#1A1A1A]">
              {faq.q}
            </h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      {/* Support Card */}
      <div className="bg-[#FFCFED]/40 rounded-3xl p-6 border border-[#FFCFED] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-urbanist font-bold text-base text-[#E82985]">
            ¿Tenés alguna otra duda o consulta?
          </h4>
          <p className="text-xs text-[#6B7280]">
            Nuestro equipo de soporte está disponible para ayudarte.
          </p>
        </div>
        <a
          href="https://wa.me/5491100000000?text=Hola,%20necesito%20ayuda%20con%20Emprende%20Ya"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-urbanist font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <MessageCircle size={16} />
          <span>Contactar Soporte</span>
        </a>
      </div>
    </div>
  );
};
