import React, { useEffect, useState } from 'react';
import { MapView } from '../components/MapView';
import { CategoryList } from '../components/CategoryList';
import { EntrepreneurCard } from '../components/EntrepreneurCard';
import { supabase } from '../lib/supabase';
import { Entrepreneur } from '../types';
import { useLocation } from '../contexts/LocationContext';
import { MapPin, SlidersHorizontal } from 'lucide-react';

export const ExploreMap: React.FC = () => {
  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEnt, setSelectedEnt] = useState<Entrepreneur | null>(null);
  const [loading, setLoading] = useState(true);
  const { coords, radiusKm, setRadiusKm, calculateDistance, requestCurrentLocation } = useLocation();

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('entrepreneurs')
          .select('*, category:categories(name)')
          .eq('status', 'approved')
          .eq('is_hidden', false)
          .not('latitude', 'is', null)
          .not('longitude', 'is', null);

        if (selectedCategory) {
          query = query.eq('category_id', selectedCategory);
        }

        const { data } = await query;
        if (data) {
          let list = data as Entrepreneur[];
          if (radiusKm && coords) {
            list = list.filter((e) => {
              if (!e.latitude || !e.longitude) return false;
              const d = calculateDistance(e.latitude, e.longitude);
              return d !== null && d <= radiusKm;
            });
          }
          setEntrepreneurs(list);
        }
      } catch (err) {
        console.error('Error fetching map stores:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, [selectedCategory, radiusKm, coords]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-urbanist font-extrabold text-2xl text-[#1A1A1A]">
            Mapa de Emprendedores
          </h1>
          <p className="text-xs text-[#6B7280]">
            Encontrá negocios locales y visitá sus locales o pediles a domicilio.
          </p>
        </div>

        {/* Radius filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          <button
            onClick={requestCurrentLocation}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-[#E5E7EB] hover:border-[#FF71C2] text-[#6B7280]"
            title="Mi ubicación"
          >
            <MapPin size={13} className="text-[#FF71C2]" />
            <span>Ubicarme</span>
          </button>

          {[
            { label: 'Todos', value: null },
            { label: '5 km', value: 5 },
            { label: '10 km', value: 10 },
            { label: '25 km', value: 25 },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setRadiusKm(item.value)}
              className={`px-3 py-1.5 rounded-full transition-all border ${
                radiusKm === item.value
                  ? 'bg-[#FF71C2] text-white border-[#FF71C2]'
                  : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#FF71C2]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category selector */}
      <CategoryList
        selectedCategoryId={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Map + List Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Map */}
        <div className="lg:col-span-2">
          <MapView
            entrepreneurs={entrepreneurs}
            selectedEntrepreneur={selectedEnt}
            onSelectEntrepreneur={setSelectedEnt}
            height="560px"
          />
        </div>

        {/* Side Store list */}
        <div className="space-y-4 max-h-[560px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span className="font-bold">
              {entrepreneurs.length} emprendimiento{entrepreneurs.length !== 1 ? 's' : ''} en el mapa
            </span>
            {selectedEnt && (
              <button
                onClick={() => setSelectedEnt(null)}
                className="text-[#FF71C2] hover:underline font-semibold"
              >
                Limpiar selección
              </button>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 rounded-2xl bg-white border border-[#E5E7EB] animate-pulse" />
              ))}
            </div>
          ) : entrepreneurs.length === 0 ? (
            <div className="p-6 bg-white rounded-2xl border border-[#E5E7EB] text-center text-xs text-[#6B7280]">
              No hay emprendedores con ubicación para este filtro o radio.
            </div>
          ) : (
            <div className="space-y-3">
              {entrepreneurs.map((ent) => (
                <div
                  key={ent.id}
                  onClick={() => setSelectedEnt(ent)}
                  className={`cursor-pointer transition-transform ${
                    selectedEnt?.id === ent.id ? 'ring-2 ring-[#FF71C2] rounded-2xl scale-[1.01]' : ''
                  }`}
                >
                  <EntrepreneurCard entrepreneur={ent} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
