"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/app/admin-layout";
import {
  Plus,
  Trash2,
  Megaphone,
  ToggleLeft as Toggle,
  ToggleRight,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminMarketing() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discount_percentage: "",
    active: true,
  });

  const { data: coupons } = useQuery({
    queryKey: ["coupons"],
    queryFn: () => fetch("/api/store/coupons").then((res) => res.json()),
  });

  const createMutation = useMutation({
    mutationFn: (newCoupon) =>
      fetch("/api/store/coupons", {
        method: "POST",
        body: JSON.stringify(newCoupon),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      setIsModalOpen(false);
      toast.success("Cupom criado!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => fetch(`/api/store/coupons/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      toast.success("Cupom removido.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter font-sora">
              Marketing
            </h1>
            <p className="text-gray-500">
              Gerencie seus cupons de desconto e promoções.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="h-14 px-8 bg-black text-white rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus size={20} /> Novo Cupom
          </button>
        </header>

        <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest">
                  <th className="px-8 py-4 font-bold">Código</th>
                  <th className="px-8 py-4 font-bold">Desconto</th>
                  <th className="px-8 py-4 font-bold">Status</th>
                  <th className="px-8 py-4 font-bold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {coupons?.map((coupon) => (
                  <tr
                    key={coupon.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-8 py-6 font-bold text-sm uppercase tracking-wider">
                      {coupon.code}
                    </td>
                    <td className="px-8 py-6 font-bold text-sm text-green-600">
                      {coupon.discount_percentage}%
                    </td>
                    <td className="px-8 py-6">
                      <div
                        className={`flex items-center gap-2 text-xs font-bold uppercase ${coupon.active ? "text-green-500" : "text-gray-400"}`}
                      >
                        {coupon.active ? (
                          <ToggleRight size={20} />
                        ) : (
                          <Toggle size={20} />
                        )}
                        {coupon.active ? "Ativo" : "Inativo"}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <button
                        onClick={() => deleteMutation.mutate(coupon.id)}
                        className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl p-8 lg:p-12">
            <h2 className="text-3xl font-bold mb-8 tracking-tighter">
              Novo Cupom
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Código do Cupom
                </label>
                <input
                  required
                  placeholder="EX: VERÃO20"
                  className="w-full h-14 px-4 rounded-2xl border bg-gray-50 outline-none focus:ring-2 ring-black font-bold uppercase tracking-widest"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Porcentagem de Desconto
                </label>
                <input
                  required
                  type="number"
                  placeholder="20"
                  className="w-full h-14 px-4 rounded-2xl border bg-gray-50 outline-none focus:ring-2 ring-black"
                  value={formData.discount_percentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discount_percentage: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-14 border rounded-2xl font-bold hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 h-14 bg-black text-white rounded-2xl font-bold hover:opacity-90"
                >
                  Criar Cupom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
