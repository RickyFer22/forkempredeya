import React, { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Review } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface ReviewListProps {
  entrepreneurId: string;
  reviews: Review[];
  onReviewAdded: () => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  entrepreneurId,
  reviews,
  onReviewAdded,
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Debes iniciar sesión para dejar una reseña');
      return;
    }
    if (!comment.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from('reviews').insert({
        entrepreneur_id: entrepreneurId,
        reviewer_id: user.id,
        rating,
        comment: comment.trim(),
      });

      if (insertError) throw insertError;

      setComment('');
      setRating(5);
      onReviewAdded();
    } catch (err: any) {
      setError(err.message || 'Error al enviar la reseña');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-urbanist font-bold text-lg text-[#1A1A1A]">
          Opiniones y Reseñas ({reviews.length})
        </h3>
      </div>

      {/* Review submission form */}
      {user ? (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl border border-[#E5E7EB] space-y-3 shadow-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            Dejá tu opinión
          </h4>

          {/* Star selector */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setRating(s)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  size={20}
                  className={s <= rating ? 'fill-amber-400 text-amber-400' : 'text-[#E5E7EB]'}
                />
              </button>
            ))}
            <span className="text-xs text-[#6B7280] ml-2 font-medium">
              {rating} de 5 estrellas
            </span>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Contá tu experiencia con este emprendimiento..."
            rows={3}
            className="w-full text-sm p-3 rounded-xl border border-[#E5E7EB] focus:border-[#FF71C2] focus:ring-1 focus:ring-[#FF71C2] outline-none"
            required
          />

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-full bg-[#FF71C2] hover:bg-[#E82985] text-white text-xs font-bold transition-all disabled:opacity-50"
            >
              {submitting ? 'Publicando...' : 'Publicar Reseña'}
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-[#FFCFED]/30 rounded-2xl border border-[#FFCFED] text-center">
          <p className="text-xs text-[#E82985] font-medium">
            Iniciá sesión para calificar este emprendimiento y compartir tu experiencia.
          </p>
        </div>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-[#9CA3AF] text-sm">
          Aún no hay reseñas para este emprendimiento. ¡Sé el primero en opinar!
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-4 bg-white rounded-2xl border border-[#E5E7EB] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#CFEAFF] text-[#7DB2FF] font-bold text-xs flex items-center justify-center">
                    {rev.reviewer?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h5 className="font-urbanist font-bold text-xs text-[#1A1A1A]">
                      {rev.reviewer?.full_name || 'Usuario de Emprende Ya'}
                    </h5>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={12}
                          className={s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-[#E5E7EB]'}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-[#9CA3AF]">
                  {rev.created_at ? new Date(rev.created_at).toLocaleDateString('es-AR') : ''}
                </span>
              </div>

              {rev.comment && (
                <p className="text-xs text-[#6B7280] leading-relaxed pl-10">
                  {rev.comment}
                </p>
              )}

              {/* Owner Reply */}
              {rev.owner_reply && (
                <div className="mt-2.5 ml-10 p-3 rounded-xl bg-[#F6F7F8] border border-[#E5E7EB] text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#E82985]">
                    <MessageSquare size={13} />
                    <span>Respuesta del emprendedor:</span>
                  </div>
                  <p className="text-[#1A1A1A]">{rev.owner_reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
