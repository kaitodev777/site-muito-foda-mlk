"use client";

import { useState, useEffect } from "react";
import StoreLayout from "@/app/store-layout";
import {
  Package,
  Mail,
  Calendar,
  Check,
  X,
  Eye,
  EyeOff,
  Copy,
  Check as CheckIcon,
} from "lucide-react";
import { toast } from "sonner";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [copiedFields, setCopiedFields] = useState({});

  useEffect(() => {
    const savedEmail = localStorage.getItem("customer_email");
    if (savedEmail) {
      setEmail(savedEmail);
      fetchOrders(savedEmail);
    } else {
      setIsLoading(false);
    }
  }, []);

  async function fetchOrders(customerEmail) {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/customer/orders?email=${encodeURIComponent(customerEmail)}`,
      );
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        setHasSearched(true);
        localStorage.setItem("customer_email", customerEmail);
      } else {
        toast.error("Erro ao buscar pedidos");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Erro ao buscar pedidos");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    if (!email) {
      toast.error("Digite seu e-mail");
      return;
    }
    fetchOrders(email);
  }

  function togglePasswordVisibility(orderId, productId) {
    const key = `${orderId}-${productId}`;
    setVisiblePasswords((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  async function copyToClipboard(text, field) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFields((prev) => ({ ...prev, [field]: true }));
      toast.success("Copiado!");
      setTimeout(() => {
        setCopiedFields((prev) => ({ ...prev, [field]: false }));
      }, 2000);
    } catch (err) {
      toast.error("Erro ao copiar");
    }
  }

  function getStatusColor(status) {
    const colors = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  }

  function getStatusText(status) {
    const texts = {
      completed: "Concluído",
      pending: "Pendente",
      failed: "Falhou",
    };
    return texts[status] || status;
  }

  if (isLoading) {
    return (
      <StoreLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div
              className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"
              style={{
                animation: "spin 1s linear infinite",
              }}
            />
            <p className="text-gray-400">Carregando seus pedidos...</p>
            <style jsx global>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      </StoreLayout>
    );
  }

  if (!hasSearched) {
    return (
      <StoreLayout>
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Package className="text-white" size={28} />
              </div>
              <h1 className="text-2xl font-bold text-white">Minhas Compras</h1>
              <p className="text-gray-400">
                Digite seu e-mail para ver seus pedidos
              </p>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  E-mail
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 ring-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Buscar Meus Pedidos
              </button>
            </form>
          </div>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="min-h-screen bg-[#0f0f0f] py-20">
        <div className="max-w-5xl mx-auto px-4 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Minhas Compras
              </h1>
              <p className="text-gray-400">
                <Mail size={16} className="inline mr-2" />
                {email}
              </p>
            </div>
            <button
              onClick={() => {
                setEmail("");
                setHasSearched(false);
                setOrders([]);
                localStorage.removeItem("customer_email");
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl transition-all"
            >
              Trocar E-mail
            </button>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
              <Package size={48} className="text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Nenhum pedido encontrado
              </h3>
              <p className="text-gray-400">
                Você ainda não realizou nenhuma compra com este e-mail.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-6"
                >
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">
                        Pedido #{order.id}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar size={14} />
                        {new Date(order.created_at).toLocaleDateString(
                          "pt-BR",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Total</div>
                        <div className="text-2xl font-bold text-white">
                          R$ {parseFloat(order.total_amount).toFixed(2)}
                        </div>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-xl text-sm font-bold ${getStatusColor(order.status)}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>

                  {/* Products and Credentials */}
                  <div className="space-y-4">
                    {order.items.map((item, idx) => {
                      const credentials = order.credentials_sent?.[idx];
                      const passwordKey = `${order.id}-${item.product_id}`;
                      const isPasswordVisible = visiblePasswords[passwordKey];

                      return (
                        <div
                          key={idx}
                          className="bg-white/5 rounded-xl p-5 space-y-4"
                        >
                          <div className="flex items-center gap-4">
                            {item.image_url && (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-bold text-white">
                                {item.name}
                              </h4>
                              <p className="text-sm text-gray-400">
                                {item.quantity}x R${" "}
                                {parseFloat(item.price).toFixed(2)}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-white">
                                R${" "}
                                {(
                                  item.quantity * parseFloat(item.price)
                                ).toFixed(2)}
                              </div>
                            </div>
                          </div>

                          {/* Credentials */}
                          {credentials ? (
                            <div className="pt-4 border-t border-white/10 space-y-3">
                              <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                                <Check size={16} />
                                Credenciais Enviadas
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Username */}
                                <div className="bg-white/5 rounded-lg p-3">
                                  <div className="text-xs text-gray-400 mb-1">
                                    Login/Usuário
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <code className="flex-1 text-white font-mono text-sm break-all">
                                      {credentials.username ||
                                        credentials.email}
                                    </code>
                                    <button
                                      onClick={() =>
                                        copyToClipboard(
                                          credentials.username ||
                                            credentials.email,
                                          `user-${passwordKey}`,
                                        )
                                      }
                                      className="p-2 hover:bg-white/10 rounded transition-colors"
                                      title="Copiar"
                                    >
                                      {copiedFields[`user-${passwordKey}`] ? (
                                        <CheckIcon
                                          size={16}
                                          className="text-green-400"
                                        />
                                      ) : (
                                        <Copy
                                          size={16}
                                          className="text-gray-400"
                                        />
                                      )}
                                    </button>
                                  </div>
                                </div>

                                {/* Password */}
                                <div className="bg-white/5 rounded-lg p-3">
                                  <div className="text-xs text-gray-400 mb-1">
                                    Senha
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <code className="flex-1 text-white font-mono text-sm break-all">
                                      {isPasswordVisible
                                        ? credentials.password
                                        : "••••••••"}
                                    </code>
                                    <button
                                      onClick={() =>
                                        togglePasswordVisibility(
                                          order.id,
                                          item.product_id,
                                        )
                                      }
                                      className="p-2 hover:bg-white/10 rounded transition-colors"
                                      title={
                                        isPasswordVisible
                                          ? "Ocultar"
                                          : "Mostrar"
                                      }
                                    >
                                      {isPasswordVisible ? (
                                        <EyeOff
                                          size={16}
                                          className="text-gray-400"
                                        />
                                      ) : (
                                        <Eye
                                          size={16}
                                          className="text-gray-400"
                                        />
                                      )}
                                    </button>
                                    <button
                                      onClick={() =>
                                        copyToClipboard(
                                          credentials.password,
                                          `pass-${passwordKey}`,
                                        )
                                      }
                                      className="p-2 hover:bg-white/10 rounded transition-colors"
                                      title="Copiar"
                                    >
                                      {copiedFields[`pass-${passwordKey}`] ? (
                                        <CheckIcon
                                          size={16}
                                          className="text-green-400"
                                        />
                                      ) : (
                                        <Copy
                                          size={16}
                                          className="text-gray-400"
                                        />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {credentials.notes && (
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                                  <div className="text-xs text-blue-400 mb-1 font-semibold">
                                    Observações
                                  </div>
                                  <p className="text-sm text-blue-200">
                                    {credentials.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="pt-4 border-t border-white/10">
                              <div className="flex items-center gap-2 text-yellow-400 text-sm">
                                <X size={16} />
                                Aguardando envio das credenciais
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StoreLayout>
  );
}
