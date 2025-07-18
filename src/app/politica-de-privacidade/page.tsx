"use client";
import { Header } from "@/components/Header";
import Link from "next/link";

export default function PoliticaDePrivacidadePage() {
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
            Política de Privacidade
          </h1>
          <p className="text-base text-[#222] mb-6 text-center font-[Poppins]">
            Sua privacidade é prioridade para nós. Todos os dados fornecidos são
            tratados com segurança, confidencialidade e respeito. Utilizamos
            suas informações apenas para processar pedidos, melhorar sua
            experiência e cumprir obrigações legais.
          </p>
          <ul className="list-disc pl-6 text-base text-[#222] mb-6 font-[Poppins] space-y-1">
            <li>
              Seus dados não são compartilhados com terceiros, exceto quando
              necessário para entrega ou exigência legal.
            </li>
            <li>
              Você pode solicitar a exclusão ou alteração de seus dados a
              qualquer momento.
            </li>
            <li>
              Utilizamos cookies para melhorar a navegação e personalizar
              ofertas.
            </li>
            <li>Para dúvidas, entre em contato pelo nosso canal oficial.</li>
          </ul>
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
