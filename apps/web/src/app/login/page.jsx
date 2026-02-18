"use client";

import { useState, useEffect } from "react";
import StoreLayout from "@/app/store-layout";
import { Lock, User, Mail, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";

export default function CustomerLoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  useEffect(() => {
    // Se já está logado, redirecionar
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("customer_token");
      if (token) {
        window.location.href = "/minhas-compras";
      }
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isLogin
        ? "/api/auth/customer/login"
        : "/api/auth/customer/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // Verificar se precisa de verificação de e-mail
        if (data.needsVerification && data.email) {
          toast.error(data.error || "E-mail não verificado");
          setTimeout(() => {
            window.location.href = `/verificar-email?email=${encodeURIComponent(data.email)}`;
          }, 1500);
          return;
        }
        throw new Error(data.error || "Erro ao processar solicitação");
      }

      // Se for registro, redirecionar para verificação
      if (!isLogin && data.needsVerification) {
        toast.success(data.message || "Código enviado para seu e-mail!");
        setTimeout(() => {
          window.location.href = `/verificar-email?email=${encodeURIComponent(data.email)}`;
        }, 1500);
        return;
      }

      // Login bem-sucedido
      localStorage.setItem("customer_token", data.token);
      localStorage.setItem("customer_email", data.user.email);
      localStorage.setItem("customer_name", data.user.name || data.user.email);

      toast.success("Login realizado com sucesso!");

      // Redirecionar para página anterior ou minhas compras
      const returnUrl =
        new URLSearchParams(window.location.search).get("return") ||
        "/minhas-compras";
      window.location.href = returnUrl;
    } catch (error) {
      console.error("Erro:", error);
      toast.error(error.message || "Erro ao processar solicitação");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <StoreLayout>
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              {isLogin ? (
                <LogIn className="text-white" size={28} />
              ) : (
                <UserPlus className="text-white" size={28} />
              )}
            </div>
            <h1 className="text-3xl font-bold text-white">
              {isLogin ? "Entrar" : "Criar Conta"}
            </h1>
            <p className="text-gray-400">
              {isLogin
                ? "Acesse sua conta para ver seus pedidos"
                : "Crie sua conta para fazer pedidos"}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                isLogin
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                !isLogin
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Cadastrar
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Seu nome"
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 ring-purple-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="seuemail@exemplo.com"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 ring-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Processando..."
                : isLogin
                  ? "Entrar"
                  : "Criar Conta"}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-gray-400">
            {isLogin ? (
              <>
                Não tem uma conta?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-purple-400 hover:text-purple-300 font-semibold"
                >
                  Cadastre-se
                </button>
              </>
            ) : (
              <>
                Já tem uma conta?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-purple-400 hover:text-purple-300 font-semibold"
                >
                  Faça login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
