"use client";

import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { useCartContext } from "@/contexts/CartContext";
import { Product, getProductImageUrl } from "@/lib/supabaseClient";
import { calcCreditoAvista, calcCreditoParcelado } from "@/lib/utils";
import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { addToCart } = useCartContext();

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const variant = product.variants?.[selectedVariantIdx];
  const [selectedImage, setSelectedImage] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [stockAlert, setStockAlert] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  if (!variant) return null;

  const rating = 5;
  const reviews = 32;
  const hasDiscount =
    variant.original_price && variant.original_price > variant.price;
  const discountPercent =
    hasDiscount && variant.original_price
      ? Math.round(100 - (variant.price / variant.original_price) * 100)
      : 0;

  const valorCreditoAvista = calcCreditoAvista(variant.price);
  const { total: valorParcelado, parcela: valorParcela } = calcCreditoParcelado(
    variant.price,
    3
  );

  function getColorCode(color: string) {
    if (!color) return "#e1e1e1";
    const colorMap: Record<string, string> = {
      lilás: "#b689e0",
      roxo: "#7b61ff",
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

  const handleAddToCart = () => {
    if (quantity > variant.stock_quantity) {
      setStockAlert(true);
      setTimeout(() => setStockAlert(false), 2000);
      return;
    }
    addToCart(
      {
        product_id: product.id,
        variant_id: variant.id,
        name: product.name,
        color: variant.color,
        price: variant.price,
        image: variant.image_urls?.[0] || "",
      },
      () => {
        setShowToast(true);
      },
      quantity
    );
  };

  const formatPrice = (price: number) => {
    return price.toFixed(2).replace(".", ",");
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-primary hover:text-secondary focus:text-secondary rounded-xl font-medium font-[Poppins] transition-colors"
            style={{ fontFamily: "Poppins, Arial, sans-serif" }}
          >
            <Link href="/produtos">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos produtos
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="w-full max-w-lg mx-auto md:max-w-2xl">
            {variant.image_urls && variant.image_urls.length > 1 ? (
              <div className="flex flex-row gap-4 items-start">
                <div className="flex flex-col gap-2 items-center justify-start mt-2">
                  {variant.image_urls.map(
                    (img, idx) =>
                      idx !== selectedImage && (
                        <button
                          key={img}
                          onClick={() => setSelectedImage(idx)}
                          className={`w-20 h-20 aspect-square bg-white rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${selectedImage !== idx ? "border-[#ede3f6] hover:border-[#fe53b3]" : "border-[#fe53b3] shadow-lg scale-105"}`}
                          style={{ minWidth: 80, minHeight: 80 }}
                          aria-label={`Ver imagem ${idx + 1}`}
                        >
                          <img
                            src={getProductImageUrl(img)}
                            alt={`${product.name} - Miniatura ${idx + 1}`}
                            className="object-cover w-full h-full"
                            loading="lazy"
                          />
                        </button>
                      )
                  )}
                </div>

                <div className="w-full bg-white rounded-2xl overflow-hidden relative border border-[#ede3f6] shadow-lg flex items-center justify-center min-h-[320px] max-w-[420px] mx-auto">
                  {variant.image_urls[selectedImage] ? (
                    <img
                      src={getProductImageUrl(
                        variant.image_urls[selectedImage]
                      )}
                      alt={product.name}
                      className="object-contain w-full h-full transition-all duration-500 rounded-2xl"
                      style={{
                        maxHeight: 420,
                        maxWidth: "100%",
                        width: "auto",
                        height: "auto",
                        cursor: "zoom-in",
                      }}
                      onClick={() => setShowImageModal(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-white text-[#b689e0] gap-2 rounded-2xl border-none">
                      <span
                        style={{ fontSize: 48, lineHeight: 1, marginBottom: 8 }}
                      >
                        ❤
                      </span>
                      <span className="text-xs font-medium font-[Poppins] text-[#b689e0] text-center px-2">
                        Em breve a foto do produto com todo o cuidado que você
                        merece!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full aspect-square bg-white rounded-2xl overflow-hidden relative border border-[#ede3f6] shadow-lg flex items-center justify-center min-w-[220px] max-w-[420px] mx-auto">
                {variant.image_urls &&
                variant.image_urls.length > 0 &&
                variant.image_urls[0] ? (
                  <img
                    src={getProductImageUrl(variant.image_urls[0])}
                    alt={product.name}
                    className="object-contain w-full h-full transition-all duration-500 rounded-2xl"
                    style={{ maxHeight: 420, maxWidth: 420, cursor: "zoom-in" }}
                    onClick={() => setShowImageModal(true)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-white text-[#b689e0] gap-2 rounded-2xl border-none">
                    <span
                      style={{ fontSize: 48, lineHeight: 1, marginBottom: 8 }}
                    >
                      ❤
                    </span>
                    <span className="text-xs font-medium font-[Poppins] text-[#b689e0] text-center px-2">
                      Em breve a foto do produto com todo o cuidado que você
                      merece!
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="space-y-6 flex flex-col justify-center">
            <div className="space-y-4">
              <h1
                className="text-3xl md:text-4xl font-extrabold leading-tight mb-2 text-[#7b61ff] font-[Poppins]"
                style={{ fontFamily: "Poppins, Arial, sans-serif" }}
              >
                {product.name}
              </h1>
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} size={20} fill="#FFD600" stroke="#FFD600" />
                ))}
                <span className="ml-1 text-gray-700 text-base font-semibold">
                  ({reviews})
                </span>
              </div>
              <div className="flex items-center gap-3 flex-wrap mb-2">
                {hasDiscount && (
                  <span className="text-base text-gray-400 line-through">
                    R$ {formatPrice(variant.original_price!)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="bg-[#00d26a] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {discountPercent}%OFF
                  </span>
                )}
                <div className="flex flex-col gap-3 mb-2">
                  <span className="text-3xl font-bold text-[#00b85b] font-[Poppins]">
                    R${" "}
                    {variant.price.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-base text-[#7b61ff] font-[Poppins]">
                    ou R${" "}
                    {valorCreditoAvista.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    no crédito à vista
                  </span>
                  <span className="text-base text-gray-700 font-[Poppins]">
                    3x de R${" "}
                    {valorParcela.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    no crédito parcelado (total R${" "}
                    {valorParcelado.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                    )
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 bg-white border border-[#ede3f6] rounded-full px-3 py-2 shadow-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="rounded-full hover:bg-[#ede3f6] hover:text-[#7b61ff] text-[#7b61ff] font-bold text-lg transition-all duration-200"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                    disabled={quantity <= 1 || variant.stock_quantity === 0}
                  >
                    -
                  </Button>
                  <span className="text-xl font-bold w-8 text-center text-[#7b61ff] font-[Poppins]">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (quantity < variant.stock_quantity) {
                        setQuantity(quantity + 1);
                      } else {
                        setStockAlert(true);
                        setTimeout(() => setStockAlert(false), 2000);
                      }
                    }}
                    className="rounded-full hover:bg-[#ede3f6] hover:text-[#7b61ff] text-[#7b61ff] font-bold text-lg transition-all duration-200"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                    disabled={
                      quantity >= variant.stock_quantity ||
                      variant.stock_quantity === 0
                    }
                  >
                    +
                  </Button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  className="px-10 py-3 rounded-full font-bold text-white bg-[#00d26a] text-lg font-[Poppins] hover:bg-[#00b85b] hover:scale-105 transition-all duration-200 shadow-lg"
                  style={{ fontFamily: "Poppins, Arial, sans-serif" }}
                  disabled={variant.stock_quantity === 0}
                >
                  COMPRAR
                </Button>
              </div>
              {stockAlert && (
                <div className="text-xs text-red-600 font-semibold mt-1">
                  Estoque máximo disponível!
                </div>
              )}
            </div>
            {product.variants && product.variants.length > 1 && (
              <div className="flex gap-2 mb-4">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVariantIdx(idx);
                      setSelectedImage(0);
                    }}
                    className={`w-8 h-8 rounded-full border-2 ${selectedVariantIdx === idx ? "border-[#fe53b3] scale-110" : "border-gray-300"}`}
                    style={{
                      background: getColorCode(v.color),
                      transition: "all 0.2s",
                    }}
                    title={v.color}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-12 bg-[#f5f5f5] rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-[#222] mb-4 font-[Poppins]">
            Descrição
          </h2>
          <div className="text-base text-[#222] font-[Poppins]">
            {product.description}
          </div>
        </div>
      </div>
      <Toast
        message={`${quantity > 1 ? `${quantity}x ` : ""}${product.name} adicionado ao carrinho!`}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      {showImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setShowImageModal(false)}
          style={{ cursor: "zoom-out" }}
        >
          <img
            src={getProductImageUrl(variant.image_urls[selectedImage])}
            alt={product.name}
            className="max-w-full max-h-full rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
