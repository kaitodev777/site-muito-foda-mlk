"use client";

import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/app/admin-layout";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function AdminDashboard() {
  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetch("/api/store/orders").then((res) => res.json()),
  });

  const totalSales =
    orders?.reduce((acc, order) => acc + parseFloat(order.total_amount), 0) ||
    0;
  const orderCount = orders?.length || 0;

  const stats = [
    {
      name: "Vendas Totais",
      value: `R$ ${totalSales.toFixed(2)}`,
      icon: DollarSign,
      trend: "+12.5%",
      positive: true,
    },
    {
      name: "Pedidos",
      value: orderCount,
      icon: ShoppingBag,
      trend: "+8.2%",
      positive: true,
    },
    {
      name: "Visitantes",
      value: "12,450",
      icon: Users,
      trend: "-2.4%",
      positive: false,
    },
    {
      name: "Taxa de Conversão",
      value: "3.2%",
      icon: TrendingUp,
      trend: "+0.5%",
      positive: true,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-12">
        <header>
          <h1 className="text-4xl font-bold tracking-tighter font-sora">
            Dashboard
          </h1>
          <p className="text-gray-500">
            Bem-vindo de volta! Aqui está o resumo da sua loja.
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white p-8 rounded-[32px] border shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gray-50 rounded-2xl">
                  <stat.icon size={24} />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-bold ${stat.positive ? "text-green-500" : "text-red-500"}`}
                >
                  {stat.trend}{" "}
                  {stat.positive ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">{stat.name}</p>
                <p className="text-3xl font-bold tracking-tight">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden">
          <div className="p-8 border-b flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              Pedidos Recentes
            </h2>
            <button className="text-sm font-bold text-gray-400 hover:text-black transition-colors">
              Ver todos
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest">
                  <th className="px-8 py-4 font-bold">Cliente</th>
                  <th className="px-8 py-4 font-bold">Status</th>
                  <th className="px-8 py-4 font-bold">Total</th>
                  <th className="px-8 py-4 font-bold">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders?.slice(0, 5).map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <p className="font-bold text-sm">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">
                        {order.customer_email}
                      </p>
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
                    <td className="px-8 py-6 font-bold text-sm">
                      R$ {parseFloat(order.total_amount).toFixed(2)}
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
