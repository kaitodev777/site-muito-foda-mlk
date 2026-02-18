"use client";

import { useState, useEffect } from "react";
import useCartStore from "@/store/useCartStore";
import StoreLayout from "@/app/store-layout";
import { toast } from "sonner";
import { ShieldCheck, CreditCard, ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const { items, getTotal } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isApplying, setIsApplying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  // Auto-preencher dados se usuário estiver logado
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("customer_token");
      if (token) {
        const name = localStorage.getItem("customer_name") || "";
        const email = localStorage.getItem("customer_email") || "";
        setFormData({ name, email });
      }
    }
  }, []);

  const subtotal = getTotal();
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsApplying(true);
    try {
      const res = await fetch("/api/store/coupons");
      const coupons = await res.json();
      const coupon = coupons.find(
        (c) => c.code.toUpperCase() === couponCode.toUpperCase() && c.active,
      );

      if (coupon) {
        setDiscount(coupon.discount_percentage);
        toast.success(
          `Cupom aplicado! ${coupon.discount_percentage}% de desconto.`,
        );
      } else {
        toast.error("Cupom inválido ou expirado.");
        setDiscount(0);
      }
    } catch (error) {
      toast.error("Erro ao aplicar cupom.");
    } finally {
      setIsApplying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/store/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          totalAmount: total,
          discount: discount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao processar pedido");
      }

      // Redirecionar para página de pagamento
      window.location.href = `/pagamento/${data.orderId}`;
    } catch (error) {
      console.error("Erro no checkout:", error);
      toast.error(error.message || "Erro ao processar pedido.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <StoreLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
          <ShoppingBag size={64} className="text-gray-200" />
          <h2 className="text-2xl font-bold">Seu carrinho está vazio</h2>
          <a
            href="/"
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold"
          >
            Voltar para a Loja
          </a>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12 tracking-tighter font-sora text-center md:text-left">
          Finalizar Compra
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-8 order-2 lg:order-1"
          >
            <section className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                  1
                </div>
                Informações de Entrega
              </h2>
              <p className="text-sm text-gray-500">
                Seus dados de acesso serão enviados para o e-mail cadastrado.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Nome Completo"
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:ring-2 ring-primary outline-none"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <input
                  required
                  type="email"
                  placeholder="E-mail para receber o acesso"
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:ring-2 ring-primary outline-none"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                  2
                </div>
                Pagamento
              </h2>
              <div className="p-6 border-2 border-primary bg-primary/5 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-primary text-white rounded-xl">
                  <CreditCard size={24} />
                </div>
                <div>
                  <p className="font-bold">Pagamento Seguro</p>
                  <p className="text-sm text-gray-500">
                    Escolha o método na próxima etapa.
                  </p>
                </div>
              </div>
            </section>

            <button
              disabled={isSubmitting}
              className="w-full bg-primary text-white h-16 rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Processando..." : "Ir para Pagamento"}{" "}
              <ShieldCheck size={20} />
            </button>
          </form>

          {/* Summary */}
          <div className="order-1 lg:order-2 space-y-8">
            <div className="bg-gray-50 rounded-3xl p-8 space-y-6">
              <h2 className="text-xl font-bold">Resumo do Pedido</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex-shrink-0 border">
                      <img
                        src={item.image_url}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <p className="text-gray-400 text-xs">
                        {item.quantity}x R$ {parseFloat(item.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="font-bold">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t space-y-4">
                <div className="flex gap-2">
                  <input
                    placeholder="Cupom de Desconto"
                    className="flex-1 h-12 px-4 rounded-xl border border-gray-200 outline-none"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isApplying}
                    className="bg-black text-white px-6 rounded-xl font-bold text-sm hover:opacity-80 transition-opacity"
                  >
                    Aplicar
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Desconto ({discount}%)</span>
                      <span>- R$ {discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500">
                    <span>Entrega Digital</span>
                    <span className="text-green-600 font-medium">
                      Instantânea
                    </span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-4 border-t">
                    <span>Total</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-400 text-sm justify-center">
              <ShieldCheck size={16} /> Pagamento processado de forma segura e
              criptografada.
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
