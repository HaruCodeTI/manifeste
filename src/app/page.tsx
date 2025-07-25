"use client";

import BannerCarousel from "@/components/BannerCarousel";
import { Header } from "@/components/Header";
import { ShoppingCart } from "@/components/ShoppingCart";
import {
  Category,
  getProductImageUrl,
  Product,
  supabase,
} from "@/lib/supabaseClient";
import { calcCreditoAvista } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function HomePage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [offers, setOffers] = useState<Product[]>([]);

  const testimonials = [
    {
      name: "Poliana",
      product: "Piggy Sugador de Clitóris Recarregável",
      rating: 5,
      title: "É o melhor toy que uma mulher pode ter!",
      text: "Fazem dois anos que comprei e foi o melhor investimento! Ele é perfeito. Você nem precisa estar no clima, que chega lá em segundos. É realmente o melhor.",
    },
    {
      name: "Mila",
      product: "Must Vibrador Rabbit com Aquecimento",
      rating: 5,
      title: "FUI PRO CÉU",
      text: "Já tinha o best e adorava... e ja tinha um tempo que eu tava namorando o Must, justo pelo fato dele esquentar... ai rolou a promo e eu ✨comprei✨ e amei!",
    },
    {
      name: "Maju F",
      product: "Must Vibrador Rabbit com Aquecimento",
      rating: 5,
      title: "Criação abençoada",
      text: "Meu Must chegou a noite e fui ver se tava tudo certo não resisti fui experimentar msm, vei que maravilhosa ainda tava frio ele esquentou tudo kkkkkk, no começo...",
    },
    {
      name: "Juliana Berto",
      product: "Must Vibrador Rabbit com Aquecimento",
      rating: 5,
      title: "Reclamação = goza muito rápido",
      text: "O meu must chegou, cheguei do trabalho e a primeira coisa que eu fiz foi testar, queria fazer uma reclamação pq eu me sinto um macho precoce que goza na primeira...",
    },
  ];
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const testimonialTimeout = useRef<NodeJS.Timeout | null>(null);

  // Animação automática
  useEffect(() => {
    if (testimonialTimeout.current) clearTimeout(testimonialTimeout.current);
    testimonialTimeout.current = setTimeout(() => {
      setTestimonialIdx((prev: number) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => {
      if (testimonialTimeout.current) clearTimeout(testimonialTimeout.current);
    };
  }, [testimonialIdx]);

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
                até 3x sem juros no cartão ou 10% off no pix
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
                pix, crédito a vista ou até 12x no cartão
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
              const hasDiscount =
                mainVariant &&
                mainVariant.original_price &&
                mainVariant.original_price > mainVariant.price;
              const discountPercent =
                hasDiscount && mainVariant && mainVariant.original_price
                  ? Math.round(
                      100 -
                        (mainVariant.price / mainVariant.original_price) * 100
                    )
                  : 0;
              const hasFreeShipping = mainVariant && mainVariant.price >= 250;
              const bg = offerBgColors[idx % offerBgColors.length];

              const valorCreditoAvista = mainVariant
                ? calcCreditoAvista(mainVariant.price)
                : 0;
              return (
                <Link
                  key={product.id}
                  href={`/produto/${product.id}`}
                  className="block group"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="relative flex flex-col items-center rounded-[2.5rem] shadow-xl border border-[#ececec] p-0 overflow-hidden group transition-all duration-300 min-h-[480px] bg-white"
                    style={{ background: bg }}
                  >
                    {/* Badges */}
                    <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
                      {hasDiscount && (
                        <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          {discountPercent}% OFF
                        </span>
                      )}
                      <span className="bg-[#fe53b3] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        OFERTA
                      </span>
                      {hasFreeShipping && (
                        <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          FRETE GRÁTIS
                        </span>
                      )}
                    </div>
                    {/* Imagem */}
                    <div className="w-full flex-1 flex items-center justify-center mb-4 pt-8 pb-2 px-8">
                      {mainVariant &&
                      mainVariant.image_urls &&
                      mainVariant.image_urls.length > 0 ? (
                        <img
                          src={getProductImageUrl(mainVariant.image_urls[0])}
                          alt={product.name}
                          className="object-contain rounded-2xl w-full max-h-64 md:max-h-72 lg:max-h-80"
                          style={{
                            background: bg,
                            maxWidth: "90%",
                            height: "auto",
                          }}
                        />
                      ) : (
                        <div className="w-full h-56 flex items-center justify-center bg-[#f5f5f5] text-[#b689e0] rounded-2xl">
                          Sem imagem
                        </div>
                      )}
                    </div>
                    {/* Nome */}
                    <div className="px-6 w-full flex flex-col items-center">
                      <div
                        className="text-lg md:text-xl font-bold text-black text-center font-[Poppins] mb-2"
                        style={{ fontFamily: "Poppins, Arial, sans-serif" }}
                      >
                        {product.name}
                      </div>
                    </div>
                    {/* Preço */}
                    <div className="flex items-center justify-center gap-2 mb-1">
                      {hasDiscount && (
                        <span className="text-gray-400 line-through text-base">
                          R${" "}
                          {mainVariant && mainVariant.original_price
                            ? Number(mainVariant.original_price).toLocaleString(
                                "pt-BR",
                                { minimumFractionDigits: 2 }
                              )
                            : ""}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-[#fe53b3] font-[Poppins]">
                        R${" "}
                        {mainVariant
                          ? Number(mainVariant.price).toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })
                          : ""}
                      </span>
                    </div>

                    <div className="w-full flex flex-col items-center text-center mb-4">
                      <span className="text-xs text-[#7b61ff] font-[Poppins] mt-1">
                        ou R${" "}
                        {valorCreditoAvista.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        no crédito à vista
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
      {/* Entrega Discreta e Rápida */}
      <section className="w-full py-12 md:py-20 bg-[#ededed] flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20">
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-[#0076ff] rounded-3xl p-6 md:p-10 flex items-center justify-center w-full max-w-md min-h-[320px]">
            <img
              src="/entrega.png"
              alt="Entrega Discreta"
              className="w-full h-auto max-h-64 object-contain rounded-2xl"
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
      {/* Depoimentos / Avaliações */}
      <section className="w-full py-12 md:py-20 bg-[#f5f5f5] flex flex-col items-center">
        <h2
          className="text-4xl md:text-5xl font-bold text-black/90 text-center font-[Poppins] mb-12"
          style={{
            letterSpacing: "-1px",
            fontFamily: "Poppins, Arial, sans-serif",
          }}
        >
          O que dizem nossas clientes
        </h2>
        <div className="relative w-full max-w-5xl flex items-center justify-center">
          {/* Slider */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full shadow p-2 hover:bg-[#b689e0]/20 transition hidden sm:block"
            onClick={() =>
              setTestimonialIdx(
                (prev) => (prev - 1 + testimonials.length) % testimonials.length
              )
            }
            aria-label="Anterior"
          >
            <span style={{ fontSize: 28, color: "#b689e0" }}>‹</span>
          </button>
          <div className="w-full overflow-hidden">
            <div
              className="flex transition-transform duration-700"
              style={{ transform: `translateX(-${testimonialIdx * 100}%)` }}
            >
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="min-w-full px-2 sm:px-4 flex justify-center"
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-[#ececec] p-8 max-w-xl w-full flex flex-col gap-3 animate-fadein">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-[#ede3f6] flex items-center justify-center font-bold text-lg text-[#b689e0]">
                        {t.name[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-700 font-semibold text-base font-[Poppins]">
                          {t.name}
                        </span>
                        <span className="text-black font-bold text-base font-[Poppins]">
                          {t.product}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <span
                          key={i}
                          style={{ color: "#FFD600", fontSize: 18 }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div className="font-bold text-gray-800 text-base mb-1 font-[Poppins]">
                      {t.title}
                    </div>
                    <div className="text-gray-700 text-base font-[Poppins]">
                      {t.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full shadow p-2 hover:bg-[#b689e0]/20 transition hidden sm:block"
            onClick={() =>
              setTestimonialIdx((prev) => (prev + 1) % testimonials.length)
            }
            aria-label="Próximo"
          >
            <span style={{ fontSize: 28, color: "#b689e0" }}>›</span>
          </button>
        </div>
        {/* Dots mobile */}
        <div className="flex gap-2 mt-6 sm:hidden justify-center">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`w-3 h-3 rounded-full ${i === testimonialIdx ? "bg-[#b689e0]" : "bg-[#ede3f6]"}`}
              onClick={() => setTestimonialIdx(i)}
              aria-label={`Ir para depoimento ${i + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="w-full py-12 bg-white flex flex-col items-center justify-center">
        <h2
          className="text-3xl md:text-4xl font-extrabold text-[#7b61ff] text-center font-[Poppins] mb-3"
          style={{ fontFamily: "Poppins, Arial, sans-serif" }}
        >
          Nossa rede Manifeste
        </h2>
        <div className="flex items-center gap-2 text-lg md:text-xl text-[#222] font-[Poppins]">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
            <path
              fill="#222"
              d="M7.75 2A5.75 5.75 0 0 0 2 7.75v8.5A5.75 5.75 0 0 0 7.75 22h8.5A5.75 5.75 0 0 0 22 16.25v-8.5A5.75 5.75 0 0 0 16.25 2h-8.5Zm0 1.5h8.5A4.25 4.25 0 0 1 20.5 7.75v8.5a4.25 4.25 0 0 1-4.25 4.25h-8.5A4.25 4.25 0 0 1 3.5 16.25v-8.5A4.25 4.25 0 0 1 7.75 3.5Zm8.25 2.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM12 7.25A4.75 4.75 0 1 0 12 16.75a4.75 4.75 0 0 0 0-9.5Zm0 1.5a3.25 3.25 0 1 1 0 6.5a3.25 3.25 0 0 1 0-6.5Z"
            />
          </svg>
          <span className="font-semibold">@manifeste.cg</span>
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
