"use client";

import { useState, useEffect } from "react";
import StoreLayout from "@/app/store-layout";
import {
  Mail,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // Obter e-mail da URL
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get("email");
      if (emailParam) {
        setEmail(emailParam);
      } else {
        window.location.href = "/login";
      }
    }
  }, []);

  const handleCodeChange = (index, value) => {
    // Apenas números
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focar no próximo input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    const newCode = pastedData.slice(0, 6).split("");
    while (newCode.length < 6) newCode.push("");
    setCode(newCode);

    // Focar no último dígito preenchido
    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    const input = document.getElementById(`code-${lastFilledIndex}`);
    if (input) input.focus();
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      toast.error("Digite o código completo");
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch("/api/auth/customer/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: fullCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao verificar código");
      }

      // Salvar token e dados do usuário
      localStorage.setItem("customer_token", data.token);
      localStorage.setItem("customer_name", data.user.name);
      localStorage.setItem("customer_email", data.user.email);

      toast.success("E-mail verificado com sucesso!");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      console.error("Erro:", error);
      toast.error(error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const res = await fetch("/api/auth/customer/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao reenviar código");
      }

      toast.success("Novo código enviado!");
      setCode(["", "", "", "", "", ""]);
      const firstInput = document.getElementById("code-0");
      if (firstInput) firstInput.focus();
    } catch (error) {
      console.error("Erro:", error);
      toast.error(error.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <StoreLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-white" size={40} />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Verifique seu E-mail
            </h1>
            <p className="text-gray-400">
              Enviamos um código de verificação para
            </p>
            <p className="text-purple-400 font-semibold mt-1">{email}</p>
          </div>

          {/* Code Input */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-6">
            <label className="block text-white font-semibold mb-4 text-center">
              Digite o código de 6 dígitos
            </label>
            <div className="flex gap-3 justify-center mb-6">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-14 text-center text-2xl font-bold bg-black/50 border-2 border-white/20 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-all"
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              disabled={isVerifying || code.join("").length !== 6}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Verificando...
                </>
              ) : (
                <>
                  Verificar E-mail
                  <CheckCircle2 size={20} />
                </>
              )}
            </button>
          </div>

          {/* Resend */}
          <div className="text-center space-y-4">
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-gray-400 hover:text-white transition-all flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
            >
              <RefreshCw
                className={isResending ? "animate-spin" : ""}
                size={16}
              />
              {isResending ? "Enviando..." : "Reenviar código"}
            </button>
            <a
              href="/login"
              className="text-purple-400 hover:text-purple-300 transition-all flex items-center justify-center gap-2"
            >
              Voltar para login
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Info */}
          <div className="mt-8 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
            <p className="text-sm text-gray-300 text-center">
              💡 O código expira em 15 minutos. Verifique sua caixa de spam se
              não receber o e-mail.
            </p>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
