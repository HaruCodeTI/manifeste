"use client";

import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { useCartContext } from "@/contexts/CartContext";
import { Product } from "@/lib/supabaseClient";
import { ArrowLeft, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { addToCart } = useCartContext();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [stockAlert, setStockAlert] = useState(false);

  // Mock de avaliações (fixo)
  const rating = 5;
  const reviews = 32; // valor fixo para não variar
  // Todos os outros dados vêm de product (backend)
  const hasDiscount =
    product.original_price && product.original_price > product.price;
  const discountPercent =
    hasDiscount && product.original_price
      ? Math.round(100 - (product.price / product.original_price) * 100)
      : 0;

  const handleAddToCart = () => {
    if (quantity > product.stock_quantity) {
      setStockAlert(true);
      setTimeout(() => setStockAlert(false), 2000);
      return;
    }
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_urls?.[0] || "",
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
        {/* Breadcrumb */}
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
          {/* Galeria de Imagens */}
          <div className="flex flex-row lg:flex-col gap-4 items-start">
            {/* Miniaturas verticais */}
            {product.image_urls && product.image_urls.length > 1 && (
              <div className="flex lg:flex-col flex-row gap-3">
                {product.image_urls.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                      selectedImage === index
                        ? "border-[#fe53b3] shadow-lg scale-105"
                        : "border-[#ede3f6] hover:border-[#fe53b3]"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Imagem ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
            {/* Imagem Principal */}
            <div
              className="aspect-square bg-white rounded-2xl overflow-hidden relative border border-[#ede3f6] shadow-lg flex-1 min-w-[260px] max-w-[480px] mx-auto"
              style={{ boxShadow: "0 2px 16px 0 #b689e020" }}
            >
              {product.image_urls && product.image_urls[selectedImage] ? (
                <Image
                  src={product.image_urls[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-contain transition-all duration-500 hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  priority={true}
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
          {/* Informações do Produto */}
          <div className="space-y-6 flex flex-col justify-center">
            <div className="space-y-4">
              <h1
                className="text-3xl md:text-4xl font-extrabold leading-tight mb-2 text-[#7b61ff] font-[Poppins]"
                style={{ fontFamily: "Poppins, Arial, sans-serif" }}
              >
                {product.name}
              </h1>
              {/* Avaliação */}
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} size={20} fill="#FFD600" stroke="#FFD600" />
                ))}
                <span className="ml-1 text-gray-700 text-base font-semibold">
                  ({reviews})
                </span>
              </div>
              {/* Preço e descontos */}
              <div className="flex items-center gap-3 flex-wrap mb-2">
                {hasDiscount && (
                  <span className="text-base text-gray-400 line-through">
                    R$ {formatPrice(product.original_price!)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="bg-[#00d26a] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {discountPercent}%OFF
                  </span>
                )}
                <span className="text-3xl font-bold text-[#fe53b3] font-[Poppins]">
                  R$ {formatPrice(product.price)}
                </span>
              </div>
              {/* Parcelamento */}
              <div className="text-base text-gray-700 font-semibold mb-2">
                6x de R${" "}
                {(product.price / 6).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}{" "}
                sem juros
              </div>
              {/* Seletor de quantidade e botão comprar */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 bg-white border border-[#ede3f6] rounded-full px-3 py-2 shadow-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="rounded-full hover:bg-[#ede3f6] hover:text-[#7b61ff] text-[#7b61ff] font-bold text-lg transition-all duration-200"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                    disabled={quantity <= 1 || product.stock_quantity === 0}
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
                      if (quantity < product.stock_quantity) {
                        setQuantity(quantity + 1);
                      } else {
                        setStockAlert(true);
                        setTimeout(() => setStockAlert(false), 2000);
                      }
                    }}
                    className="rounded-full hover:bg-[#ede3f6] hover:text-[#7b61ff] text-[#7b61ff] font-bold text-lg transition-all duration-200"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                    disabled={
                      quantity >= product.stock_quantity ||
                      product.stock_quantity === 0
                    }
                  >
                    +
                  </Button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  className="px-10 py-3 rounded-full font-bold text-white bg-[#00d26a] text-lg font-[Poppins] hover:bg-[#00b85b] hover:scale-105 transition-all duration-200 shadow-lg"
                  style={{ fontFamily: "Poppins, Arial, sans-serif" }}
                  disabled={product.stock_quantity === 0}
                >
                  COMPRAR
                </Button>
              </div>
              {/* Mensagem de erro ao tentar passar do estoque */}
              {stockAlert && (
                <div className="text-xs text-red-600 font-semibold mt-1">
                  Estoque máximo disponível!
                </div>
              )}
            </div>
            {/* Frete e extras - pode ser implementado depois */}
          </div>
        </div>
        {/* Descrição */}
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
    </>
  );
}
