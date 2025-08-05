"use client";

import BannerCarousel from "@/components/BannerCarousel";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { ShoppingCart } from "@/components/ShoppingCart";
import { Category, Product, supabase } from "@/lib/supabaseClient";
import { calcPix } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [offers, setOffers] = useState<Product[]>([]);

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

  useEffect(() => {
    async function fetchOffers() {
      const { data } = await supabase
        .from("products")
        .select("*, product_variants(*)")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(3);
      setOffers(
        (data || []).map((p) => ({
          ...p,
          variants: p.product_variants || [],
        }))
      );
    }
    fetchOffers();
  }, []);

  // Cores de fundo para os cards de oferta
  const offerBgColors = ["#ffe0f7", "#e0e7ff", "#ffe4ec"];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        onTrackOrderClick={() => (window.location.href = "/acompanhar")}
        categories={[]}
        selectedCategory=""
        onCategoryChange={() => {}}
      />
      <BannerCarousel />
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
                até 3x sem juros no cartão ou 5% off no pix
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
                pix, débito ou crédito em até 3x
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
                .filter((cat) => !/brincad|kit|conjunto/i.test(cat.name))
                .map((cat) => {
                  // Definir cor e imagem para cada categoria
                  let bg = "#e0e7ff";
                  let img = "";
                  if (/vibra/i.test(cat.name)) {
                    bg = "#ffe0f7";
                    img = "/coelho.png";
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
                    img = "/anel-de-ritmo.png";
                  } else if (/anal/i.test(cat.name)) {
                    bg = "#e0e7ff";
                    img = "/2.png";
                  } else if (/kit|conjunto/i.test(cat.name)) {
                    bg = "#e0e7ff";
                    img = "/4.png";
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
                          <div
                            style={{
                              width: "70%",
                              height: "70%",
                              borderRadius: "50%",
                              background: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={img}
                              alt={cat.name}
                              style={{
                                width: /lubr|gel/i.test(cat.name) ? "150%" : "200%",
                                height: /lubr|gel/i.test(cat.name) ? "150%" : "200%",
                                objectFit: /lubr|gel/i.test(cat.name) ? "cover" : "contain",
                                objectPosition: /lubr|gel/i.test(cat.name) ? "center" : "center",
                                borderRadius: "50%",
                              }}
                            />
                          </div>
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
        {/* Ofertas */}
        <section className="w-full py-12 md:py-20 ">
          <h2
            className="text-4xl md:text-5xl font-bold text-black/90 text-center font-[Poppins] mb-12"
            style={{
              letterSpacing: "-1px",
              fontFamily: "Poppins, Arial, sans-serif",
            }}
          >
            Ofertas
          </h2>
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-14 px-2 md:px-0">
            {offers.map((product, idx) => {
              const mainVariant =
                product.variants && product.variants.length > 0
                  ? product.variants[0]
                  : null;
              
              // Calcula o desconto dinâmico baseado no preço no PIX
              const getDiscountPercent = (price: number) => {
                if (price >= 200) return 30; // Produtos mais caros mantêm 30%
                if (price >= 100) return 25; // Produtos médios: 25%
                if (price >= 50) return 20;  // Produtos menores: 20%
                return 15; // Produtos muito baratos: 15%
              };

              const valorPix = mainVariant ? calcPix(mainVariant.price) : 0;
              const discountPercent = getDiscountPercent(valorPix);
              const hasFreeShipping = mainVariant && mainVariant.price >= 250;
              const bg = offerBgColors[idx % offerBgColors.length];
              return (
                <div key={product.id} className="relative">
                  {/* Badges */}
                  <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      {discountPercent}% OFF
                    </span>
                    <span className="bg-[#fe53b3] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      OFERTA
                    </span>
                    {hasFreeShipping && (
                      <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        FRETE GRÁTIS
                      </span>
                    )}
                  </div>
                  <ProductCard product={product} bgColor={bg} />
                </div>
              );
            })}
          </div>
        </section>
      </div>
      {/* Entrega Discreta e Rápida */}
      <section className="w-full py-12 md:py-20 bg-[#ededed] flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20">
        <div className="flex-1 flex items-center justify-center">
          <div className="rounded-3xl flex items-center justify-center w-full max-w-md min-h-[320px] overflow-hidden">
            <img
              src="/entrega-discreta.png"
              alt="Entrega Discreta"
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left px-2 md:px-0">
          <h2
            className="text-3xl md:text-5xl font-extrabold text-[#7b61ff] mb-4 font-[Poppins]"
            style={{ fontFamily: "Poppins, Arial, sans-serif" }}
          >
            Entrega discreta{" "}
            <span className="text-[#fe53b3]">e em até 1 hora</span>
          </h2>
          <div
            className="text-lg md:text-xl font-semibold text-gray-700 mb-2 font-[Poppins]"
            style={{ fontFamily: "Poppins, Arial, sans-serif" }}
          >
            Fatura sigilosa, caixa neutra e sem menção à loja ou ao conteúdo.
          </div>
          <div
            className="text-base text-gray-600 font-[Poppins]"
            style={{ fontFamily: "Poppins, Arial, sans-serif" }}
          >
            Entregamos em até <b>1 hora</b> para Campo Grande/MS. Rápido, seguro
            e com total discrição!
          </div>
        </div>
      </section>

      <section className="w-full py-12 bg-white flex flex-col items-center justify-center">
        <h2
          className="text-3xl md:text-4xl font-extrabold text-[#7b61ff] text-center font-[Poppins] mb-6"
          style={{ fontFamily: "Poppins, Arial, sans-serif" }}
        >
          Nossa rede Manifeste
        </h2>

        {/* Instagram Section */}
        <div className="w-full max-w-4xl mx-auto px-4 mb-8">
          <div className="p-6 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-[#7b61ff] mb-4 font-[Poppins]">
              Siga-nos no Instagram
            </h3>
            <p className="text-gray-600 mb-6 font-[Poppins]">
              Fique por dentro das novidades e promoções exclusivas
            </p>
            <a
              href="https://instagram.com/manifeste.cg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#b689e0] to-[#fe53b3] text-white px-6 py-3 rounded-full font-bold font-[Poppins] hover:scale-105 transition-transform"
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7.75 2A5.75 5.75 0 0 0 2 7.75v8.5A5.75 5.75 0 0 0 7.75 22h8.5A5.75 5.75 0 0 0 22 16.25v-8.5A5.75 5.75 0 0 0 16.25 2h-8.5Zm0 1.5h8.5A4.25 4.25 0 0 1 20.5 7.75v8.5a4.25 4.25 0 0 1-4.25 4.25h-8.5A4.25 4.25 0 0 1 3.5 16.25v-8.5A4.25 4.25 0 0 1 7.75 3.5Zm8.25 2.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM12 7.25A4.75 4.75 0 1 0 12 16.75a4.75 4.75 0 0 0 0-9.5Zm0 1.5a3.25 3.25 0 1 1 0 6.5a3.25 3.25 0 0 1 0-6.5Z" />
              </svg>
              Seguir no Instagram
            </a>
          </div>
        </div>
      </section>

      <div className="w-full flex flex-col items-center py-8 bg-white">
        <h3 className="text-2xl md:text-3xl font-bold text-[#7b61ff] mb-4 font-[Poppins]">
          Aproveite o momento
        </h3>
        <div style={{ width: "100%", maxWidth: 480 }}>
          <iframe
            data-testid="embed-iframe"
            style={{ borderRadius: 12, width: "100%" }}
            src="https://open.spotify.com/embed/playlist/4cLDQB2t9GJ2hTCUFwSPHN?utm_source=generator"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
      </div>

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
