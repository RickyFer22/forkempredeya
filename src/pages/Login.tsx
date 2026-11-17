import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) throw signInError;
      if (data.session) {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión. Verificá tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
    } catch (err: any) {
      setError(err.message || 'Error con Google Sign-In');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      {/* Brand logo */}
      <div className="text-center space-y-2">
        <Link to="/" className="inline-block">
          <img src="/assets/logo-full.png" alt="Emprende Ya" className="h-12 w-auto mx-auto object-contain" />
        </Link>
        <h1 className="font-urbanist font-extrabold text-2xl text-[#1A1A1A]">
          ¡Hola de nuevo!
        </h1>
        <p className="text-xs text-[#6B7280]">
          Ingresá a tu cuenta para continuar
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#1A1A1A]">Contraseña</label>
              <Link to="/reset-password" className="text-[11px] text-[#FF71C2] hover:underline font-semibold">
                ¿La olvidaste?
              </Link>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl border border-[#E5E7EB] focus-within:border-[#FF71C2] bg-[#F6F7F8]">
              <Lock size={16} className="text-[#9CA3AF]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-[#E5E7EB]"></div>
          <span className="flex-shrink mx-4 text-[11px] text-[#9CA3AF] uppercase font-bold">O continuá con</span>
          <div className="flex-grow border-t border-[#E5E7EB]"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-3 rounded-full border border-[#E5E7EB] hover:bg-[#F6F7F8] text-[#1A1A1A] font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.665-5.17 3.665-9.09z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.09C3.3 21.43 7.36 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.59H1.27C.46 8.21 0 10.05 0 12s.46 3.79 1.27 5.41l4.01-3.09z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.3 2.57 1.27 6.59l4.01 3.09c.95-2.83 3.6-4.93 6.72-4.93z"
            />
          </svg>
          <span>Google</span>
        </button>

        <p className="text-center text-xs text-[#6B7280]">
          ¿No tenés una cuenta?{' '}
          <Link to="/register" className="font-bold text-[#FF71C2] hover:underline">
            Registrate gratis
          </Link>
        </p>
      </div>
    </div>
  );
};
