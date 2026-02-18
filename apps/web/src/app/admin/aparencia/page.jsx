"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/app/admin-layout";
import { Save, Layout, Palette, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function AdminAppearance() {
  const queryClient = useQueryClient();
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => fetch("/api/store/settings").then((res) => res.json()),
  });

  const [formData, setFormData] = useState({
    store_name: "",
    primary_color: "",
    banner_url: "",
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        store_name: settings.store_name || "",
        primary_color: settings.primary_color || "",
        banner_url: settings.banner_url || "",
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
      toast.success("Aparência atualizada!");
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
            Aparência
          </h1>
          <p className="text-gray-500">
            Personalize a identidade visual da sua vitrine.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Store Info */}
            <div className="bg-white p-8 rounded-[32px] border shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Layout size={20} />
                </div>
                <h2 className="font-bold">Informações Básicas</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Nome da Loja
                  </label>
                  <input
                    className="w-full h-12 px-4 rounded-xl border bg-gray-50 outline-none focus:ring-2 ring-black"
                    value={formData.store_name}
                    onChange={(e) =>
                      setFormData({ ...formData, store_name: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Theme */}
            <div className="bg-white p-8 rounded-[32px] border shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Palette size={20} />
                </div>
                <h2 className="font-bold">Tema</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Cor Principal (HEX)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      className="w-12 h-12 rounded-xl border p-1 bg-white cursor-pointer"
                      value={formData.primary_color}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          primary_color: e.target.value,
                        })
                      }
                    />
                    <input
                      className="flex-1 h-12 px-4 rounded-xl border bg-gray-50 outline-none focus:ring-2 ring-black font-mono"
                      value={formData.primary_color}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          primary_color: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Banner */}
          <div className="bg-white p-8 rounded-[32px] border shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-50 rounded-lg">
                <ImageIcon size={20} />
              </div>
              <h2 className="font-bold">Banner Principal</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  URL da Imagem
                </label>
                <input
                  className="w-full h-12 px-4 rounded-xl border bg-gray-50 outline-none focus:ring-2 ring-black"
                  value={formData.banner_url}
                  onChange={(e) =>
                    setFormData({ ...formData, banner_url: e.target.value })
                  }
                />
              </div>
              {formData.banner_url && (
                <div className="aspect-[21/9] rounded-2xl overflow-hidden border">
                  <img
                    src={formData.banner_url}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={mutation.isLoading}
              className="h-16 px-12 bg-black text-white rounded-2xl font-bold flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <Save size={20} /> Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
