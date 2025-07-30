"use client";

import { CardTransition } from "@/components/ui/transitions";
import { getProductImageUrl, Product } from "@/lib/supabaseClient";
import { calcPix } from "@/lib/utils";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  small?: boolean;
  bgColor?: string; // cor de fundo opcional
}

export function ProductCard({
  product,
  small = false,
  bgColor,
}: ProductCardProps) {
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
    <CardTransition>
      <Link
        href={`/produto/${product.id}`}
        className="block group"
        style={{ textDecoration: "none" }}
      >
        <div
          className={`relative flex flex-col items-center rounded-[2.5rem] shadow-xl border border-[#ececec] p-0 overflow-hidden group transition-all duration-300
            ${small ? "h-[280px] w-[160px]" : "h-[520px] sm:h-[500px] md:h-[600px] lg:h-[600px] w-full"}
            bg-transparent hover:-translate-y-2 hover:shadow-2xl
            ${small ? "hover:scale-105" : ""}`}
          style={{
            background: bgColor || "white",
            fontFamily: "Poppins, Arial, sans-serif",
            cursor: "pointer",
          }}
        >
          <div
            className={`w-full flex items-center justify-center ${small ? "h-32" : "h-80 sm:h-72 md:h-80 lg:h-96"}`}
          >
            {mainVariant &&
            mainVariant.image_urls &&
            mainVariant.image_urls.length > 0 ? (
              <img
                src={getProductImageUrl(mainVariant.image_urls[0])}
                alt={product.name}
                className="object-cover w-full h-full"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                  imageRendering: "crisp-edges",
                }}
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = target.src.split("?")[0];
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
          {/* Bloco flexível para alinhar título+cores e footer */}
          <div className="flex-1 flex flex-col justify-between w-full">
            {/* Nome e cores */}
            <div
              className={`${small ? "px-2 py-2" : "px-4 py-2 sm:py-2"} w-full flex flex-col items-center min-h-[40px] sm:min-h-[60px]`}
            >
              <div
                className={`${small ? "text-sm leading-tight" : "text-lg md:text-xl"} font-bold text-black text-center font-[Poppins] mb-1 ${small ? "line-clamp-2" : ""}`}
                style={{ fontFamily: "Poppins, Arial, sans-serif" }}
              >
                {product.name}
              </div>
              {/* Cores disponíveis */}
              {product.variants && product.variants.length > 1 && (
                <div className="flex gap-1  justify-center">
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
            {/* Footer: preço, parcelamento, botão */}
            <div
              className={`${small ? "px-2 py-3" : "px-4 py-3 sm:py-4 md:py-6"} flex flex-col items-center justify-center w-full sm:mt-2 lg:mt-auto`}
            >
              <span
                className={`${small ? "text-base" : "text-2xl sm:text-2xl"} font-bold text-[#00b85b] font-[Poppins]`}
              >
                {mainVariant ? (
                  <>
                    R${" "}
                    {calcPix(mainVariant.price).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                    <span className="text-xs text-[#00b85b] font-[Poppins] ml-1">
                      no PIX
                    </span>
                  </>
                ) : (
                  <>&nbsp;</>
                )}
              </span>
              {mainVariant && !small && (
                <span className="text-xs text-[#7b61ff] font-[Poppins] mt-1 text-center">
                  ou R${" "}
                  {mainVariant.price.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  no crédito à vista
                </span>
              )}
              {/* Botão COMPRAR - removido no mobile */}
              {!small && (
                <div className="hidden sm:flex w-full justify-center  sm:mt-2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-bold text-white bg-[#fe53b3] shadow text-xs sm:text-sm font-[Poppins] hover:bg-[#fe53b3] hover:scale-105 transition-all duration-200 text-center"
                    style={{ fontFamily: "Poppins, Arial, sans-serif" }}
                  >
                    COMPRAR
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </CardTransition>
  );
}
