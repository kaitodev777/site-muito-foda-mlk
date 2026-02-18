"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/app/admin-layout";
import {
  Activity,
  Filter,
  Search,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/admin/logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
      } else {
        toast.error("Sem permissão para acessar logs");
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("Erro ao carregar logs");
    } finally {
      setIsLoading(false);
    }
  }

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterAction === "all" || log.action === filterAction;

    return matchesSearch && matchesFilter;
  });

  const uniqueActions = [...new Set(logs.map((log) => log.action))];

  function getActionColor(action) {
    const colors = {
      LOGIN: "bg-green-100 text-green-800",
      LOGOUT: "bg-gray-100 text-gray-800",
      CREATE_USER: "bg-blue-100 text-blue-800",
      UPDATE_USER: "bg-yellow-100 text-yellow-800",
      DELETE_USER: "bg-red-100 text-red-800",
      FIRST_LOGIN: "bg-purple-100 text-purple-800",
      UPDATE_PRODUCT: "bg-indigo-100 text-indigo-800",
      DELETE_PRODUCT: "bg-red-100 text-red-800",
      UPDATE_SETTINGS: "bg-orange-100 text-orange-800",
    };
    return colors[action] || "bg-gray-100 text-gray-800";
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Agora mesmo";
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-500">Carregando logs...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tighter mb-2">
            Logs do Sistema
          </h1>
          <p className="text-gray-500">
            Auditoria completa de todas as ações realizadas
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm font-semibold">
                Total de Logs
              </span>
              <Activity size={20} className="text-gray-400" />
            </div>
            <div className="text-3xl font-bold">{logs.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm font-semibold">Hoje</span>
              <Calendar size={20} className="text-gray-400" />
            </div>
            <div className="text-3xl font-bold">
              {
                logs.filter((log) => {
                  const logDate = new Date(log.created_at);
                  const today = new Date();
                  return logDate.toDateString() === today.toDateString();
                }).length
              }
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm font-semibold">
                Usuários Ativos
              </span>
              <User size={20} className="text-gray-400" />
            </div>
            <div className="text-3xl font-bold">
              {new Set(logs.map((log) => log.user_id)).size}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm font-semibold">
                Tipos de Ação
              </span>
              <FileText size={20} className="text-gray-400" />
            </div>
            <div className="text-3xl font-bold">{uniqueActions.length}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por usuário, ação ou detalhes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 ring-black"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-4 py-2.5 border rounded-xl outline-none focus:ring-2 ring-black"
            >
              <option value="all">Todas as Ações</option>
              {uniqueActions.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Logs List */}
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Data/Hora
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Ação
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Detalhes
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    IP
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {formatDate(log.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {log.username?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-sm">
                            {log.username}
                          </div>
                          <div className="text-xs text-gray-500">
                            {log.user_role}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getActionColor(log.action)}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                      {log.details || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                      {log.ip_address || "-"}
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      Nenhum log encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
