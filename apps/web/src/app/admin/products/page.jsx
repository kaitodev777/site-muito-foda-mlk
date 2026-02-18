"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/app/admin-layout";
import { Plus, Edit, Trash2, Package, Search, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category: "",
    stock: "10",
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetch("/api/store/products").then((res) => res.json()),
  });

  const createMutation = useMutation({
    mutationFn: (newProduct) =>
      fetch("/api/store/products", {
        method: "POST",
        body: JSON.stringify(newProduct),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      setIsModalOpen(false);
      toast.success("Produto criado!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (product) =>
      fetch(`/api/store/products/${product.id}`, {
        method: "PUT",
        body: JSON.stringify(product),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      setIsModalOpen(false);
      toast.success("Produto atualizado!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) =>
      fetch(`/api/store/products/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      toast.success("Produto removido.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      updateMutation.mutate({ ...formData, id: editingProduct.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      category: product.category,
      stock: product.stock.toString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      image_url: "",
      category: "",
      stock: "10",
    });
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter font-sora">
              Produtos
            </h1>
            <p className="text-gray-500">Gerencie o inventário da sua loja.</p>
          </div>
          <button
            onClick={handleOpenNew}
            className="h-14 px-8 bg-black text-white rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus size={20} /> Novo Produto
          </button>
        </header>

        <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden">
          <div className="p-8 border-b">
            <div className="relative max-w-md">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                placeholder="Buscar produtos..."
                className="w-full h-12 pl-12 pr-4 rounded-xl border bg-gray-50 outline-none focus:ring-2 ring-black"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest">
                  <th className="px-8 py-4 font-bold">Produto</th>
                  <th className="px-8 py-4 font-bold">Preço</th>
                  <th className="px-8 py-4 font-bold">Estoque</th>
                  <th className="px-8 py-4 font-bold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products?.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-8 py-6 flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={product.image_url}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{product.name}</p>
                        <p className="text-xs text-gray-400">
                          {product.category}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-sm">
                      R$ {parseFloat(product.price).toFixed(2)}
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-medium text-sm">
                        {product.stock} un.
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(product.id)}
                          className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
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
          <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl p-8 lg:p-12 overflow-y-auto max-h-[90vh]">
            <h2 className="text-3xl font-bold mb-8 tracking-tighter">
              {editingProduct ? "Editar Produto" : "Novo Produto"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Nome
                  </label>
                  <input
                    required
                    className="w-full h-14 px-4 rounded-2xl border bg-gray-50 outline-none focus:ring-2 ring-black"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Categoria
                  </label>
                  <input
                    required
                    className="w-full h-14 px-4 rounded-2xl border bg-gray-50 outline-none focus:ring-2 ring-black"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Preço
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    className="w-full h-14 px-4 rounded-2xl border bg-gray-50 outline-none focus:ring-2 ring-black"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Estoque
                  </label>
                  <input
                    required
                    type="number"
                    className="w-full h-14 px-4 rounded-2xl border bg-gray-50 outline-none focus:ring-2 ring-black"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  URL da Imagem
                </label>
                <input
                  required
                  className="w-full h-14 px-4 rounded-2xl border bg-gray-50 outline-none focus:ring-2 ring-black"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Descrição
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full p-4 rounded-2xl border bg-gray-50 outline-none focus:ring-2 ring-black"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
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
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
