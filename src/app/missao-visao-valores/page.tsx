"use client";
import { Header } from "@/components/Header";
import Link from "next/link";

export default function MissaoVisaoValoresPage() {
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
            Missão, Visão e Valores
          </h1>
          <div className="mb-8 w-full">
            <h2 className="text-xl font-bold mb-2 text-[#fe53b3] font-[Poppins]">
              Missão
            </h2>
            <p className="text-base text-[#222] font-[Poppins]">
              Proporcionar experiências premium, seguras e acolhedoras,
              promovendo bem-estar, autoconfiança e liberdade, com atendimento
              humano e inovador.
            </p>
          </div>
          <div className="mb-8 w-full">
            <h2 className="text-xl font-bold mb-2 text-[#fe53b3] font-[Poppins]">
              Visão
            </h2>
            <p className="text-base text-[#222] font-[Poppins]">
              Ser referência nacional em experiências premium, reconhecida pela
              inovação, design, confiança e excelência no cuidado com o cliente.
            </p>
          </div>
          <div className="mb-4 w-full">
            <h2 className="text-xl font-bold mb-2 text-[#fe53b3] font-[Poppins]">
              Valores
            </h2>
            <ul className="list-disc pl-6 text-base text-[#222] font-[Poppins] space-y-1">
              <li>Ética, transparência e respeito à diversidade</li>
              <li>Inovação constante e design premium</li>
              <li>Qualidade em cada detalhe</li>
              <li>Atendimento humanizado e acolhedor</li>
              <li>Confiança, segurança e privacidade</li>
            </ul>
          </div>
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
