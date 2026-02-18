"use client";

import { ShoppingCart, Zap } from "lucide-react";
import useCartStore from "@/store/useCartStore";
import { toast } from "sonner";

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  return (
    <a
      href={`/product/${product.id}`}
      className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] block"
    >
      {/* Badge */}
      <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-xs font-bold text-white shadow-lg">
        <Zap size={12} className="inline mr-1" />
        Instantâneo
      </div>

      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-900/20 to-indigo-900/20">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs font-semibold rounded-md border border-purple-500/30">
              {product.category}
            </span>
            {product.stock < 10 && (
              <span className="px-2 py-1 bg-red-600/20 text-red-300 text-xs font-semibold rounded-md border border-red-500/30">
                Últimas unidades
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 min-h-[3.5rem]">
            {product.name}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 min-h-[2.5rem]">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            <div className="text-2xl font-bold text-white">
              R$ {parseFloat(product.price).toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">
              {product.stock} em estoque
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2 group/btn"
          >
            <ShoppingCart
              size={18}
              className="group-hover/btn:scale-110 transition-transform"
            />
            Adicionar
          </button>
        </div>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/5 group-hover:to-transparent transition-all pointer-events-none"></div>
    </a>
  );
}
