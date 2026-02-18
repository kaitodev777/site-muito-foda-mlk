"use client";

import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Menu,
  X,
  Sparkles,
  MoreVertical,
  Package,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import useCartStore from "@/store/useCartStore";
import CartDrawer from "./CartDrawer";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Verificar se está logado
    const token = localStorage.getItem("customer_token");
    const name = localStorage.getItem("customer_name");
    setIsLoggedIn(!!token);
    setCustomerName(name || "");
  }, []);

  function handleLogout() {
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer_email");
    localStorage.removeItem("customer_name");
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    window.location.href = "/";
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/80 backdrop-blur-xl border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="text-white" size={20} />
            </div>
            <span className="text-2xl font-bold text-white">
              Stream
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Hub
              </span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="/#produtos"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Produtos
            </a>
            <a
              href="/#como-funciona"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Como Funciona
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10 group"
              >
                {isLoggedIn ? (
                  <User
                    className="text-white group-hover:scale-110 transition-transform"
                    size={20}
                  />
                ) : (
                  <MoreVertical
                    className="text-white group-hover:scale-110 transition-transform"
                    size={20}
                  />
                )}
              </button>

              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                    {isLoggedIn ? (
                      <>
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-xs text-gray-400">Olá,</p>
                          <p className="text-sm font-semibold text-white truncate">
                            {customerName}
                          </p>
                        </div>
                        <a
                          href="/minhas-compras"
                          className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-all"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Package size={18} />
                          <span className="font-medium">Meus Pedidos</span>
                        </a>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <LogOut size={18} />
                          <span className="font-medium">Sair</span>
                        </button>
                      </>
                    ) : (
                      <a
                        href="/login"
                        className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-all"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <LogIn size={18} />
                        <span className="font-medium">Entrar</span>
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10 group"
            >
              <ShoppingCart
                className="text-white group-hover:scale-110 transition-transform"
                size={20}
              />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10"
            >
              {isMenuOpen ? (
                <X className="text-white" size={20} />
              ) : (
                <Menu className="text-white" size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10">
            <nav className="flex flex-col p-4 space-y-2">
              <a
                href="/#produtos"
                className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Produtos
              </a>
              <a
                href="/#como-funciona"
                className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Como Funciona
              </a>
              {isLoggedIn ? (
                <>
                  <a
                    href="/minhas-compras"
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Package size={18} />
                    Meus Pedidos
                  </a>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-left"
                  >
                    <LogOut size={18} />
                    Sair
                  </button>
                </>
              ) : (
                <a
                  href="/login"
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn size={18} />
                  Entrar
                </a>
              )}
            </nav>
          </div>
        )}
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
