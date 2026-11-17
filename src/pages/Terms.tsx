import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B7280] hover:text-[#FF71C2] transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Volver al Inicio</span>
      </Link>

      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-10 shadow-xs space-y-6 text-xs text-[#4B5563] leading-relaxed">
        <h1 className="font-urbanist font-extrabold text-2xl sm:text-3xl text-[#1A1A1A]">
          Términos y Condiciones de Uso
        </h1>
        <p className="text-[#9CA3AF]">Última actualización: Noviembre 2026</p>

        <section className="space-y-2">
          <h2 className="font-urbanist font-bold text-base text-[#1A1A1A]">1. Objeto de la Plataforma</h2>
          <p>
            Emprende Ya es una plataforma tecnológica que tiene como objetivo conectar a consumidores locales con emprendedores, negocios y prestadores de servicios independientes de proximidad geográfica.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-urbanist font-bold text-base text-[#1A1A1A]">2. Relación entre Usuarios y Emprendedores</h2>
          <p>
            Emprende Ya no interviene en las transacciones comerciales, pagos, envíos ni en la calidad de los productos o servicios ofrecidos por los emprendedores. Toda transacción es acordada de forma directa y libre entre comprador y vendedor vía WhatsApp o canales autorizados.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-urbanist font-bold text-base text-[#1A1A1A]">3. Responsabilidad del Contenido</h2>
          <p>
            Los emprendedores son los únicos y exclusivos responsables de la exactitud, veracidad y legalidad de las fotos, descripciones y precios publicados en sus tiendas y catálogos digitales.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-urbanist font-bold text-base text-[#1A1A1A]">4. Modificaciones del Servicio</h2>
          <p>
            Emprende Ya se reserva el derecho de modificar, suspender o actualizar las funcionalidades de la plataforma con el fin de mejorar la experiencia y seguridad de todos los usuarios.
          </p>
        </section>
      </div>
    </div>
  );
};

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B7280] hover:text-[#FF71C2] transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Volver al Inicio</span>
      </Link>

      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-10 shadow-xs space-y-6 text-xs text-[#4B5563] leading-relaxed">
        <div className="flex items-center gap-3">
          <img
            src="/assets/logo-proteccion-datos.png"
            alt="Protección Datos Personales"
            className="h-10 w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div>
            <h1 className="font-urbanist font-extrabold text-2xl sm:text-3xl text-[#1A1A1A]">
              Política de Privacidad
            </h1>
            <p className="text-[#9CA3AF]">Cumplimiento Ley 25.326 de Protección de Datos Personales</p>
          </div>
        </div>

        <section className="space-y-2">
          <h2 className="font-urbanist font-bold text-base text-[#1A1A1A]">1. Datos que Recopilamos</h2>
          <p>
            Recopilamos únicamente los datos necesarios para brindar el servicio: nombre, correo electrónico, teléfono/WhatsApp y ubicación geográfica aproximada para calcular distancias a comercios locales.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-urbanist font-bold text-base text-[#1A1A1A]">2. Uso de la Ubicación</h2>
          <p>
            Tu ubicación se utiliza en tiempo real exclusivamente para ordenarte los negocios por cercanía y mostrarte el mapa de emprendedores. Nunca vendemos ni compartimos tu geolocalización con terceros con fines publicitarios.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-urbanist font-bold text-base text-[#1A1A1A]">3. Seguridad y Confidencialidad</h2>
          <p>
            Implementamos protocolos de cifrado y medidas de seguridad técnicas para proteger tu información contra accesos no autorizados, pérdida o alteración.
          </p>
        </section>
      </div>
    </div>
  );
};
