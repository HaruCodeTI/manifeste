"use client";
import { Header } from "@/components/Header";
import Link from "next/link";

export default function QuemSomosPage() {
  return (
    <div className="min-h-screen bg-[#ede3f6] flex flex-col">
      <Header
        onCartClick={() => {}}
        onTrackOrderClick={() => {}}
        categories={[]}
        selectedCategory={""}
        onCategoryChange={() => {}}
      />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 border border-[#e1e1e1] flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-center text-[#7b61ff] font-[Poppins]">
            Quem Somos
          </h1>
          <p className="text-lg text-[#222] mb-6 text-center font-[Poppins]">
            A Manifeste é uma marca premium dedicada a proporcionar experiências
            sofisticadas, seguras e acolhedoras para o seu bem-estar. Nosso
            compromisso é com a qualidade, o design minimalista e a confiança em
            cada detalhe.
          </p>
          <p className="text-base text-[#222] text-center font-[Poppins]">
            Somos apaixonados por inovação, transparência e respeito. Nossa
            equipe trabalha para entregar produtos exclusivos, atendimento
            humanizado e uma jornada de compra premium, do início ao fim. Aqui,
            você encontra liberdade, privacidade e acolhimento para viver sua
            melhor versão.
          </p>
          <div className="mt-8 text-center w-full">
            <Link
              href="/"
              className="text-[#fe53b3] hover:underline font-bold font-[Poppins] focus:outline-none focus:ring-2 focus:ring-[#7b61ff] px-3 py-2 rounded transition"
            >
              Voltar para a Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
