"use client";
import { Header } from "@/components/Header";
import Link from "next/link";

export default function TrocasDeDevolucoesPage() {
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
            Trocas e Devoluções
          </h1>
          <p className="text-lg text-[#222] mb-6 text-center font-[Poppins]">
            Prezamos pela sua satisfação! Se precisar trocar ou devolver um
            produto, siga as orientações abaixo:
          </p>
          <ul className="list-disc pl-6 text-base text-[#222] mb-6 font-[Poppins] space-y-1">
            <li>
              Solicite a troca ou devolução em até 7 dias após o recebimento.
            </li>
            <li>
              O produto deve estar sem uso, em embalagem original e com nota
              fiscal.
            </li>
            <li>
              Entre em contato pelo nosso e-mail ou WhatsApp para iniciar o
              processo.
            </li>
            <li>
              Após análise, enviaremos as instruções para envio ou reembolso.
            </li>
          </ul>
          <p className="text-base text-[#222] text-center font-[Poppins]">
            Dúvidas? Fale conosco! Nosso time está pronto para ajudar.
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
