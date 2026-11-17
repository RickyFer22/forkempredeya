# Informe de Ingeniería Inversa y Migración a React + Vite: Emprende Ya (v1.1.26)

## 1. Resumen Ejecutivo

A partir del archivo de distribución de Android **`Emprende-Ya_1.1.26_apkcube.apks`**, se ejecutó un proceso exhaustivo de ingeniería inversa utilizando herramientas del ecosistema `rea` (Reverse Engineering Assistant), descompiladores de bytecode Hermes y análisis estático de artefactos.

Como resultado, se desensambló completamente la aplicación, identificando su arquitectura original en **React Native / Expo SDK 54**, su infraestructura de backend en **Supabase**, sus esquemas de base de datos relacional, sus tokens de diseño, sus flujos de navegación y todos sus recursos gráficos. Con base en esta evidencia, se implementó la reconstrucción integral de la aplicación en una plataforma web moderna con **React + Vite + TypeScript + Tailwind CSS**.

---

## 2. Ficha Técnica del Artefacto Original

| Parámetro | Detalle Extraído |
| :--- | :--- |
| **Nombre de la App** | Emprende Ya |
| **Slug del Proyecto** | `emprende-ya-app` |
| **Versión** | `1.1.26` (Build Number iOS: `57`, VersionCode Android: `46`) |
| **ID de Paquete Android** | `com.whapy.emprendeya` |
| **Bundle ID iOS** | `com.emprendeya.app` |
| **Framework Base** | React Native (New Architecture habilitada: `newArchEnabled: true`) |
| **Entorno & Tooling** | Expo SDK `54.0.0` con `expo-router` |
| **Motor JS en Producción** | **Hermes Bytecode (HBC)** Versión `96` (0x60) |
| **Desarrollador / Vendor** | Caldén Labs / Whapy (`developed-by-calden-labs`) |
| **Sentry DSN** | `https://a207bd45df4fa16e232f385e56a2f858@o4512114187173888.ingest.us.sentry.io/4512114194972672` |
| **Google Maps API Key** | `AIzaSyAMvMVPp6fWblYzOC7OVRtNbiy_IPxKOuI` |
| **Google Client ID Web** | `801405301782-ap1tct4b3vjg7n80hoemmj8ia0jis9al.apps.googleusercontent.com` |

---

## 3. Infraestructura y Backend Descubiertos

La aplicación opera conectada a una instancia de **Supabase**:

- **URL de la API / Supabase:** `https://api.emprende-ya.com.ar`
- **Referencia Interna de Proyecto:** `lbuomilikpcstagyjxfo` (originalmente `https://lbuomilikpcstagyjxfo.supabase.co`)
- **Publishable / Anon Key:** `sb_publishable_Y7AN2Kc3GDmuc9MJYTB_Tg_uXdLPPx4`
- **Storage Auth Token Key:** `sb-lbuomilikpcstagyjxfo-auth-token`
- **Host de Recuperación de Cuentas:** `https://recover.emprende-ya.com.ar`
- **Endpoints de Servicio:**
  - `/api/request-reset` (Restablecimiento de contraseñas)
  - `/api/broadcast` (Notificaciones masivas / push)
- **Servidor de Mapas y Teselas:** OpenFreeMap (`https://tiles.openfreemap.org/planet`) + Google Maps Geocoding API.
- **Canal de Venta & Coordinación:** WhatsApp directo (`https://wa.me/549...`) con generación dinámica de pedido.

---

## 4. Esquema de Base de Datos Relacional (PostgREST / Supabase)

A través del rastreo de llamadas `.from()`, `.select()`, `.insert()` y `.update()`, se reconstruyó el modelo de datos completo:

```mermaid
erDiagram
    PROFILES ||--o{ ENTREPRENEURS : "crea/administra"
    PROFILES ||--o{ ORDERS : "realiza"
    PROFILES ||--o{ REVIEWS : "escribe"
    PROFILES ||--o{ FAVORITES : "guarda"
    CATEGORIES ||--o{ ENTREPRENEURS : "clasifica"
    ENTREPRENEURS ||--o{ PRODUCTS : "ofrece"
    ENTREPRENEURS ||--o{ ORDERS : "recibe"
    ENTREPRENEURS ||--o{ REVIEWS : "recibe calificacion"
    ENTREPRENEURS ||--o{ FAVORITES : "es guardado"

    PROFILES {
        uuid id PK
        string full_name
        string role "client | entrepreneur | admin"
        string phone
        string avatar_url
        timestamp created_at
    }

    CATEGORIES {
        uuid id PK
        string name
        string slug
        string icon
    }

    ENTREPRENEURS {
        uuid id PK
        uuid profile_id FK
        string business_name
        string slug
        string description
        uuid category_id FK
        string phone_whatsapp
        string whatsapp_message
        string instagram
        string facebook
        string cover_image_url
        string logo_url
        string address
        float latitude
        float longitude
        boolean is_open
        boolean is_digital
        boolean is_hidden
        json opening_hours
        string status "pending | approved | rejected"
        float average_rating
        int total_reviews
        timestamp created_at
    }

    PRODUCTS {
        uuid id PK
        uuid entrepreneur_id FK
        string name
        string description
        numeric price
        string image_url
        boolean is_available
        boolean is_active
        uuid category_id FK
        timestamp created_at
    }

    ORDERS {
        uuid id PK
        uuid user_id FK
        uuid entrepreneur_id FK
        json items "array con id, nombre, precio, cantidad"
        numeric total
        string status "pending | confirmed | preparing | ready | delivered | cancelled"
        boolean whatsapp_sent
        string notes
        timestamp created_at
    }

    REVIEWS {
        uuid id PK
        uuid entrepreneur_id FK
        uuid reviewer_id FK
        int rating "1 al 5"
        string comment
        string owner_reply
        timestamp owner_reply_at
        timestamp created_at
    }

    FAVORITES {
        uuid id PK
        uuid user_id FK
        uuid entrepreneur_id FK
        timestamp created_at
    }

    BANNERS {
        uuid id PK
        string title
        string image_url
        string link_url
        boolean is_active
    }

    APP_SETTINGS {
        string key PK
        string value
    }
```

