"use client";

import { Header } from "@/components/Header";
import { ShoppingCart } from "@/components/ShoppingCart";
import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        onTrackOrderClick={() => (window.location.href = "/acompanhar")}
        categories={[]}
        selectedCategory=""
        onCategoryChange={() => {}}
      />
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 font-sans" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
        <section className="w-full flex justify-center py-10 md:py-20 animate-fadein">
          <div className="w-full max-w-screen-lg flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center text-center md:text-left" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
              <h1 className="text-4xl md:text-6xl font-light mb-4 tracking-tight animate-slidein text-black" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
                Manifeste
              </h1>
              <p className="text-lg md:text-2xl text-black mb-6 max-w-xl animate-fadein delay-100 font-light" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
                Produtos que contam histórias.
                <br className="hidden md:inline" /> Experiências que transformam
                vidas.
              </p>
              <p className="text-xl md:text-2xl font-regular text-black mb-8 animate-fadein delay-200" style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 400 }}>
                <span className="text-black">Manifeste</span> seu estilo, <span className="text-black">manifeste</span> sua essência.
              </p>
              <Link
                href="/produtos"
                className="inline-block bg-secondary text-white px-8 py-3 text-base md:text-lg font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:bg-[#c13e8a] shadow-lg animate-fadein delay-300 border-2 border-secondary focus:outline focus:outline-2 focus:outline-primary"
                style={{ boxShadow: "0 2px 12px 0 #fe53b320", fontFamily: 'Montserrat, Arial, sans-serif' }}
              >
                Explorar Produtos
              </Link>
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center animate-fadein delay-400 mt-8 md:mt-0">
              <div
                className="w-64 h-64 md:w-80 md:h-80 bg-white rounded-2xl flex items-center justify-center shadow-lg border-2 border-primary"
                style={{ boxShadow: "0 2px 16px 0 #b689e020" }}
              >
                <span className="text-5xl text-primary font-sans" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>IMG</span>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center py-16 md:py-24 animate-fadein delay-300">
          <div className="flex flex-col items-start md:items-start text-left md:text-left" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-black" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
              Curadoria Cuidadosa
            </h2>
            <p className="text-base md:text-lg text-black/90 leading-relaxed mb-4" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
              Cada produto em nossa coleção foi escolhido para inspirar e
              transformar. Não vendemos apenas objetos, vendemos experiências
              que elevam sua qualidade de vida.
            </p>
            <p className="text-lg md:text-xl font-semibold text-black animate-fadein delay-350" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
              <span className="text-black">Manifeste</span> o extraordinário no
              seu dia a dia.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end text-center md:text-right gap-4" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
            <span className="text-6xl md:text-7xl mb-2 animate-bounce-slow">✨</span>
            <span className="text-base md:text-lg text-black font-medium" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
              Qualidade que se manifesta
            </span>
            <div
              className="w-40 h-40 md:w-56 md:h-56 bg-white rounded-2xl flex items-center justify-center shadow-lg border-2 border-primary mt-4"
              style={{ boxShadow: "0 2px 16px 0 #b689e020" }}
            >
              <span className="text-3xl text-primary font-sans" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>IMG</span>
            </div>
          </div>
        </section>

        <section className="w-full max-w-6xl py-16 md:py-24 animate-fadein delay-400">
          <div className="text-center mb-10" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-black" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
              Nossa Filosofia
            </h2>
            <p className="text-base md:text-lg text-black/90 max-w-2xl mx-auto" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
              Acreditamos que os objetos que nos cercam têm o poder de
              transformar não apenas nossos espaços, mas também nossas vidas.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="flex flex-col items-center text-center p-6 animate-fadein delay-500 bg-white rounded-2xl shadow-lg border-2 border-primary"
              style={{ boxShadow: "0 2px 12px 0 #b689e020" }}
            >
              <span className="text-4xl md:text-5xl mb-2 text-primary">🎯</span>
              <h3 className="text-lg md:text-xl font-regular mb-2 text-black" style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 400 }}>
                Propósito
              </h3>
              <p className="text-black/80 text-sm md:text-base font-light" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
                Cada produto tem uma razão de ser, uma história para contar.
              </p>
            </div>
            <div
              className="flex flex-col items-center text-center p-6 animate-fadein delay-600 bg-white rounded-2xl shadow-lg border-2 border-primary"
              style={{ boxShadow: "0 2px 12px 0 #b689e020" }}
            >
              <span className="text-4xl md:text-5xl mb-2 text-secondary">🌟</span>
              <h3 className="text-lg md:text-xl font-regular mb-2 text-black" style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 400 }}>
                Qualidade
              </h3>
              <p className="text-black/80 text-sm md:text-base font-light" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
                Materiais excepcionais, acabamentos perfeitos, durabilidade
                comprovada.
              </p>
            </div>
            <div
              className="flex flex-col items-center text-center p-6 animate-fadein delay-700 bg-white rounded-2xl shadow-lg border-2 border-primary"
              style={{ boxShadow: "0 2px 12px 0 #b689e020" }}
            >
              <span className="text-4xl md:text-5xl mb-2 text-primary">💫</span>
              <h3 className="text-lg md:text-xl font-regular mb-2 text-black" style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 400 }}>
                Experiência
              </h3>
              <p className="text-black/80 text-sm md:text-base font-light" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
                Momentos que se transformam em memórias inesquecíveis.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full text-center py-16 md:py-24 animate-fadein delay-800">
          <h2 className="text-2xl md:text-3xl font-light mb-4 text-black" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
            Descubra o Extraordinário
          </h2>
          <p className="text-base md:text-lg text-black/90 mb-8 max-w-xl mx-auto font-regular" style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 400 }}>
            <span className="text-black">Manifeste</span> qualidade, <span className="text-black">manifeste</span> experiências.
          </p>
          <Link
            href="/produtos"
            className="inline-block bg-secondary text-white px-8 py-3 text-base md:text-lg font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:bg-[#c13e8a] shadow-lg border-2 border-secondary focus:outline focus:outline-2 focus:outline-primary"
            style={{ boxShadow: "0 2px 12px 0 #fe53b320", fontFamily: 'Montserrat, Arial, sans-serif' }}
          >
            Ver Catálogo Completo
          </Link>
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
