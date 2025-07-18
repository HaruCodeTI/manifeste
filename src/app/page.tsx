"use client";

import { Banner } from "@/components/Banner";
import { Header } from "@/components/Header";
import { ShoppingCart } from "@/components/ShoppingCart";
import { Category, supabase } from "@/lib/supabaseClient";
import { CreditCard, Store, Truck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaGem,
  FaHandHoldingHeart,
  FaHeart,
  FaLeaf,
  FaMagic,
  FaUserFriends,
  FaVenus,
} from "react-icons/fa";

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
    <div className="min-h-screen bg-gradient-to-b from-[#faf7fd] via-[#e5d4f7] to-[#f8e5d8] flex flex-col">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        onTrackOrderClick={() => (window.location.href = "/acompanhar")}
        categories={[]}
        selectedCategory=""
        onCategoryChange={() => {}}
      />
      <Banner />
      <div className="w-full flex flex-col items-center px-4 gap-6 md:gap-10">
        {/* Barra de Benefícios */}
        <section
          className="w-full max-w-5xl rounded-2xl shadow-lg border border-[#e5d4f7] bg-white flex flex-wrap justify-center items-center gap-6 md:gap-10 py-6 md:py-8 z-10 animate-fadein"
          style={{ borderRadius: 16 }}
        >
          <div className="flex flex-col items-center gap-2 min-w-[150px] md:min-w-[180px]">
            <span className="w-14 h-14 flex items-center justify-center rounded-full bg-[#8e44ad]/10 text-[#8e44ad] mb-2 shadow-sm">
              <Truck className="w-7 h-7" />
            </span>
            <span
              className="font-bold text-[#8e44ad] text-base font-[Montserrat]"
              style={{
                fontSize: "1.1rem",
                fontFamily: "Montserrat, Arial, sans-serif",
              }}
            >
              FRETE GRÁTIS
            </span>
            <span
              className="text-black/70 text-sm font-[Montserrat] text-center"
              style={{
                fontWeight: 400,
                fontFamily: "Montserrat, Arial, sans-serif",
              }}
            >
              acima de R$100
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 min-w-[150px] md:min-w-[180px]">
            <span className="w-14 h-14 flex items-center justify-center rounded-full bg-[#ff6f61]/10 text-[#ff6f61] mb-2 shadow-sm">
              <CreditCard className="w-7 h-7" />
            </span>
            <span
              className="font-bold text-[#8e44ad] text-base font-[Montserrat]"
              style={{
                fontSize: "1.1rem",
                fontFamily: "Montserrat, Arial, sans-serif",
              }}
            >
              PAGAMENTO
            </span>
            <span
              className="text-black/70 text-sm font-[Montserrat] text-center"
              style={{
                fontWeight: 400,
                fontFamily: "Montserrat, Arial, sans-serif",
              }}
            >
              até 6x sem juros
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 min-w-[150px] md:min-w-[180px]">
            <span className="w-14 h-14 flex items-center justify-center rounded-full bg-[#8e44ad]/10 text-[#8e44ad] mb-2 shadow-sm">
              <Store className="w-7 h-7" />
            </span>
            <span
              className="font-bold text-[#8e44ad] text-base font-[Montserrat]"
              style={{
                fontSize: "1.1rem",
                fontFamily: "Montserrat, Arial, sans-serif",
              }}
            >
              RETIRADA NA LOJA
            </span>
            <span
              className="text-black/70 text-sm font-[Montserrat] text-center"
              style={{
                fontWeight: 400,
                fontFamily: "Montserrat, Arial, sans-serif",
              }}
            >
              grátis em Campo Grande
            </span>
          </div>
        </section>
        {/* Seção de Categorias */}
        <section className="w-full max-w-5xl py-10 md:py-14 animate-fadein delay-200 bg-transparent">
          <h2
            className="text-4xl md:text-5xl font-bold text-black/90 text-center font-[Montserrat] mb-6"
            style={{
              letterSpacing: "-1px",
              fontFamily: "Montserrat, Arial, sans-serif",
            }}
          >
            Navegue por Categorias
          </h2>
          {loadingCategories ? (
            <div className="text-center text-primary">
              Carregando categorias...
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
              {categories.map((cat) => {
                // Ícones SVG para cada categoria
                let Icon = FaBoxOpen;
                if (/vibra/i.test(cat.name)) Icon = FaMagic;
                else if (/lubr/i.test(cat.name)) Icon = FaLeaf;
                else if (/acess/i.test(cat.name)) Icon = FaGem;
                else if (/brincad/i.test(cat.name)) Icon = FaHeart;
                else if (/casal/i.test(cat.name)) Icon = FaUserFriends;
                else if (/anal/i.test(cat.name)) Icon = FaVenus;
                else if (/gel/i.test(cat.name)) Icon = FaHandHoldingHeart;
                return (
                  <Link
                    key={cat.id}
                    href={`/produtos?categoria=${cat.slug}`}
                    className="group block bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-[#b689e0]/20 p-8 md:p-10 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
                    style={{
                      minHeight: 180,
                      fontFamily: "Montserrat, Arial, sans-serif",
                    }}
                  >
                    <div className="flex justify-center mb-3">
                      <span className="w-20 h-20 flex items-center justify-center rounded-full bg-[#b689e0]/10 text-[2.5rem] text-[#b689e0]">
                        <Icon className="w-12 h-12 text-[#b689e0]" />
                      </span>
                    </div>
                    <span
                      className="block text-lg font-bold text-black/80 font-[Montserrat] mt-2"
                      style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
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