---

## 5. Tokens del Sistema de Diseño (Design Tokens)

Se extrajeron los tokens exactos definidos en el módulo de estilos (`Colors` y dimensiones):

```typescript
export const Colors = {
  primary: '#FF71C2',          // Rosa insignia Emprende Ya
  primaryLight: '#FFCFED',     // Fondo suave / acento
  primaryDark: '#E82985',      // Hover / botones destacados
  secondaryBlue: '#7DB2FF',    // Azul secundario
  secondaryBlueLight: '#CFEAFF',
  secondary: '#22C55E',        // Verde WhatsApp / éxito
  bgPrimary: '#FFFFFF',
  bgSecondary: '#F6F7F8',      // Fondo general de la app
  bgTertiary: '#E5E7EB',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#E5E7EB',
  error: '#EF4444',
  warning: '#FCD34D',
  info: '#6366F1'
};

export const Spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, '2xl': 24, '3xl': 32 };
export const BorderRadius = { sm: 12, md: 16, lg: 20, xl: 24, full: 28 };
```

---

## 6. Arquitectura del Proyecto React + Vite Reconstruido

El proyecto generado se encuentra en:
📁 `C:\Users\Ricardo\emprende-ya-web`

### Estructura del Código Fuente
```
emprende-ya-web/
├── public/
│   ├── assets/
│   │   ├── logo-full.png
│   │   ├── logo-icon.png
│   │   ├── onboarding-1.png, 2.png, 3.png
│   │   ├── icon-store.png, icon-products.png, icon-panel.png, icon-reports.png
│   │   ├── store-mockup.png, panel-dashboard.png, panel-orders.png
│   │   └── developed-by-calden-labs.png
├── src/
│   ├── components/
│   │   ├── Navbar.tsx             # Barra superior con geolocalización y carrito
│   │   ├── BottomNav.tsx          # Pestañas móviles (Inicio, Mapa, Buscar, Plus, Perfil)
│   │   ├── BannerCarousel.tsx     # Carrusel de promociones
│   │   ├── CategoryList.tsx       # Filtro horizontal por categoría con iconos
│   │   ├── EntrepreneurCard.tsx   # Tarjeta de tienda con estado, distancia y WhatsApp
│   │   ├── ProductCard.tsx        # Tarjeta de producto con botón agregar al carrito
│   │   ├── MapView.tsx            # Mapa interactivo Leaflet con OpenFreeMap
│   │   ├── ReviewList.tsx         # Sistema de calificaciones y respuestas
│   │   └── Footer.tsx             # Pie de página y créditos Caldén Labs
│   ├── contexts/
│   │   ├── AuthContext.tsx        # Autenticación Supabase y roles (cliente/emprendedor)
│   │   ├── CartContext.tsx        # Carrito, cálculo de totales y enlace directo de WhatsApp
│   │   └── LocationContext.tsx    # Geolocalización Haversine y radio de búsqueda
│   ├── lib/
│   │   ├── supabase.ts            # Cliente Supabase configurado
│   │   └── theme.ts               # Constantes de diseño y colores oficiales
│   ├── pages/
│   │   ├── Home.tsx               # Pantalla principal (Explorar)
│   │   ├── ExploreMap.tsx         # Vista de mapa con filtros por cercanía
│   │   ├── Search.tsx             # Búsqueda en vivo de tiendas y productos
│   │   ├── StoreDetail.tsx        # Perfil del emprendedor y catálogo completo
│   │   ├── ProductDetail.tsx      # Ficha del producto y selector de cantidades
│   │   ├── Cart.tsx               # Carrito y despacho a WhatsApp
│   │   ├── Favorites.tsx          # Emprendimientos guardados
│   │   ├── Plus.tsx               # Landing de planes y beneficios Emprende Ya Plus
│   │   ├── Profile.tsx            # Menú y configuración de la cuenta
│   │   ├── Orders.tsx             # Historial de pedidos y estados
│   │   ├── Login.tsx              # Inicio de sesión por correo y Google
│   │   ├── Register.tsx           # Registro para clientes o nuevos emprendedores
│   │   ├── ResetPassword.tsx      # Recuperación de contraseña
│   │   ├── Help.tsx               # Preguntas frecuentes
│   │   ├── Terms.tsx              # Términos y Condiciones
│   │   └── About.tsx              # Acerca de Emprende Ya
│   ├── types/
│   │   └── index.ts               # Tipado TypeScript del modelo de datos
│   ├── App.tsx                    # Enrutador principal (React Router v6)
│   ├── main.tsx                   # Punto de entrada de la aplicación
│   └── index.css                  # Estilos globales y utilidades Tailwind
├── index.html                     # HTML con tipografías Urbanist e Inter
├── tailwind.config.js             # Configuración de Tailwind con tokens de Emprende Ya
└── vite.config.ts                 # Configuración de Vite con alias y dev server
```

---

## 7. Instrucciones para Ejecución Local

1. Abrir una terminal en el directorio del proyecto:
   ```bash
   cd "C:\Users\Ricardo\emprende-ya-web"
   ```
2. Iniciar el servidor de desarrollo Vite:
   ```bash
   npm run dev
   ```
3. La aplicación estará accesible en:
   👉 **`http://localhost:3000`**
