"use client";

import { useEffect } from "react";
import StoreLayout from "@/app/store-layout";
import { CheckCircle, Package, Mail } from "lucide-react";
import useCartStore from "@/store/useCartStore";

export default function SuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Limpar carrinho após compra bem sucedida
    clearCart();
  }, [clearCart]);

  return (
    <StoreLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 px-4 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
          <CheckCircle size={48} className="text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter font-sora text-white">
            Pagamento Confirmado!
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Seus dados de acesso foram enviados para o seu e-mail. Confira sua
            caixa de entrada!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
          <a
            href="/minhas-compras"
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            <Package size={20} />
            Ver Meus Pedidos
          </a>
          <a
            href="/"
            className="px-8 py-4 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all"
          >
            Continuar Comprando
          </a>
        </div>

        <div className="flex items-center gap-2 text-gray-400 text-sm pt-8">
          <Mail size={16} />
          <p>Verifique seu e-mail para acessar suas contas de streaming</p>
        </div>
      </div>
    </StoreLayout>
  );
}
