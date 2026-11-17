import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Entrepreneur, OrderItem } from '../types';

export interface CartItem extends OrderItem {
  entrepreneur_id: string;
}

interface CartContextType {
  items: CartItem[];
  currentEntrepreneur: Entrepreneur | null;
  addToCart: (product: Product, entrepreneur: Entrepreneur) => boolean;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  createWhatsAppLink: (notes?: string) => string;
}

const CartContext = createContext<CartContextType>({
  items: [],
  currentEntrepreneur: null,
  addToCart: () => false,
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
  createWhatsAppLink: () => '',
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('emprendeya_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentEntrepreneur, setCurrentEntrepreneur] = useState<Entrepreneur | null>(() => {
    try {
      const saved = localStorage.getItem('emprendeya_cart_entrepreneur');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem('emprendeya_cart', JSON.stringify(items));
    if (items.length === 0) {
      setCurrentEntrepreneur(null);
      localStorage.removeItem('emprendeya_cart_entrepreneur');
    }
  }, [items]);

  useEffect(() => {
    if (currentEntrepreneur) {
      localStorage.setItem('emprendeya_cart_entrepreneur', JSON.stringify(currentEntrepreneur));
    }
  }, [currentEntrepreneur]);

  const addToCart = (product: Product, entrepreneur: Entrepreneur): boolean => {
    // If cart has items from another entrepreneur, confirm reset or reject
    if (currentEntrepreneur && currentEntrepreneur.id !== entrepreneur.id && items.length > 0) {
      const confirmReset = window.confirm(
        `Tu carrito ya tiene productos de "${currentEntrepreneur.business_name}". ¿Deseás vaciar el carrito para comprar en "${entrepreneur.business_name}"?`
      );
      if (!confirmReset) return false;
      setItems([{
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image_url: product.image_url,
        entrepreneur_id: entrepreneur.id,
      }]);
      setCurrentEntrepreneur(entrepreneur);
      return true;
    }

    setCurrentEntrepreneur(entrepreneur);
    setItems((prev) => {
      const existing = prev.find((i) => i.product_id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image_url: product.image_url,
          entrepreneur_id: entrepreneur.id,
        },
      ];
    });
    return true;
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product_id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product_id === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setCurrentEntrepreneur(null);
    localStorage.removeItem('emprendeya_cart');
    localStorage.removeItem('emprendeya_cart_entrepreneur');
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const createWhatsAppLink = (notes?: string): string => {
    if (!currentEntrepreneur?.phone_whatsapp) return '';
    let phone = currentEntrepreneur.phone_whatsapp.replace(/\D/g, '');
    if (!phone.startsWith('54') && phone.length === 10) {
      phone = '549' + phone;
    }

    let text = `¡Hola *${currentEntrepreneur.business_name}*! 👋\nQuiero hacer un pedido a través de *Emprende Ya*:\n\n`;
    items.forEach((item) => {
      text += `• ${item.quantity}x ${item.name} ($${item.price.toLocaleString('es-AR')}) = $${(item.price * item.quantity).toLocaleString('es-AR')}\n`;
    });
    text += `\n*Total: $${totalPrice.toLocaleString('es-AR')}*\n`;

    if (notes?.trim()) {
      text += `\n📝 *Notas del pedido:* ${notes.trim()}\n`;
    }

    text += `\n¿Cómo coordinamos el pago y la entrega? ¡Muchas gracias!`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        currentEntrepreneur,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        createWhatsAppLink,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
