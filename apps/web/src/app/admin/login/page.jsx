"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Lock, User } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("admin_token", data.token);
        toast.success("Bem-vindo, Administrador!");
        window.location.href = "/admin/dashboard";
      } else {
        toast.error("Credenciais inválidas.");
      }
    } catch (error) {
      toast.error("Erro ao realizar login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F3F3]">
      <div className="w-full max-w-md bg-white p-12 rounded-[32px] shadow-xl space-y-8 border">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter font-sora">
            Painel Admin
          </h1>
          <p className="text-gray-500">Entre com suas credenciais de acesso.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                required
                placeholder="Usuário"
                className="w-full h-14 pl-12 pr-4 rounded-2xl border bg-gray-50 outline-none focus:ring-2 ring-black"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                required
                type="password"
                placeholder="Senha"
                className="w-full h-14 pl-12 pr-4 rounded-2xl border bg-gray-50 outline-none focus:ring-2 ring-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            disabled={isLoading}
            className="w-full h-14 bg-black text-white rounded-2xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "Entrando..." : "Entrar no Painel"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">admin / admin</p>
      </div>
    </div>
  );
}
