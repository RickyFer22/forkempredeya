import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Phone, Store, UserCheck, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { UserRole } from '../types';

export const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'entrepreneur' ? 'entrepreneur' : 'client';

  const [role, setRole] = useState<UserRole>(initialRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError('Debes aceptar los Términos y Condiciones');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Sign up user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // 2. Insert into profiles
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: fullName.trim(),
          role,
          phone: phone.trim() || null,
        });

        // 3. If entrepreneur, create pending entrepreneur row
        if (role === 'entrepreneur' && businessName.trim()) {
          await supabase.from('entrepreneurs').insert({
            profile_id: data.user.id,
            business_name: businessName.trim(),
            status: 'pending',
            phone_whatsapp: phone.trim() || null,
          });
        }

        alert('¡Registro exitoso! Ya podés ingresar a tu cuenta.');
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta. Intentalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <Link to="/" className="inline-block">
          <img src="/assets/logo-full.png" alt="Emprende Ya" className="h-12 w-auto mx-auto object-contain" />
        </Link>
        <h1 className="font-urbanist font-extrabold text-2xl text-[#1A1A1A]">
          Creá tu cuenta
        </h1>
        <p className="text-xs text-[#6B7280]">
          Elegí cómo querés usar Emprende Ya
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs space-y-5">
        {/* Role toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#F6F7F8] rounded-2xl border border-[#E5E7EB]">
          <button
            type="button"
            onClick={() => setRole('client')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              role === 'client'
                ? 'bg-white text-[#FF71C2] shadow-xs'
                : 'text-[#6B7280] hover:text-[#1A1A1A]'
            }`}
          >
            <UserCheck size={14} />
            <span>Soy Cliente</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('entrepreneur')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              role === 'entrepreneur'
                ? 'bg-white text-[#FF71C2] shadow-xs'
                : 'text-[#6B7280] hover:text-[#1A1A1A]'
            }`}
          >
            <Store size={14} />
            <span>Soy Emprendedor</span>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1A1A1A]">Nombre y Apellido</label>
            <div className="flex items-center gap-2 p-3 rounded-xl border border-[#E5E7EB] focus-within:border-[#FF71C2] bg-[#F6F7F8]">
              <User size={16} className="text-[#9CA3AF]" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Juan Pérez"
                required
                className="w-full bg-transparent text-xs outline-none text-[#1A1A1A]"
              />
            </div>
          </div>

          {role === 'entrepreneur' && (
            <div className="space-y-1 animate-fadeIn">
              <label className="text-xs font-bold text-[#1A1A1A]">Nombre de tu Emprendimiento</label>
              <div className="flex items-center gap-2 p-3 rounded-xl border border-[#E5E7EB] focus-within:border-[#FF71C2] bg-[#F6F7F8]">
                <Store size={16} className="text-[#9CA3AF]" />
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Ej: Panadería Las Delicias"
                  required
                  className="w-full bg-transparent text-xs outline-none text-[#1A1A1A]"
                />
              </div>
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

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1A1A1A]">WhatsApp / Teléfono</label>
            <div className="flex items-center gap-2 p-3 rounded-xl border border-[#E5E7EB] focus-within:border-[#FF71C2] bg-[#F6F7F8]">
              <Phone size={16} className="text-[#9CA3AF]" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="11 1234 5678"
                className="w-full bg-transparent text-xs outline-none text-[#1A1A1A]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1A1A1A]">Contraseña</label>
            <div className="flex items-center gap-2 p-3 rounded-xl border border-[#E5E7EB] focus-within:border-[#FF71C2] bg-[#F6F7F8]">
              <Lock size={16} className="text-[#9CA3AF]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                className="w-full bg-transparent text-xs outline-none text-[#1A1A1A]"
              />
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 rounded text-[#FF71C2] focus:ring-[#FF71C2]"
              required
            />
            <label htmlFor="terms" className="text-[11px] text-[#6B7280] leading-tight cursor-pointer">
              Acepto los{' '}
              <Link to="/terms" className="text-[#FF71C2] hover:underline font-semibold" target="_blank">
                Términos y Condiciones
              </Link>{' '}
              y la{' '}
              <Link to="/privacy" className="text-[#FF71C2] hover:underline font-semibold" target="_blank">
                Política de Privacidad
              </Link>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-[#FF71C2] hover:bg-[#E82985] text-white font-urbanist font-extrabold text-sm shadow-md transition-all hover:scale-101 disabled:opacity-50"
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="text-center text-xs text-[#6B7280]">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="font-bold text-[#FF71C2] hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
};
