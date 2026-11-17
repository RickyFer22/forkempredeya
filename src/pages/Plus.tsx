import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const Plus: React.FC = () => {
  const features = [
    {
      title: 'Tu Propia Tienda Digital',
      desc: 'Perfil personalizado con tu logo, portada, descripción, redes y horarios de atención.',
      icon: '/assets/icon-store.png',
    },
    {
      title: 'Catálogo de Productos Ilimitado',
      desc: 'Subí fotos de tus productos, precios, categorías y disponibilidad sin límites.',
      icon: '/assets/icon-products.png',
    },
    {
      title: 'Panel de Control Exclusivo',
      desc: 'Administrá tus productos, pedidos y reseñas desde una plataforma simple y rápida.',
      icon: '/assets/icon-panel.png',
    },
    {
      title: 'Estadísticas e Informes',
      desc: 'Conocé cuántas personas visitaron tu tienda y qué productos son los más buscados.',
      icon: '/assets/icon-reports.png',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero section */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFCFED] text-[#E82985] text-xs font-bold uppercase tracking-wider">
          <Sparkles size={14} />
          <span>Para Emprendedores</span>
        </div>
        <h1 className="font-urbanist font-extrabold text-3xl sm:text-5xl text-[#1A1A1A] leading-tight">
          Llevá tu emprendimiento al <span className="text-[#FF71C2]">siguiente nivel</span>
        </h1>
        <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
          Unite a Emprende Ya Plus y obtené todas las herramientas digitales para vender más, sin intermediarios ni comisiones sobre tus ventas.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            to="/register?role=entrepreneur"
            className="px-8 py-3.5 rounded-full bg-[#FF71C2] hover:bg-[#E82985] text-white font-urbanist font-extrabold text-sm shadow-md transition-all hover:scale-105"
          >
            Registrar mi Emprendimiento
          </Link>
          <a
            href="https://wa.me/5491100000000?text=Hola!%20Quiero%20info%20sobre%20Emprende%20Ya%20Plus"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-full bg-white hover:bg-[#F6F7F8] border border-[#E5E7EB] text-[#1A1A1A] font-urbanist font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} className="text-emerald-500" />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Main mockup showcase */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#FFCFED]/40 to-[#CFEAFF]/40 border border-[#E5E7EB] p-8 sm:p-12 text-center overflow-hidden">
        <img
          src="/assets/store-mockup.png"
          alt="Mockup Tienda Emprende Ya"
          className="max-h-80 mx-auto object-contain drop-shadow-2xl"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/logo-icon.png';
          }}
        />
      </div>

      {/* Benefits Grid */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="font-urbanist font-extrabold text-2xl text-[#1A1A1A]">
            Todo lo que incluye Emprende Ya Plus
          </h2>
          <p className="text-xs text-[#6B7280] mt-1">
            Diseñado para que manejes tu negocio desde cualquier celular o computadora.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-xs flex items-start gap-4 hover:border-[#FF71C2] transition-colors"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#F6F7F8] p-2 flex items-center justify-center flex-shrink-0">
                <img src={f.icon} alt={f.title} className="w-full h-full object-contain" />
              </div>
              <div className="space-y-1">
                <h3 className="font-urbanist font-bold text-base text-[#1A1A1A]">
                  {f.title}
                </h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-md bg-white p-3">
          <img
            src="/assets/panel-dashboard.png"
            alt="Dashboard Emprende Ya"
            className="w-full h-auto object-contain rounded-xl"
          />
        </div>
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
            <ShieldCheck size={14} />
            <span>0% Comisiones por Venta</span>
          </div>
          <h3 className="font-urbanist font-extrabold text-2xl sm:text-3xl text-[#1A1A1A]">
            El dinero de tus ventas es 100% tuyo.
          </h3>
          <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
            A diferencia de otras plataformas que cobran entre un 15% y un 30% por venta, en Emprende Ya los clientes te pagan directo a vos por transferencia, efectivo o tu propio link de cobro.
          </p>
          <ul className="space-y-2 text-xs font-semibold text-[#1A1A1A]">
            <li className="flex items-center gap-2">
              <Check size={16} className="text-emerald-500" /> Cobrá al instante en tu cuenta
            </li>
            <li className="flex items-center gap-2">
              <Check size={16} className="text-emerald-500" /> Contacto directo por WhatsApp
            </li>
            <li className="flex items-center gap-2">
              <Check size={16} className="text-emerald-500" /> Posicionamiento en el mapa local
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-[#FF71C2] to-[#7DB2FF] rounded-3xl p-8 text-center text-white space-y-4 shadow-md">
        <h3 className="font-urbanist font-extrabold text-2xl sm:text-3xl">
          ¿Listo para empezar a vender?
        </h3>
        <p className="text-xs sm:text-sm text-white/90 max-w-lg mx-auto">
          Creá tu cuenta de emprendedor en menos de 2 minutos y empezá a recibir pedidos.
        </p>
        <Link
          to="/register?role=entrepreneur"
          className="inline-block px-8 py-3.5 rounded-full bg-white text-[#E82985] font-urbanist font-extrabold text-sm shadow-md hover:bg-[#FFCFED] transition-all hover:scale-105"
        >
          Crear Tienda Gratis
        </Link>
      </div>
    </div>
  );
};
