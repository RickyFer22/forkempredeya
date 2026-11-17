import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Sparkles, Store, Users, MapPin } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B7280] hover:text-[#FF71C2] transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Volver al Inicio</span>
      </Link>

      <div className="text-center space-y-3">
        <img
          src="/assets/logo-full.png"
          alt="Emprende Ya"
          className="h-16 w-auto mx-auto object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/logo-icon.png';
          }}
        />
        <h1 className="font-urbanist font-extrabold text-3xl text-[#1A1A1A]">
          Nuestra Misión
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] max-w-xl mx-auto leading-relaxed">
          Conectar a personas con emprendedores de su comunidad para impulsar la economía local, el trabajo independiente y el comercio justo.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#FFCFED] text-[#E82985] flex items-center justify-center mx-auto">
            <Store size={22} />
          </div>
          <h3 className="font-urbanist font-bold text-base text-[#1A1A1A]">Comercio Local</h3>
          <p className="text-xs text-[#6B7280]">
            Fomentamos que el dinero circule en los barrios y ciudades, apoyando a familias y pequeños productores.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#CFEAFF] text-[#7DB2FF] flex items-center justify-center mx-auto">
            <Users size={22} />
          </div>
          <h3 className="font-urbanist font-bold text-base text-[#1A1A1A]">Trato Directo</h3>
          <p className="text-xs text-[#6B7280]">
            Sin comisiones abusivas ni intermediarios. El contacto es directo de persona a persona vía WhatsApp.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <MapPin size={22} />
          </div>
          <h3 className="font-urbanist font-bold text-base text-[#1A1A1A]">Cercanía</h3>
          <p className="text-xs text-[#6B7280]">
            Encontrá exactamente lo que buscás a pocas cuadras de tu hogar con geolocalización precisa.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 text-center space-y-3">
        <h3 className="font-urbanist font-bold text-lg text-[#1A1A1A]">
          Desarrollado por Caldén Labs
        </h3>
        <p className="text-xs text-[#6B7280] max-w-md mx-auto">
          Innovación y soluciones digitales para potenciar el ecosistema emprendedor.
        </p>
        <img
          src="/assets/developed-by-calden-labs.png"
          alt="Calden Labs"
          className="h-8 w-auto mx-auto object-contain mt-2 opacity-80"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    </div>
  );
};
