export type UserRole = 'client' | 'entrepreneur' | 'admin';

export interface Profile {
  id: string;
  email?: string;
  full_name: string;
  avatar_url?: string | null;
  phone?: string | null;
  role: UserRole;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  icon?: string;
}

export interface Entrepreneur {
  id: string;
  profile_id?: string;
  slug?: string;
  business_name: string;
  description?: string | null;
  category_id?: string | null;
  phone_whatsapp?: string | null;
  whatsapp_message?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  cover_image_url?: string | null;
  logo_url?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_open?: boolean;
  is_digital?: boolean;
  is_hidden?: boolean;
  opening_hours?: string | Record<string, any> | null;
  status: 'pending' | 'approved' | 'rejected';
  average_rating?: number;
  total_reviews?: number;
  created_at?: string;
  category?: Category;
  profile?: Profile;
}

export interface Product {
  id: string;
  entrepreneur_id: string;
  name: string;
  description?: string | null;
  price: number;
  image_url?: string | null;
  images?: string[];
  is_available?: boolean;
  is_active?: boolean;
  category_id?: string | null;
  created_at?: string;
  entrepreneur?: Entrepreneur;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  user_id: string;
  entrepreneur_id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  whatsapp_sent?: boolean;
  notes?: string | null;
  created_at: string;
  entrepreneur?: Entrepreneur;
  buyer?: Profile;
}

export interface Review {
  id: string;
  entrepreneur_id: string;
  reviewer_id?: string;
  rating: number;
  comment?: string | null;
  owner_reply?: string | null;
  owner_reply_at?: string | null;
  created_at: string;
  reviewer?: {
    full_name: string;
    avatar_url?: string | null;
  };
}

export interface Favorite {
  id: string;
  user_id: string;
  entrepreneur_id: string;
  created_at: string;
  entrepreneur?: Entrepreneur;
}

export interface Banner {
  id: string;
  title?: string;
  image_url: string;
  link_url?: string;
  is_active?: boolean;
}

export interface AppSettings {
  key: string;
  value: string;
}
