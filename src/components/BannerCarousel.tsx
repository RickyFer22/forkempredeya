import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Banner } from '../types';

export const BannerCarousel: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data, error } = await supabase
          .from('banners')
          .select('*')
          .eq('is_active', true);

        if (!error && data && data.length > 0) {
          setBanners(data as Banner[]);
        } else {
          // Fallback static banners based on original app branding
          setBanners([
            {
              id: '1',
              title: '¡Descubrí emprendedores cerca de tu casa!',
              image_url: '/assets/onboarding-1.png',
              link_url: '/search',
              is_active: true,
            },
            {
              id: '2',
              title: 'Comprá directo por WhatsApp sin comisiones',
              image_url: '/assets/onboarding-2.png',
              link_url: '/plus',
              is_active: true,
            },
            {
              id: '3',
              title: 'Sumá tu negocio a Emprende Ya Plus',
              image_url: '/assets/onboarding-3.png',
              link_url: '/plus',
              is_active: true,
            },
          ]);
        }
      } catch {
        // Fallback
        setBanners([
          {
            id: '1',
            title: '¡Descubrí emprendedores cerca tuyo!',
            image_url: '/assets/onboarding-1.png',
            link_url: '/search',
            is_active: true,
          },
        ]);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-sm bg-gradient-to-r from-[#FF71C2] to-[#7DB2FF] text-white">
      <div className="relative h-44 sm:h-52 w-full flex items-center justify-between p-6 sm:p-8">
        <div className="z-10 max-w-[65%] space-y-2">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wider text-white">
            Destacado
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold font-urbanist leading-tight text-white drop-shadow-sm">
            {banners[currentIndex]?.title}
          </h2>
          <p className="text-xs sm:text-sm text-white/90">
            Apoyá el comercio local y contactate en un clic.
          </p>
        </div>

        {/* Mascot / App Asset illustration */}
        <div className="absolute right-3 bottom-0 top-0 flex items-center justify-end w-1/3 max-w-[180px] pointer-events-none">
          <img
            src={banners[currentIndex]?.image_url || '/assets/logo-icon.png'}
            alt="Emprende Ya Banner"
            className="max-h-[85%] object-contain drop-shadow-md"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/logo-icon.png';
            }}
          />
        </div>
      </div>

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-2.5 left-6 flex gap-1.5 z-20">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
              }`}
              aria-label={`Ir al banner ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
