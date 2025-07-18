"use client";

import { Product } from "@/lib/supabaseClient";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  small?: boolean;
}

export function ProductCard({ product, small = false }: ProductCardProps) {
  return (
    <div
      className={`relative flex flex-col items-center rounded-[2.5rem] shadow-xl border border-[#ececec] p-0 overflow-hidden group transition-all duration-300
        ${small ? "min-h-[300px] max-h-[320px] w-[180px] max-w-[180px] justify-between" : "min-h-[420px]"}
        bg-transparent hover:-translate-y-2 hover:shadow-2xl
        ${small ? "hover:scale-105" : ""}`}
      style={{
        background: "white",
        fontFamily: "Poppins, Arial, sans-serif",
      }}
    >
      {/* Imagem */}
      <div
        className={`w-full flex-1 flex items-center justify-center pt-6 pb-2 px-4 ${small ? "max-h-36" : ""}`}
        style={small ? { minHeight: 90 } : {}}
      >
        {product.image_urls && product.image_urls.length > 0 ? (
          <img
            src={product.image_urls[0]}
            alt={product.name}
            className={`object-contain rounded-2xl w-full ${small ? "max-h-36" : "max-h-64 md:max-h-72 lg:max-h-80"} bg-transparent`}
            style={{ maxWidth: small ? "80%" : "90%", height: "auto" }}
          />
        ) : (
          <div className="w-full h-36 flex items-center justify-center bg-white text-[#b689e0] rounded-2xl">
            Sem imagem
          </div>
        )}
      </div>
      {/* Nome */}
      <div className="px-4 w-full flex flex-col items-center">
        <div
          className={`${small ? "text-base" : "text-lg md:text-xl"} font-bold text-black text-center font-[Poppins] mb-2`}
          style={{ fontFamily: "Poppins, Arial, sans-serif" }}
        >
          {product.name}
        </div>
      </div>
      {/* Preço */}
      <div className="flex items-center justify-center gap-2 mb-1">
        <span
          className={`${small ? "text-lg" : "text-2xl"} font-bold text-[#fe53b3]`}
        >
          R${" "}
          {Number(product.price).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}
        </span>
      </div>
      {/* Parcelamento */}
      <div className="text-xs text-gray-600 mb-3">
        6x de R${" "}
        {(product.price / 6).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}{" "}
        sem juros
      </div>
      {/* Botão COMPRAR - só aparece no hover */}
      <div
        className={`w-full flex justify-center mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${small ? "" : ""}`}
      >
        <Link
          href={`/produto/${product.id}`}
          className={`px-4 py-1.5 rounded-full font-bold text-white bg-[#fe53b3] shadow text-sm font-[Poppins] hover:bg-[#b689e0] hover:scale-105 transition-all duration-200 text-center ${small ? "" : ""}`}
          style={{ fontFamily: "Poppins, Arial, sans-serif" }}
        >
          COMPRAR
        </Link>
      </div>
    </div>
  );
}
