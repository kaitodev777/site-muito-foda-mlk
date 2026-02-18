"use client";

import { Sparkles, Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-white">
                Stream
                <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Hub
                </span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Sua plataforma premium de streamings com entrega instantânea e
              segurança garantida.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Produtos</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/#produtos"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Netflix
                </a>
              </li>
              <li>
                <a
                  href="/#produtos"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Disney+
                </a>
              </li>
              <li>
                <a
                  href="/#produtos"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  HBO Max
                </a>
              </li>
              <li>
                <a
                  href="/#produtos"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Spotify
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/#como-funciona"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Como Funciona
                </a>
              </li>
              <li>
                <a
                  href="/admin"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Painel Admin
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Termos de Uso
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Privacidade
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Redes Sociais</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all border border-white/10"
              >
                <Instagram className="text-white" size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all border border-white/10"
              >
                <Facebook className="text-white" size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all border border-white/10"
              >
                <Twitter className="text-white" size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} StreamHub. Todos os direitos
            reservados.
          </p>
          <p className="text-gray-500 text-sm">
            Plataforma segura de streamings premium 🔒
          </p>
        </div>
      </div>
    </footer>
  );
}
