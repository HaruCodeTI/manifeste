"use client";

import { Banner } from "@/components/Banner";
import { Header } from "@/components/Header";
import { ShoppingCart } from "@/components/ShoppingCart";
import { Category, supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from("categories")
        .select("id, name, slug");
      setCategories(
        (data || []).map((cat) => ({
          ...cat,
          description: null,
          created_at: "",
        }))
      );
      setLoadingCategories(false);
    }
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        onTrackOrderClick={() => (window.location.href = "/acompanhar")}
        categories={[]}
        selectedCategory=""
        onCategoryChange={() => {}}
      />
      <Banner />
      {/* Barra de Benefícios */}
      <section
        className="w-full flex flex-wrap justify-center items-center gap-10 py-7 bg-[#e5d4f7] shadow-sm z-10 animate-fadein"
        style={{ borderBottom: "1px solid #d1b3ee", borderRadius: 0 }}
      >
        <div className="flex flex-col items-center gap-2 min-w-[180px]">
          <span className="w-12 h-12 flex items-center justify-center rounded-full bg-[#b689e0] text-white text-3xl mb-1 shadow-md">
            🚚
          </span>
          <span
            className="font-bold text-[#7a3eb1] text-base"
            style={{ fontSize: "1.1rem" }}
          >
            FRETE GRÁTIS
          </span>
          <span
            className="text-[#7a3eb1]/90 text-sm"
            style={{ fontWeight: 400 }}
          >
            acima de R$250
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 min-w-[180px]">
          <span className="w-12 h-12 flex items-center justify-center rounded-full bg-[#fe53b3] text-white text-3xl mb-1 shadow-md">
            💳
          </span>
          <span
            className="font-bold text-[#7a3eb1] text-base"
            style={{ fontSize: "1.1rem" }}
          >
            PAGAMENTO
          </span>
          <span
            className="text-[#7a3eb1]/90 text-sm"
            style={{ fontWeight: 400 }}
          >
            até 6x sem juros
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 min-w-[180px]">
          <span className="w-12 h-12 flex items-center justify-center rounded-full bg-[#ffd700] text-[#7a3eb1] text-3xl mb-1 shadow-md">
            🏬
          </span>
          <span
            className="font-bold text-[#7a3eb1] text-base"
            style={{ fontSize: "1.1rem" }}
          >
            RETIRADA NA LOJA
          </span>
          <span
            className="text-[#7a3eb1]/90 text-sm"
            style={{ fontWeight: 400 }}
          >
            grátis em Campo Grande
          </span>
        </div>
      </section>
      <main
        className="flex-1 flex flex-col items-center justify-start w-full px-4 font-sans"
        style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
      >
        {/* Carrossel/banner já existente */}
        {/* Seção de Categorias */}
        <section className="w-full max-w-6xl py-14 md:py-20 animate-fadein delay-200">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6 text-black text-center"
            style={{
              fontFamily: "Montserrat, Arial, sans-serif",
              fontWeight: 700,
              letterSpacing: "-1px",
            }}
          >
            Navegue por Categorias
          </h2>
          {loadingCategories ? (
            <div className="text-center text-primary">
              Carregando categorias...
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10">
              {categories.map((cat) => {
                // Ícones temáticos para cada categoria
                let icon = "🏷️";
                if (/vibra/i.test(cat.name)) icon = "🔋";
                else if (/lubr/i.test(cat.name)) icon = "💧";
                else if (/acess/i.test(cat.name)) icon = "🎲";
                else if (/brincad/i.test(cat.name)) icon = "🎉";
                else if (/casal/i.test(cat.name)) icon = "💑";
                else if (/anal/i.test(cat.name)) icon = "🍑";
                else if (/gel/i.test(cat.name)) icon = "🧴";
                else if (/preserv/i.test(cat.name)) icon = "🛡️";
                return (
                  <Link
                    key={cat.id}
                    href={`/produtos?categoria=${cat.slug}`}
                    className="group block bg-white rounded-2xl shadow-md border border-[#b689e0]/20 p-10 text-center hover:shadow-lg hover:scale-[1.03] transition-all duration-200 cursor-pointer"
                    style={{ minHeight: 180 }}
                  >
                    <div className="flex justify-center mb-4">
                      <span className="inline-flex items-center justify-center mx-auto w-20 aspect-square bg-[#b689e0]/8 rounded-full text-[2.5rem] text-[#b689e0] group-hover:bg-secondary/10 group-hover:text-secondary transition-all">
                        {icon}
                      </span>
                    </div>
                    <span
                      className="block text-lg font-bold text-black group-hover:text-secondary transition-all mt-2"
                      style={{
                        fontFamily: "Montserrat, Arial, sans-serif",
                        fontWeight: 700,
                      }}
                    >
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
        {/* Banners institucionais (placeholders) */}
        <section className="w-full max-w-6xl flex flex-col md:flex-row gap-6 md:gap-10 py-6 md:py-10 animate-fadein delay-350">
          <a
            href="#"
            className="flex-1 bg-white rounded-2xl shadow-lg border-2 border-primary/10 flex items-center gap-4 p-6 hover:scale-105 hover:shadow-2xl transition-all"
          >
            <img
              src="/banner/flower.png"
              alt="Conheça nossa loja"
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <div className="font-bold text-lg text-primary">
                Conheça nossa loja
              </div>
              <div className="text-black/70 text-sm">
                Visite nossa unidade física em Campo Grande
              </div>
            </div>
          </a>
          <a
            href="#"
            className="flex-1 bg-white rounded-2xl shadow-lg border-2 border-primary/10 flex items-center gap-4 p-6 hover:scale-105 hover:shadow-2xl transition-all"
          >
            <img
              src="/banner/hands.png"
              alt="Troca Fácil"
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <div className="font-bold text-lg text-primary">Troca Fácil</div>
              <div className="text-black/70 text-sm">
                Facilidade e agilidade na troca dos seus produtos
              </div>
            </div>
          </a>
          <a
            href="#"
            className="flex-1 bg-white rounded-2xl shadow-lg border-2 border-primary/10 flex items-center gap-4 p-6 hover:scale-105 hover:shadow-2xl transition-all"
          >
            <img
              src="/banner/bed.png"
              alt="Grupo VIP"
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <div className="font-bold text-lg text-primary">Grupo VIP</div>
              <div className="text-black/70 text-sm">
                Entre para o grupo e receba ofertas exclusivas
              </div>
            </div>
          </a>
        </section>
      </main>
      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <style jsx global>{`
        @keyframes fadein {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes slidein {
          from {
            opacity: 0;
            transform: translateY(-32px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }
        .animate-fadein {
          animation: fadein 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        .animate-slidein {
          animation: slidein 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.2s infinite;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-600 {
          animation-delay: 0.6s;
        }
        .delay-700 {
          animation-delay: 0.7s;
        }
        .delay-800 {
          animation-delay: 0.8s;
        }
      `}</style>
    </div>
  );
}
