import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E5E7EB] mt-16 pb-20 sm:pb-8 text-xs text-[#6B7280]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/logo-full.png"
              alt="Emprende Ya"
              className="h-8 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/logo-icon.png';
              }}
            />
            <span className="text-[11px] text-[#9CA3AF]">
              Versión Web 1.1.26
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs font-medium">
            <Link to="/about" className="hover:text-[#FF71C2] transition-colors">
              Acerca de
            </Link>
            <Link to="/help" className="hover:text-[#FF71C2] transition-colors">
              Ayuda y FAQ
            </Link>
            <Link to="/plus" className="hover:text-[#FF71C2] transition-colors font-semibold text-[#FF71C2]">
              Emprende Ya Plus
            </Link>
            <Link to="/terms" className="hover:text-[#FF71C2] transition-colors">
              Términos y Condiciones
            </Link>
            <Link to="/privacy" className="hover:text-[#FF71C2] transition-colors">
              Privacidad
            </Link>
          </div>
        </div>

        <div className="border-t border-[#E5E7EB] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#9CA3AF]">
          <p>
            &copy; {new Date().getFullYear()} Emprende Ya. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-2">
            <img 
              src="/assets/developed-by-calden-labs.png" 
              alt="Developed by Calden Labs" 
              className="h-5 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="flex items-center gap-1">
              Desarrollado con <Heart size={12} className="text-[#FF71C2] fill-[#FF71C2]" /> para emprendedores.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
