"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/app/admin-layout";
import { Save, CreditCard, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function AdminConfigGate() {
  const queryClient = useQueryClient();
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => fetch("/api/store/settings").then((res) => res.json()),
  });

  const [formData, setFormData] = useState({
    stripe_public_key: "",
    stripe_secret_key: "",
    mercado_pago_public_key: "",
    mercado_pago_access_token: "",
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        stripe_public_key: settings.stripe_public_key || "",
        stripe_secret_key: settings.stripe_secret_key || "",
        mercado_pago_public_key: settings.mercado_pago_public_key || "",
        mercado_pago_access_token: settings.mercado_pago_access_token || "",
      });
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: (newSettings) =>
      fetch("/api/store/settings", {
        method: "PUT",
        body: JSON.stringify({ ...settings, ...newSettings }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["settings"]);
      toast.success("Configurações de pagamento atualizadas!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-12">
        <header>
          <h1 className="text-4xl font-bold tracking-tighter font-sora">
            Configuração de Pagamento
          </h1>
          <p className="text-gray-500">
            Configure suas chaves de API para processar pagamentos.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Stripe */}
          <div className="bg-white p-8 rounded-[32px] border shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <CreditCard size={20} />
              </div>
              <h2 className="font-bold">Stripe</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Public Key
                </label>
                <input
                  type="password"
                  placeholder="pk_live_..."
                  className="w-full h-12 px-4 rounded-xl border bg-gray-50 outline-none focus:ring-2 ring-black font-mono"
                  value={formData.stripe_public_key}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stripe_public_key: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Secret Key
                </label>
                <input
                  type="password"
                  placeholder="sk_live_..."
                  className="w-full h-12 px-4 rounded-xl border bg-gray-50 outline-none focus:ring-2 ring-black font-mono"
                  value={formData.stripe_secret_key}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stripe_secret_key: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Mercado Pago */}
          <div className="bg-white p-8 rounded-[32px] border shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <ShieldCheck size={20} />
              </div>
              <h2 className="font-bold">Mercado Pago</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Public Key
                </label>
                <input
                  type="password"
                  placeholder="APP_USR-..."
                  className="w-full h-12 px-4 rounded-xl border bg-gray-50 outline-none focus:ring-2 ring-black font-mono"
                  value={formData.mercado_pago_public_key}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mercado_pago_public_key: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Access Token
                </label>
                <input
                  type="password"
                  placeholder="APP_USR-..."
                  className="w-full h-12 px-4 rounded-xl border bg-gray-50 outline-none focus:ring-2 ring-black font-mono"
                  value={formData.mercado_pago_access_token}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mercado_pago_access_token: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={mutation.isLoading}
              className="h-16 px-12 bg-black text-white rounded-2xl font-bold flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <Save size={20} /> Salvar Gateway
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
