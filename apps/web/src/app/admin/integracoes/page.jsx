"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/app/admin-layout";
import { Save, MessageCircle, BarChart, Facebook } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function AdminIntegrations() {
  const queryClient = useQueryClient();
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => fetch("/api/store/settings").then((res) => res.json()),
  });

  const [formData, setFormData] = useState({
    whatsapp_number: "",
    facebook_pixel_id: "",
    google_analytics_id: "",
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        whatsapp_number: settings.whatsapp_number || "",
        facebook_pixel_id: settings.facebook_pixel_id || "",
        google_analytics_id: settings.google_analytics_id || "",
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
      toast.success("Integrações atualizadas!");
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
            Integrações
          </h1>
          <p className="text-gray-500">
            Conecte sua loja com ferramentas de rastreamento e comunicação.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* WhatsApp */}
            <div className="bg-white p-8 rounded-[32px] border shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <MessageCircle size={20} />
                </div>
                <h2 className="font-bold">WhatsApp</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Número do WhatsApp
                  </label>
                  <input
                    placeholder="Ex: 5511999999999"
                    className="w-full h-12 px-4 rounded-xl border bg-gray-50 outline-none focus:ring-2 ring-black font-mono"
                    value={formData.whatsapp_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        whatsapp_number: e.target.value,
                      })
                    }
                  />
                  <p className="text-[10px] text-gray-400 italic">
                    * Apenas números, com DDD e código do país.
                  </p>
                </div>
              </div>
            </div>

            {/* Google Analytics */}
            <div className="bg-white p-8 rounded-[32px] border shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <BarChart size={20} />
                </div>
                <h2 className="font-bold">Google Analytics</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Tracking ID (GA4)
                  </label>
                  <input
                    placeholder="G-XXXXXXXXXX"
                    className="w-full h-12 px-4 rounded-xl border bg-gray-50 outline-none focus:ring-2 ring-black font-mono"
                    value={formData.google_analytics_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        google_analytics_id: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Facebook Pixel */}
            <div className="bg-white p-8 rounded-[32px] border shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Facebook size={20} />
                </div>
                <h2 className="font-bold">Facebook Pixel</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Pixel ID
                  </label>
                  <input
                    placeholder="1234567890"
                    className="w-full h-12 px-4 rounded-xl border bg-gray-50 outline-none focus:ring-2 ring-black font-mono"
                    value={formData.facebook_pixel_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        facebook_pixel_id: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={mutation.isLoading}
              className="h-16 px-12 bg-black text-white rounded-2xl font-bold flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <Save size={20} /> Salvar Integrações
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
