"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/app/admin-layout";
import {
  Users,
  UserPlus,
  Key,
  Trash2,
  Shield,
  Crown,
  User,
} from "lucide-react";
import { toast } from "sonner";

export default function TeamManagementPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "ADMIN",
  });
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        toast.error("Sem permissão para acessar");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Erro ao carregar usuários");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateUser(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        toast.success("Usuário criado com sucesso!");
        setShowCreateModal(false);
        setNewUser({ username: "", email: "", password: "", role: "ADMIN" });
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erro ao criar usuário");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Erro ao criar usuário");
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          password: newPassword,
        }),
      });

      if (res.ok) {
        toast.success("Senha redefinida com sucesso!");
        setShowPasswordModal(false);
        setNewPassword("");
        setSelectedUser(null);
      } else {
        const data = await res.json();
        toast.error(data.error || "Erro ao redefinir senha");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Erro ao redefinir senha");
    }
  }

  async function handleDeleteUser(userId) {
    if (!confirm("Tem certeza que deseja deletar este usuário?")) return;

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        toast.success("Usuário deletado com sucesso!");
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erro ao deletar usuário");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Erro ao deletar usuário");
    }
  }

  async function handleToggleActive(user) {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          active: !user.active,
        }),
      });

      if (res.ok) {
        toast.success(
          `Usuário ${!user.active ? "ativado" : "desativado"} com sucesso!`,
        );
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erro ao atualizar usuário");
      }
    } catch (error) {
      console.error("Error toggling user:", error);
      toast.error("Erro ao atualizar usuário");
    }
  }

  function getRoleIcon(role) {
    switch (role) {
      case "OWNER":
        return <Crown className="text-yellow-500" size={20} />;
      case "ADMIN":
        return <Shield className="text-blue-500" size={20} />;
      default:
        return <User className="text-gray-400" size={20} />;
    }
  }

  function getRoleBadge(role) {
    const colors = {
      OWNER: "bg-yellow-100 text-yellow-800 border-yellow-300",
      ADMIN: "bg-blue-100 text-blue-800 border-blue-300",
      USER: "bg-gray-100 text-gray-800 border-gray-300",
    };
    return colors[role] || colors.USER;
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-500">Carregando equipe...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter mb-2">
              Gerenciar Equipe
            </h1>
            <p className="text-gray-500">
              Gerencie usuários, permissões e senhas
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-bold hover:opacity-90 transition-all"
          >
            <UserPlus size={20} />
            Novo Usuário
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Permissão
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Último Login
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getRoleIcon(user.role)}
                        <span className="font-semibold">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getRoleBadge(user.role)}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {user.last_login
                        ? new Date(user.last_login).toLocaleString("pt-BR")
                        : "Nunca"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(user)}
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.active ? "Ativo" : "Inativo"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowPasswordModal(true);
                          }}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Redefinir senha"
                        >
                          <Key size={18} className="text-blue-600" />
                        </button>
                        {user.role !== "OWNER" && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Deletar usuário"
                          >
                            <Trash2 size={18} className="text-red-600" />
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

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Criar Novo Usuário</h2>
              <p className="text-gray-500 text-sm">Preencha os dados abaixo</p>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Username
                </label>
                <input
                  required
                  type="text"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 ring-black"
                  placeholder="admin_joao"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 ring-black"
                  placeholder="joao@streamhub.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Senha
                </label>
                <input
                  required
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 ring-black"
                  placeholder="********"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Permissão
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 ring-black"
                >
                  <option value="USER">USER - Cliente</option>
                  <option value="ADMIN">ADMIN - Funcionário</option>
                  <option value="OWNER">OWNER - Dono</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 border rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-black text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
                >
                  Criar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Redefinir Senha</h2>
              <p className="text-gray-500 text-sm">
                Usuário: <strong>{selectedUser.username}</strong>
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Nova Senha
                </label>
                <input
                  required
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 ring-black"
                  placeholder="********"
                  minLength={6}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setSelectedUser(null);
                    setNewPassword("");
                  }}
                  className="flex-1 px-4 py-3 border rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-black text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
                >
                  Redefinir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
