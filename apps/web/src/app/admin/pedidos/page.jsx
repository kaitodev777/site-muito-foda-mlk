"use client";

import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/app/admin-layout";
import { ShoppingBag, Eye, Calendar, User } from "lucide-react";
import { useState } from "react";

export default function AdminOrders() {
  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetch("/api/store/orders").then((res) => res.json()),
  });

  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-4xl font-bold tracking-tighter font-sora">
            Pedidos
          </h1>
          <p className="text-gray-500">
            Monitore todas as vendas e status de entrega.
          </p>
        </header>

        <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest">
                  <th className="px-8 py-4 font-bold">Pedido ID</th>
                  <th className="px-8 py-4 font-bold">Cliente</th>
                  <th className="px-8 py-4 font-bold">Total</th>
                  <th className="px-8 py-4 font-bold">Status</th>
                  <th className="px-8 py-4 font-bold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders?.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-8 py-6 font-mono text-xs text-gray-400">
                      #ORD-{order.id.toString().padStart(4, "0")}
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-sm">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">
                        {order.customer_email}
                      </p>
                    </td>
                    <td className="px-8 py-6 font-bold text-sm">
                      R$ {parseFloat(order.total_amount).toFixed(2)}
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === "paid"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {order.status === "paid" ? "Pago" : "Pendente"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl p-8 lg:p-12 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold tracking-tighter">
                Detalhes do Pedido
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-12">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Cliente
                </p>
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <p className="font-bold">{selectedOrder.customer_name}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Data
                </p>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <p className="font-bold">
                    {new Date(selectedOrder.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-12">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Itens
              </p>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg overflow-hidden border">
                        <img
                          src={item.image_url}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-xs text-gray-400">
                          {item.quantity}x R${" "}
                          {parseFloat(item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Total do Pedido
                </p>
                <p className="text-3xl font-bold">
                  R$ {parseFloat(selectedOrder.total_amount).toFixed(2)}
                </p>
              </div>
              <span
                className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${
                  selectedOrder.status === "paid"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {selectedOrder.status === "paid" ? "Pago" : "Pendente"}
              </span>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function X({ size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
