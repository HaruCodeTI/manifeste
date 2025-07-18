"use client";

import { Product } from "@/lib/supabaseClient";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  bgColor?: string;
  idx?: number;
}

export function ProductCard({ product, bgColor, idx = 0 }: ProductCardProps) {
  return (
    <div
      className="relative flex flex-col items-center rounded-[2.5rem] shadow-xl border border-[#ececec] p-0 overflow-hidden group transition-all duration-300 min-h-[420px] bg-transparent hover:-translate-y-2 hover:shadow-2xl"
      style={{
        background: "white",
        fontFamily: "Poppins, Arial, sans-serif",
      }}
    >
      {/* Imagem */}
      <div className="w-full flex-1 flex items-center justify-center pt-8 pb-2 px-8">
        {product.image_urls && product.image_urls.length > 0 ? (
          <img
            src={product.image_urls[0]}
            alt={product.name}
            className="object-contain rounded-2xl w-full max-h-64 md:max-h-72 lg:max-h-80 bg-transparent"
            style={{ maxWidth: "90%", height: "auto" }}
          />
        ) : (
          <div className="w-full h-56 flex items-center justify-center bg-white text-[#b689e0] rounded-2xl">
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
        <span className="text-2xl font-bold text-[#fe53b3]">
          R${" "}
          {Number(product.price).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}
        </span>
      </div>
      {/* Parcelamento */}
      <div className="text-xs text-gray-600 mb-4">
        6x de R${" "}
        {(product.price / 6).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}{" "}
        sem juros
      </div>
      {/* Botão COMPRAR - só aparece no hover */}
      <div className="w-full flex justify-center mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Link
          href={`/produto/${product.id}`}
          className="px-5 py-2 rounded-full font-bold text-white bg-[#fe53b3] shadow text-base font-[Poppins] hover:bg-[#b689e0] hover:scale-105 transition-all duration-200 text-center"
          style={{ fontFamily: "Poppins, Arial, sans-serif" }}
        >
          COMPRAR
        </Link>
      </div>
    </div>
  );
}
