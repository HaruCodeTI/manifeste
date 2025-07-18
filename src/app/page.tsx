"use client";

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
      <div className="w-full flex flex-col items-center px-2 md:px-4 gap-10 md:gap-16">
        {/* Barra de Benefícios */}
        <section className="w-full max-w-6xl flex flex-row flex-wrap justify-center items-stretch gap-6 md:gap-10 py-8 md:py-12 animate-fadein">
          {/* Frete grátis */}
          <div className="flex flex-row items-center gap-4 bg-white rounded-2xl shadow border border-[#ececec] px-6 py-4 min-w-[220px] max-w-xs flex-1">
            <img
              src="/frete.svg"
              alt="Frete grátis"
              className="w-14 h-14 animate-benefit-icon"
            />
            <div>
              <div
                className="font-bold text-[#2563eb] text-base md:text-lg font-[Poppins]"
                style={{ fontFamily: "Poppins, Arial, sans-serif" }}
              >
                FRETE GRÁTIS
              </div>
              <div
                className="text-black text-sm md:text-base font-[Poppins]"
                style={{ fontFamily: "Poppins, Arial, sans-serif" }}
              >
                nas compras a partir de R$100
              </div>
            </div>
          </div>
          {/* Pagamento */}
          <div className="flex flex-row items-center gap-4 bg-white rounded-2xl shadow border border-[#ececec] px-6 py-4 min-w-[220px] max-w-xs flex-1">
            <img
              src="/pagamento.svg"
              alt="Pagamento facilitado"
              className="w-14 h-14 animate-benefit-icon"
            />
            <div>
              <div
                className="font-bold text-[#2563eb] text-base md:text-lg font-[Poppins]"
                style={{ fontFamily: "Poppins, Arial, sans-serif" }}
              >
                PAGAMENTO
              </div>
              <div
                className="text-black text-sm md:text-base font-[Poppins]"
                style={{ fontFamily: "Poppins, Arial, sans-serif" }}
              >
                até 6x sem juros no cartão ou 5% off no pix
              </div>
            </div>
          </div>
          {/* Pague como quiser */}
          <div className="flex flex-row items-center gap-4 bg-white rounded-2xl shadow border border-[#ececec] px-6 py-4 min-w-[220px] max-w-xs flex-1">
            <img
              src="/card.svg"
              alt="Pague como quiser"
              className="w-14 h-14 animate-benefit-icon"
            />
            <div>
              <div
                className="font-bold text-[#2563eb] text-base md:text-lg font-[Poppins]"
                style={{ fontFamily: "Poppins, Arial, sans-serif" }}
              >
                PAGUE COMO QUISER
              </div>
              <div
                className="text-black text-sm md:text-base font-[Poppins]"
                style={{ fontFamily: "Poppins, Arial, sans-serif" }}
              >
                pix, boleto ou até 12x no cartão
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-20 bg-[#f5f5f5]">
          <h2
            className="text-4xl md:text-5xl font-bold text-black/90 text-center font-[Poppins] mb-12"
            style={{
              letterSpacing: "-1px",
              fontFamily: "Poppins, Arial, sans-serif",
            }}
          >
            Navegue por Categorias
          </h2>
          {loadingCategories ? (
            <div className="text-center text-primary">
              Carregando categorias...
            </div>
          ) : (
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-14 px-2 md:px-0">
              {categories
                .filter((cat) => !/brincad/i.test(cat.name))
                .map((cat, idx) => {
                  // Definir cor e imagem para cada categoria
                  let bg = "#e0e7ff";
                  let img = "";
                  if (/vibra/i.test(cat.name)) {
                    bg = "#ffe0f7";
                    img = "/2.png";
                  } else if (/lubr/i.test(cat.name)) {
                    bg = "#ffe4ec";
                    img = "/1.png";
                  } else if (/casal/i.test(cat.name)) {
                    bg = "#e0f7fa";
                    img = "/3.png";
                  } else if (/gel/i.test(cat.name)) {
                    bg = "#ffe4ec";
                    img = "/1.png";
                  } else if (/acess/i.test(cat.name)) {
                    bg = "#f3e8ff";
                    img = "/3.png";
                  } else if (/anal/i.test(cat.name)) {
                    bg = "#e0e7ff";
                    img = "/2.png";
                  }
                  return (
                    <Link
                      key={cat.id}
                      href={`/produtos?categoria=${cat.slug}`}
                      className="group flex flex-col items-center gap-4 cursor-pointer"
                      style={{ fontFamily: "Poppins, Arial, sans-serif" }}
                    >
                      <span
                        className="flex items-center justify-center shadow-xl border border-[#ececec] category-card-hover"
                        style={{
                          width: 220,
                          height: 220,
                          borderRadius: "50%",
                          background: bg,
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow:
                            "0 8px 32px 0 #b689e033, 0 1.5px 8px 0 #b689e022",
                          margin: "0 auto",
                        }}
                      >
                        {img ? (
                          <img
                            src={img}
                            alt={cat.name}
                            style={{
                              width: "70%",
                              height: "70%",
                              objectFit: "cover",
                              borderRadius: "50%",
                            }}
                          />
                        ) : null}
                      </span>
                      <span
                        className="block text-lg md:text-xl font-bold text-[#6d348b] font-[Poppins] mt-2 group-hover:text-[#fe53b3] transition-colors text-center"
                        style={{ fontFamily: "Poppins, Arial, sans-serif" }}
                      >
                        {cat.name}
                      </span>
                    </Link>
                  );
                })}
            </div>
          )}
        </section>
      </div>
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
      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <style jsx global>{`
        .category-card-hover {
          transition:
            transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.25s;
        }
        .category-card-hover:hover {
          transform: scale(1.07) translateY(-10px);
          box-shadow:
            0 8px 32px 0 #b689e033,
            0 1.5px 8px 0 #b689e022;
        }
      `}</style>
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
        @keyframes benefit-bounce {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.08);
          }
        }
        .animate-benefit-icon {
          animation: benefit-bounce 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          transition: transform 0.2s;
        }
        .animate-benefit-icon:hover {
          transform: scale(1.13) translateY(-4px);
        }
      `}</style>
    </div>
  );
}
