"use client";

import { getProductImageUrl, Product } from "@/lib/supabaseClient";
import { calcCreditoAvista } from "@/lib/utils";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  small?: boolean;
}

export function ProductCard({ product, small = false }: ProductCardProps) {
  const mainVariant =
    product.variants && product.variants.length > 0
      ? product.variants[0]
      : null;

  function getColorCode(color: string) {
    if (!color) return "#e1e1e1";
    const colorMap: Record<string, string> = {
      lilás: "#bdb2db",
      roxo: "#5c1160",
      rosa: "#ff69b4",
      transparente: "#f5f5f5",
      neutro: "#e1e1e1",
      pink: "#ff69b4",
      preto: "#222",
      black: "#222",
      azul: "#0074d9",
      vermelho: "#ff4136",
      branco: "#fff",
    };
    return colorMap[color.toLowerCase()] || "#e1e1e1";
  }

  return (
    <Link
      href={`/produto/${product.id}`}
      className="block group"
      style={{ textDecoration: "none" }}
    >
      <div
        className={`relative flex flex-col items-center rounded-[2.5rem] shadow-xl border border-[#ececec] p-0 overflow-hidden group transition-all duration-300
          ${small ? "min-h-[220px] max-h-[300px] w-[160px] max-w-[160px]" : "min-h-[420px]"}
          bg-transparent hover:-translate-y-2 hover:shadow-2xl
          ${small ? "hover:scale-105" : ""}`}
        style={{
          background: "white",
          fontFamily: "Poppins, Arial, sans-serif",
          cursor: "pointer",
        }}
      >
        <div
          className={`w-full flex items-center justify-center ${small ? "pt-4 pb-2 px-3 h-32" : "pt-6 pb-2 px-4 flex-1"}`}
        >
          {mainVariant &&
          mainVariant.image_urls &&
          mainVariant.image_urls.length > 0 ? (
            <img
              src={getProductImageUrl(mainVariant.image_urls[0])}
              alt={product.name}
              className={`object-contain ${small ? "max-h-28 max-w-28" : "max-h-64 md:max-h-72 lg:max-h-80 max-w-48"}`}
              style={{
                width: "auto",
                height: "auto",
                objectFit: "contain",
              }}
            />
          ) : (
            <div
              className={`${small ? "w-28 h-28" : "w-48 h-48"} flex items-center justify-center bg-gray-100 text-[#b689e0] rounded-2xl`}
            >
              <span className="text-xs">Sem imagem</span>
            </div>
          )}
        </div>
        {/* Nome */}
        <div
          className={`${small ? "px-2" : "px-4"} w-full flex flex-col items-center`}
        >
          <div
            className={`${small ? "text-sm leading-tight" : "text-lg md:text-xl"} font-bold text-black text-center font-[Poppins] mb-1 ${small ? "line-clamp-2" : ""}`}
            style={{ fontFamily: "Poppins, Arial, sans-serif" }}
          >
            {product.name}
          </div>
          {/* Cores disponíveis */}
          {product.variants && product.variants.length > 1 && (
            <div className="flex gap-1 mt-1 justify-center">
              {product.variants.map((variant) => (
                <span
                  key={variant.id}
                  className={`${small ? "w-3 h-3" : "w-4 h-4"} rounded-full border border-gray-300`}
                  style={{
                    background: getColorCode(variant.color),
                    display: "inline-block",
                  }}
                  title={variant.color}
                />
              ))}
            </div>
          )}
        </div>
        {/* Preço */}
        <div
          className={`${small ? "px-2" : "px-4"} flex flex-col items-center justify-center mb-2 w-full`}
        >
          <span
            className={`${small ? "text-base" : "text-2xl"} font-bold text-[#00b85b] font-[Poppins]`}
          >
            {mainVariant ? (
              <>
                R${" "}
                {Number(mainVariant.price).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </>
            ) : (
              <>&nbsp;</>
            )}
          </span>
          {mainVariant && !small && (
            <span className="text-xs text-[#7b61ff] font-[Poppins] mt-1">
              ou R${" "}
              {calcCreditoAvista(mainVariant.price).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}{" "}
              no crédito à vista
            </span>
          )}
        </div>
        {/* Botão COMPRAR - removido no modo small */}
        {!small && (
          <div className="w-full flex justify-center mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              className="px-4 py-1.5 rounded-full font-bold text-white bg-[#fe53b3] shadow text-sm font-[Poppins] hover:bg-[#fe53b3] hover:scale-105 transition-all duration-200 text-center"
              style={{ fontFamily: "Poppins, Arial, sans-serif" }}
            >
              COMPRAR
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}
