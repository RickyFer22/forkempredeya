import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Error al enviar el correo de recuperación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <Link
        to="/login"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B7280] hover:text-[#FF71C2] transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Volver a Iniciar Sesión</span>
      </Link>

      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs space-y-5 text-center">
        <h1 className="font-urbanist font-extrabold text-2xl text-[#1A1A1A]">
          Recuperar Contraseña
        </h1>
        <p className="text-xs text-[#6B7280]">
          Ingresá el correo asociado a tu cuenta y te enviaremos un enlace para restablecerla.
        </p>

        {sent ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2">
            <CheckCircle2 size={24} className="mx-auto text-emerald-600" />
            <p className="font-bold">¡Correo enviado con éxito!</p>
            <p className="text-[11px] text-emerald-700">
              Revisá tu bandeja de entrada o spam para continuar con el cambio de clave.
            </p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4 text-left">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1A1A1A]">Correo Electrónico</label>
              <div className="flex items-center gap-2 p-3 rounded-xl border border-[#E5E7EB] focus-within:border-[#FF71C2] bg-[#F6F7F8]">
                <Mail size={16} className="text-[#9CA3AF]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full bg-transparent text-xs outline-none text-[#1A1A1A]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#FF71C2] hover:bg-[#E82985] text-white font-urbanist font-extrabold text-sm shadow-md transition-all hover:scale-101 disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
