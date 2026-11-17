import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, MessageCircle, Store as StoreIcon } from 'lucide-react';
import { Entrepreneur } from '../types';
import { useLocation } from '../contexts/LocationContext';

interface EntrepreneurCardProps {
  entrepreneur: Entrepreneur;
}

export const EntrepreneurCard: React.FC<EntrepreneurCardProps> = ({ entrepreneur }) => {
  const { calculateDistance, formatDistance } = useLocation();

  const distance =
    entrepreneur.latitude && entrepreneur.longitude
      ? calculateDistance(entrepreneur.latitude, entrepreneur.longitude)
      : null;

  const whatsappHref = entrepreneur.phone_whatsapp
    ? `https://wa.me/${entrepreneur.phone_whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
        entrepreneur.whatsapp_message || `¡Hola ${entrepreneur.business_name}! Te encontré en Emprende Ya y quiero consultarles.`
      )}`
    : null;

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#FF71C2] hover:shadow-md transition-all overflow-hidden flex flex-col group">
      {/* Cover */}
      <Link to={`/store/${entrepreneur.id}`} className="relative h-32 w-full bg-gradient-to-tr from-[#FFCFED] to-[#CFEAFF] overflow-hidden block">
        {entrepreneur.cover_image_url ? (
          <img
            src={entrepreneur.cover_image_url}
            alt={entrepreneur.business_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-40">
            <StoreIcon size={36} className="text-[#E82985]" />
          </div>
        )}

        {/* Status Pill */}
        <div className="absolute top-2.5 right-2.5">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              entrepreneur.is_open ?? true
                ? 'bg-emerald-500/90 text-white'
                : 'bg-zinc-600/90 text-white'
            }`}
          >
            {entrepreneur.is_open ?? true ? 'Abierto' : 'Cerrado'}
          </span>
        </div>

        {/* Logo circle */}
        <div className="absolute -bottom-4 left-3 w-12 h-12 rounded-full border-2 border-white bg-white shadow-sm overflow-hidden flex items-center justify-center">
          {entrepreneur.logo_url ? (
            <img
              src={entrepreneur.logo_url}
              alt={entrepreneur.business_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#FF71C2] text-white flex items-center justify-center font-bold text-sm">
              {entrepreneur.business_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </Link>

      {/* Body info */}
      <div className="pt-6 p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link to={`/store/${entrepreneur.id}`}>
              <h3 className="font-urbanist font-bold text-base text-[#1A1A1A] group-hover:text-[#FF71C2] transition-colors line-clamp-1">
                {entrepreneur.business_name}
              </h3>
            </Link>
          </div>

          {/* Category */}
          {entrepreneur.category?.name && (
            <span className="inline-block mt-1 text-[11px] font-medium text-[#6B7280] bg-[#F6F7F8] px-2 py-0.5 rounded-md">
              {entrepreneur.category.name}
            </span>
          )}

          {/* Description */}
          {entrepreneur.description && (
            <p className="mt-2 text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
              {entrepreneur.description}
            </p>
          )}
        </div>

        {/* Footer stats & contact */}
        <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 text-[#6B7280]">
            {/* Rating */}
            <div className="flex items-center gap-1 font-semibold text-[#1A1A1A]">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span>{entrepreneur.average_rating ? entrepreneur.average_rating.toFixed(1) : 'Nuevo'}</span>
              {entrepreneur.total_reviews ? (
                <span className="text-[#9CA3AF] text-[10px]">({entrepreneur.total_reviews})</span>
              ) : null}
            </div>

            {/* Distance */}
            {distance !== null && (
              <div className="flex items-center gap-0.5 text-[#6B7280]">
                <MapPin size={12} className="text-[#FF71C2]" />
                <span>{formatDistance(distance)}</span>
              </div>
            )}
          </div>

          {/* Quick WhatsApp contact */}
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-xs"
              title="Contactar por WhatsApp"
            >
              <MessageCircle size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
