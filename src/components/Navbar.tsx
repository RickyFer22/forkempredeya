import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, MapPin, User as UserIcon, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useLocation } from '../contexts/LocationContext';

export const Navbar: React.FC = () => {
  const { user, profile } = useAuth();
  const { totalItems } = useCart();
  const { coords, requestCurrentLocation } = useLocation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img 
              src="/assets/logo-full.png" 
              alt="Emprende Ya" 
              className="h-10 w-auto object-contain"
              onError={(e) => {
                // Fallback to icon if full logo fails
                (e.target as HTMLImageElement).src = '/assets/logo-icon.png';
              }}
            />
          </Link>

          {/* Location pill */}
          <button
            onClick={requestCurrentLocation}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F6F7F8] hover:bg-[#E5E7EB] text-xs font-medium text-[#6B7280] transition-colors"
            title="Actualizar mi ubicación"
          >
            <MapPin size={14} className="text-[#FF71C2]" />
            <span>{coords ? 'Cerca de ti' : 'Ubicación'}</span>
          </button>

          {/* Quick Search Bar */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div 
              onClick={() => navigate('/search')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#F6F7F8] border border-[#E5E7EB] text-[#9CA3AF] text-sm cursor-pointer hover:border-[#FF71C2] transition-colors"
            >
              <Search size={16} className="text-[#9CA3AF]" />
              <span>Buscar emprendimientos o productos...</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/favorites"
              className="p-2 text-[#6B7280] hover:text-[#FF71C2] hover:bg-[#FFCFED]/30 rounded-full transition-colors hidden sm:flex"
              title="Favoritos"
            >
              <Heart size={20} />
            </Link>

            <Link
              to="/checkout"
              className="relative p-2 text-[#6B7280] hover:text-[#FF71C2] hover:bg-[#FFCFED]/30 rounded-full transition-colors"
              title="Carrito de compras"
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF71C2] text-white text-xs font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-[#E5E7EB] hover:border-[#FF71C2] transition-colors text-sm font-medium"
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#FFCFED] text-[#E82985] flex items-center justify-center font-bold text-xs">
                    {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                <span className="hidden md:inline text-xs font-semibold text-[#1A1A1A]">
                  {profile?.full_name?.split(' ')[0] || 'Mi Cuenta'}
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF71C2] hover:bg-[#E82985] text-white text-xs font-bold transition-all shadow-sm"
              >
                <UserIcon size={14} />
                <span>Ingresar</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
