"use client";

import { useState, useEffect } from "react";
import StoreLayout from "@/app/store-layout";
import ProductCard from "@/components/store/ProductCard";
import { Sparkles, Shield, Zap, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/store/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  async function fetchSettings() {
    try {
      const res = await fetch("/api/store/settings");
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  }

  const categories = ["all", ...new Set(products.map((p) => p.category))];
  const filteredProducts =
    filter === "all" ? products : products.filter((p) => p.category === filter);

  return (
    <StoreLayout>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a]">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full filter blur-[120px]"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600 rounded-full filter blur-[120px]"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-8">
            <Sparkles size={16} className="text-yellow-400" />
            <span className="text-sm text-white/90">
              Acesso Premium Garantido
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Streamings Premium
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              Por Preços Incríveis
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Netflix, Disney+, HBO Max, Spotify e muito mais. Entrega instantânea
            direto no seu e-mail.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#produtos"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all"
            >
              Ver Todos os Planos
            </a>
            <a
              href="#como-funciona"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
              Como Funciona
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">8+</div>
              <div className="text-sm text-gray-400">Plataformas</div>
            </div>
            <div className="text-center border-x border-white/10">
              <div className="text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-sm text-gray-400">Seguro</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-sm text-gray-400">Suporte</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl hover:border-purple-500/50 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Entrega Instantânea
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Receba seus dados de acesso no e-mail em segundos após a
                confirmação do pagamento.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl hover:border-purple-500/50 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">100% Seguro</h3>
              <p className="text-gray-400 leading-relaxed">
                Plataforma protegida com criptografia de ponta e contas
                verificadas e funcionais.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl hover:border-purple-500/50 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Suporte Premium
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Atendimento 24/7 para resolver qualquer dúvida ou problema com
                seus acessos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="produtos" className="py-20 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Planos Disponíveis
            </h2>
            <p className="text-gray-400 text-lg">
              Escolha o streaming perfeito para você
            </p>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  filter === cat
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                }`}
              >
                {cat === "all" ? "Todos" : cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="como-funciona"
        className="py-20 bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a]"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Como Funciona?
            </h2>
            <p className="text-gray-400 text-lg">Simples, rápido e seguro</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Escolha seu Plano",
                desc: "Navegue pelos streamings disponíveis e selecione o que deseja.",
              },
              {
                step: "02",
                title: "Adicione ao Carrinho",
                desc: "Clique em adicionar e escolha a quantidade desejada.",
              },
              {
                step: "03",
                title: "Finalize a Compra",
                desc: "Preencha seus dados e confirme o pagamento seguro.",
              },
              {
                step: "04",
                title: "Receba Instantâneo",
                desc: "Seus dados de acesso chegam no e-mail em segundos!",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-6xl font-bold text-white/5 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-400">{item.desc}</p>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-600 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-[100px]"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-[100px]"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para Começar?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Milhares de clientes já aproveitam nossos streamings premium
          </p>
          <a
            href="#produtos"
            className="inline-block px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all"
          >
            Ver Todos os Planos
          </a>
        </div>
      </section>
    </StoreLayout>
  );
}
