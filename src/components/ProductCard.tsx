import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, Image as ImageIcon } from 'lucide-react';
import { Product, Entrepreneur } from '../types';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  entrepreneur?: Entrepreneur;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, entrepreneur }) => {
  const { addToCart, items } = useCart();
  const [added, setAdded] = React.useState(false);

  const ent = entrepreneur || product.entrepreneur;
  const inCart = items.some((i) => i.product_id === product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!ent) return;
    const ok = addToCart(product, ent);
    if (ok) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#FF71C2] hover:shadow-md transition-all overflow-hidden flex flex-col group">
      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="relative h-40 w-full bg-[#F6F7F8] overflow-hidden block">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#9CA3AF]">
            <ImageIcon size={32} />
          </div>
        )}

        {/* Quick Add Button */}
        {ent && (
          <button
            onClick={handleAdd}
            className={`absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${
              added || inCart
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-[#1A1A1A] hover:bg-[#FF71C2] hover:text-white'
            }`}
            title="Agregar al carrito"
          >
            {added || inCart ? <Check size={18} /> : <Plus size={18} />}
          </button>
        )}
      </Link>

      {/* Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {ent && (
            <Link
              to={`/store/${ent.id}`}
              className="text-[11px] font-semibold text-[#6B7280] hover:text-[#FF71C2] line-clamp-1 mb-0.5"
            >
              {ent.business_name}
            </Link>
          )}

          <Link to={`/product/${product.id}`}>
            <h4 className="font-urbanist font-bold text-sm text-[#1A1A1A] group-hover:text-[#FF71C2] transition-colors line-clamp-1">
              {product.name}
            </h4>
          </Link>

          {product.description && (
            <p className="mt-1 text-xs text-[#9CA3AF] line-clamp-1">
              {product.description}
            </p>
          )}
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <span className="font-urbanist font-extrabold text-base text-[#1A1A1A]">
            ${product.price.toLocaleString('es-AR')}
          </span>
          {product.is_available === false && (
            <span className="text-[10px] font-bold text-red-500 uppercase">
              Agotado
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
