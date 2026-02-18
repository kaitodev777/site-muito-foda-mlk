"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import StoreLayout from "@/app/store-layout";
import { useState } from "react";
import useCartStore from "@/store/useCartStore";
import ProductCard from "@/components/store/ProductCard";
import { Star, ShoppingBag, Truck, ShieldCheck, Heart } from "lucide-react";
import { toast } from "sonner";

export default function ProductPage({ params }) {
  const { id } = params;
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((state) => state.addItem);
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetch(`/api/store/products/${id}`).then((res) => res.json()),
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetch("/api/store/products").then((res) => res.json()),
    select: (data) => data.filter((p) => p.id !== parseInt(id)).slice(0, 4),
  });

  const { data: reviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () =>
      fetch(`/api/store/reviews?productId=${id}`).then((res) => res.json()),
  });

  const handleAdd = () => {
    addItem(product);
    toast.success("Adicionado ao carrinho!");
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Produto não encontrado
      </div>
    );

  const gallery = product.gallery || [product.image_url];

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden">
              <img
                src={gallery[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx ? "border-primary" : "border-transparent"}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 uppercase tracking-widest">
                {product.category}
              </div>
              <h1 className="text-4xl font-bold tracking-tighter font-sora">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="text-sm font-medium ml-1">4.9</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-500">
                  {reviews?.length || 0} Avaliações
                </span>
              </div>
            </div>

            <div className="text-3xl font-bold">
              R$ {parseFloat(product.price).toFixed(2)}
            </div>

            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAdd}
                className="flex-1 bg-primary text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <ShoppingBag size={20} /> Adicionar ao Carrinho
              </button>
              <button className="w-14 h-14 border rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Heart size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-8 border-t">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Truck size={20} />
                </div>
                <div className="text-xs">
                  <p className="font-bold">Frete Grátis</p>
                  <p className="text-gray-500">Para compras acima de R$ 500</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <ShieldCheck size={20} />
                </div>
                <div className="text-xs">
                  <p className="font-bold">Compra Segura</p>
                  <p className="text-gray-500">Certificado SSL premium</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-24 pt-24 border-t">
          <h2 className="text-3xl font-bold mb-12 font-sora">
            Avaliações de Clientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews?.map((review) => (
              <div
                key={review.id}
                className="bg-gray-50 p-8 rounded-3xl space-y-4"
              >
                <div className="flex items-center gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm italic text-gray-600">
                  "{review.comment}"
                </p>
                <p className="font-bold text-sm">— {review.author}</p>
              </div>
            ))}
            {(!reviews || reviews.length === 0) && (
              <p className="text-gray-400 italic">
                Ainda não há avaliações para este produto.
              </p>
            )}
          </div>
        </section>

        {/* Related Products */}
        <section className="mt-24">
          <h2 className="text-3xl font-bold mb-12 font-sora">
            Produtos Relacionados
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {relatedProducts?.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </StoreLayout>
  );
}
