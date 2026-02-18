"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/app/admin-layout";
import { Star, Check, X, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminReviews() {
  const queryClient = useQueryClient();
  const { data: reviews } = useQuery({
    queryKey: ["reviews", "all"],
    queryFn: () =>
      fetch("/api/store/reviews?all=true").then((res) => res.json()),
  });

  const mutation = useMutation({
    mutationFn: ({ id, approved }) =>
      fetch("/api/store/reviews", {
        method: "PUT",
        body: JSON.stringify({ id, approved }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", "all"]);
      toast.success("Status da avaliação atualizado!");
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-4xl font-bold tracking-tighter font-sora">
            Avaliações
          </h1>
          <p className="text-gray-500">
            Modere as opiniões dos clientes sobre seus produtos.
          </p>
        </header>

        <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest">
                  <th className="px-8 py-4 font-bold">Autor</th>
                  <th className="px-8 py-4 font-bold">Comentário</th>
                  <th className="px-8 py-4 font-bold">Rating</th>
                  <th className="px-8 py-4 font-bold">Status</th>
                  <th className="px-8 py-4 font-bold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {reviews?.map((review) => (
                  <tr
                    key={review.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-8 py-6 font-bold text-sm">
                      {review.author}
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-500 max-w-xs truncate">
                      {review.comment}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className="fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          review.approved
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {review.approved ? "Aprovado" : "Oculto"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {!review.approved ? (
                          <button
                            onClick={() =>
                              mutation.mutate({ id: review.id, approved: true })
                            }
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <Check size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              mutation.mutate({
                                id: review.id,
                                approved: false,
                              })
                            }
                            className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>
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
