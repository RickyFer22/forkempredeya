import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  HelpCircle, 
  FileText, 
  Shield, 
  LogOut, 
  Store,
  ChevronRight,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Profile: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FFCFED] text-[#E82985] flex items-center justify-center mx-auto">
          <UserIcon size={32} />
        </div>
        <h2 className="font-urbanist font-extrabold text-2xl text-[#1A1A1A]">
          Mi Perfil
        </h2>
        <p className="text-xs text-[#6B7280]">
          Iniciá sesión para acceder a tu historial de compras, tus favoritos y la configuración de tu cuenta.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            to="/login"
            className="px-6 py-2.5 rounded-full bg-[#FF71C2] hover:bg-[#E82985] text-white text-xs font-bold transition-all shadow-md"
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="px-6 py-2.5 rounded-full bg-white border border-[#E5E7EB] text-[#1A1A1A] text-xs font-bold transition-all"
          >
            Crear Cuenta
          </Link>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isEntrepreneur = profile?.role === 'entrepreneur';

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs flex items-center gap-4">
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.full_name}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#FF71C2]"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-[#FFCFED] text-[#E82985] flex items-center justify-center font-bold text-xl border-2 border-[#FF71C2]">
            {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}

        <div className="flex-1">
          <h2 className="font-urbanist font-extrabold text-xl text-[#1A1A1A]">
            {profile?.full_name || 'Usuario'}
          </h2>
          <p className="text-xs text-[#6B7280]">{user.email}</p>
          <div className="mt-1.5">
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isEntrepreneur
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {isEntrepreneur ? 'Cuenta Emprendedor' : 'Cuenta Cliente'}
            </span>
          </div>
        </div>
      </div>

      {/* Menu options */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] divide-y divide-[#E5E7EB] shadow-xs overflow-hidden">
        {/* Orders */}
        <Link
          to="/orders"
          className="p-4 flex items-center justify-between hover:bg-[#F6F7F8] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FFCFED]/60 text-[#E82985] flex items-center justify-center">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h4 className="font-urbanist font-bold text-sm text-[#1A1A1A]">Mis Pedidos</h4>
              <p className="text-[11px] text-[#6B7280]">Historial de compras y estados</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-[#9CA3AF]" />
        </Link>

        {/* Favorites */}
        <Link
          to="/favorites"
          className="p-4 flex items-center justify-between hover:bg-[#F6F7F8] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
              <Heart size={18} />
            </div>
            <div>
              <h4 className="font-urbanist font-bold text-sm text-[#1A1A1A]">Mis Favoritos</h4>
              <p className="text-[11px] text-[#6B7280]">Emprendimientos que guardaste</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-[#9CA3AF]" />
        </Link>

        {/* Emprende Ya Plus */}
        <Link
          to="/plus"
          className="p-4 flex items-center justify-between hover:bg-[#F6F7F8] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#CFEAFF] text-[#7DB2FF] flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="font-urbanist font-bold text-sm text-[#1A1A1A]">Emprende Ya Plus</h4>
              <p className="text-[11px] text-[#6B7280]">Planes y beneficios para negocios</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-[#9CA3AF]" />
        </Link>

        {/* Help */}
        <Link
          to="/help"
          className="p-4 flex items-center justify-between hover:bg-[#F6F7F8] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center">
              <HelpCircle size={18} />
            </div>
            <div>
              <h4 className="font-urbanist font-bold text-sm text-[#1A1A1A]">Ayuda y Preguntas Frecuentes</h4>
              <p className="text-[11px] text-[#6B7280]">Guías para comprar y vender</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-[#9CA3AF]" />
        </Link>

        {/* Terms */}
        <Link
          to="/terms"
          className="p-4 flex items-center justify-between hover:bg-[#F6F7F8] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center">
              <FileText size={18} />
            </div>
            <div>
              <h4 className="font-urbanist font-bold text-sm text-[#1A1A1A]">Términos y Condiciones</h4>
              <p className="text-[11px] text-[#6B7280]">Políticas de uso de la plataforma</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-[#9CA3AF]" />
        </Link>

        {/* Privacy */}
        <Link
          to="/privacy"
          className="p-4 flex items-center justify-between hover:bg-[#F6F7F8] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center">
              <Shield size={18} />
            </div>
            <div>
              <h4 className="font-urbanist font-bold text-sm text-[#1A1A1A]">Privacidad</h4>
              <p className="text-[11px] text-[#6B7280]">Protección de tus datos personales</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-[#9CA3AF]" />
        </Link>

        {/* Logout */}
        <button
          onClick={handleSignOut}
          className="w-full p-4 flex items-center justify-between hover:bg-red-50 text-red-600 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <LogOut size={18} />
            </div>
            <div className="text-left">
              <h4 className="font-urbanist font-bold text-sm">Cerrar Sesión</h4>
              <p className="text-[11px] text-red-400">Salir de tu cuenta en este dispositivo</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-red-300" />
        </button>
      </div>
    </div>
  );
};
