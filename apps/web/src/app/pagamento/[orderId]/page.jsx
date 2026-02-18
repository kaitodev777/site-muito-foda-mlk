"use client";

import { useState, useEffect } from "react";
import StoreLayout from "@/app/store-layout";
import {
  CreditCard,
  Smartphone,
  QrCode,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function PaymentPage(props) {
  const orderId = props.params.orderId;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/store/orders?id=${orderId}`);
        const data = await res.json();
        if (res.ok && data.length > 0) {
          setOrder(data[0]);
        } else {
          toast.error("Pedido não encontrado");
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Erro ao buscar pedido:", error);
        toast.error("Erro ao carregar pedido");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  async function handlePayment() {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/store/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, paymentMethod }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao processar pagamento");
      }

      toast.success("Pagamento confirmado! Redirecionando...");
      setTimeout(() => {
        window.location.href = `/sucesso?orderId=${orderId}`;
      }, 1500);
    } catch (error) {
      console.error("Erro:", error);
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  }

  if (loading) {
    return (
      <StoreLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-purple-500" size={48} />
        </div>
      </StoreLayout>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <StoreLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] py-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Finalizar Pagamento
            </h1>
            <p className="text-gray-400">Pedido #{orderId}</p>
          </div>

          {/* Order Summary */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Resumo do Pedido
            </h2>
            <div className="space-y-3">
              {JSON.parse(order.items).map((item, index) => (
                <div key={index} className="flex justify-between text-gray-300">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span className="text-white font-semibold">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-3 mt-3">
                <div className="flex justify-between text-lg font-bold text-white">
                  <span>Total</span>
                  <span>R$ {parseFloat(order.total_amount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Método de Pagamento
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod("pix")}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === "pix"
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Smartphone className="text-white" size={24} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-semibold">PIX</p>
                  <p className="text-gray-400 text-sm">Aprovação instantânea</p>
                </div>
                {paymentMethod === "pix" && (
                  <CheckCircle2 className="text-purple-500" size={24} />
                )}
              </button>

              <button
                onClick={() => setPaymentMethod("credit_card")}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === "credit_card"
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <CreditCard className="text-white" size={24} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-semibold">Cartão de Crédito</p>
                  <p className="text-gray-400 text-sm">
                    Parcelamento disponível
                  </p>
                </div>
                {paymentMethod === "credit_card" && (
                  <CheckCircle2 className="text-purple-500" size={24} />
                )}
              </button>
            </div>
          </div>

          {/* PIX Demo */}
          {paymentMethod === "pix" && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center mb-4">
                  <QrCode size={160} className="text-gray-800" />
                </div>
                <p className="text-gray-400 text-sm text-center mb-2">
                  Escaneie o QR Code com o app do seu banco
                </p>
                <code className="bg-black/50 text-purple-400 px-4 py-2 rounded-lg text-xs break-all text-center">
                  00020126580014BR.GOV.BCB.PIX0136{orderId}520400005303986540
                  {order.total_amount}5802BR5913StreamHub6009SAO
                  PAULO62070503***6304XXXX
                </code>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processando...
                </>
              ) : (
                <>
                  Confirmar Pagamento
                  <CheckCircle2 size={20} />
                </>
              )}
            </button>
            <p className="text-center text-sm text-gray-400">
              Este é um ambiente de demonstração. O pagamento será confirmado
              instantaneamente.
            </p>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
