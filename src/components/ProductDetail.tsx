"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";
import { useCartContext } from "@/contexts/CartContext";
import { Product } from "@/lib/supabaseClient";
import {
  ArrowLeft,
  Heart,
  Info,
  Share2,
  ShoppingCart,
  Truck,
} from "lucide-react";
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

  const handleAddToCart = () => {
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
            className="text-foreground hover:bg-muted/60 rounded-xl font-medium"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos produtos
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Galeria de Imagens */}
          <div className="space-y-4">
            {/* Imagem Principal */}
            <div
              className="aspect-square bg-white rounded-2xl overflow-hidden relative border border-[#d4af37] shadow-lg"
              style={{
                boxShadow: "0 2px 16px 0 #d4af3720",
                border: "1.5px solid #d4af37",
              }}
            >
              {product.image_urls && product.image_urls[selectedImage] ? (
                <Image
                  src={product.image_urls[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-500 hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  priority={true}
                />
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center bg-white text-[#6d348b] gap-2 rounded-2xl border-none"
                  style={{ boxShadow: "none" }}
                >
                  <span
                    style={{
                      fontSize: 48,
                      lineHeight: 1,
                      color: "#6d348b",
                      marginBottom: 8,
                    }}
                  >
                    ❤
                  </span>
                  <span
                    className="text-xs font-medium font-sans text-[#6d348b] text-center px-2"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    Em breve a foto do produto com todo o cuidado que você
                    merece!
                  </span>
                </div>
              )}
              {/* Dots de galeria */}
              {product.image_urls && product.image_urls.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {product.image_urls.map((_, idx) => (
                    <span
                      key={idx}
                      className="block w-3 h-3 rounded-full transition-all duration-200"
                      style={{
                        background:
                          selectedImage === idx ? "#ffacc2" : "#e5e5e5",
                        opacity: selectedImage === idx ? 1 : 0.6,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {product.image_urls && product.image_urls.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.image_urls.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-muted/30 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                      selectedImage === index
                        ? "border-secondary shadow-lg scale-105"
                        : "border-muted/40 hover:border-secondary/50"
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
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif leading-tight mb-2"
                    style={{
                      fontFamily: "Playfair Display, serif",
                      color: "#1a1a1a",
                    }}
                  >
                    {product.name}
                  </h1>
                  {product.sku && (
                    <p className="text-sm text-muted-foreground font-mono">
                      SKU: {product.sku}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full p-2 text-muted-foreground hover:text-secondary hover:bg-secondary/10"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full p-2 text-muted-foreground hover:text-secondary hover:bg-secondary/10"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Preço e Status */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-3xl sm:text-4xl font-bold font-sans"
                    style={{
                      color: "#6d348b",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    <span
                      className="text-lg align-bottom mr-1"
                      style={{ color: "#1a1a1a", fontWeight: 600 }}
                    >
                      R$
                    </span>
                    {formatPrice(product.price)}
                  </span>
                  <span
                    className="text-sm text-muted-foreground line-through font-sans"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    R$ {formatPrice(product.price * 1.2)}
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="rounded-full px-3 py-1 font-medium border-0 font-sans shadow-md flex items-center gap-1"
                  style={{
                    background: "#6d348b",
                    color: "#fff",
                    fontFamily: "Poppins, sans-serif",
                    boxShadow: "0 1px 4px 0 #d4af3720",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="#d4af37"
                    style={{ marginRight: 4 }}
                  >
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  {product.stock_quantity > 0
                    ? `${product.stock_quantity} em estoque`
                    : "Indisponível"}
                </Badge>
              </div>
            </div>

            {/* Quantidade e Botão */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Quantidade:
                  </label>
                  <div className="flex items-center gap-2 bg-white border border-[#d4af37]/80 rounded-[0.75rem] px-3 py-2 shadow-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="rounded-full hover:bg-[#ede3f6] hover:text-[#6d348b] text-[#6d348b] font-bold text-lg transition-all duration-200"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      -
                    </Button>
                    <span
                      className="text-xl font-bold w-8 text-center text-[#6d348b] font-sans"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      className="rounded-full hover:bg-[#ede3f6] hover:text-[#6d348b] text-[#6d348b] font-bold text-lg transition-all duration-200"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                size="lg"
                className="w-full bg-primary hover:bg-[#6d348b] text-white font-semibold text-base py-4 rounded-[0.75rem] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] font-sans"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  boxShadow: "0 2px 8px 0 #d4af3720",
                }}
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                Adicionar ao Carrinho
              </Button>
            </div>

            {/* Informações de Entrega */}
            <Card
              className="bg-gradient-to-r from-[#ffacc2]/10 to-[#ffacc2]/20 border border-0 rounded-2xl shadow-md"
              style={{ boxShadow: "0 2px 8px 0 #d4af3720" }}
            >
              <CardContent className="p-4">
                <div
                  className="flex items-center gap-3"
                  style={{ color: "#6d348b" }}
                >
                  <Truck className="w-5 h-5" style={{ color: "#6d348b" }} />
                  <div>
                    <p
                      className="font-medium text-sm"
                      style={{ color: "#6d348b" }}
                    >
                      Entrega em até 1 hora
                    </p>
                    <p className="text-xs text-[#6d348b]/80">
                      Consulte disponibilidade para sua região
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Descrição */}
            {product.description && (
              <Card
                className="bg-white border border-[#d4af37]/60 rounded-2xl shadow-md mt-4"
                style={{ boxShadow: "0 2px 8px 0 #d4af3720" }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-[#e65a4d]" />
                    <span
                      className="font-bold text-base text-[#1a1a1a] font-serif"
                      style={{ fontFamily: "Playfair Display, serif" }}
                    >
                      Descrição do Produto
                    </span>
                  </div>
                  <div
                    className="text-[#1a1a1a] text-sm font-sans"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {product.description}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Características */}
            {product.tags && product.tags.length > 0 && (
              <Card
                className="bg-white border border-[#d4af37]/60 rounded-2xl shadow-md mt-4"
                style={{ boxShadow: "0 2px 8px 0 #d4af3720" }}
              >
                <CardContent className="p-6">
                  <h3
                    className="font-bold text-lg mb-4 text-[#1a1a1a] font-serif"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Características
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-[#ede3f6] border border-[#d4af37]/60 rounded-[0.75rem] px-3 py-1 font-sans text-[#6d348b] text-sm font-medium"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          marginBottom: 4,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Especificações Técnicas */}
            {(product.weight_grams !== null ||
              product.dimensions_cm !== null) && (
              <Card
                className="bg-white border border-[#d4af37]/60 rounded-2xl shadow-md mt-4"
                style={{ boxShadow: "0 2px 8px 0 #d4af3720" }}
              >
                <CardContent className="p-6">
                  <h3
                    className="font-bold text-lg mb-4 text-[#1a1a1a] font-serif"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Especificações Técnicas
                  </h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <svg
                        width="18"
                        height="18"
                        fill="#d4af37"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                        <circle cx="12" cy="12" r="5" />
                      </svg>
                      <span
                        className="text-base text-[#1a1a1a] font-sans"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        <b>Peso:</b>{" "}
                        {product.weight_grams !== null
                          ? `${product.weight_grams}g`
                          : "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        width="18"
                        height="18"
                        fill="#d4af37"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 17v2h6v-2H3zm0-4v2h12v-2H3zm0-4v2h18V9H3z" />
                      </svg>
                      <span
                        className="text-base text-[#1a1a1a] font-sans"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        <b>Dimensões:</b>{" "}
                        {product.dimensions_cm !== null
                          ? `${product.dimensions_cm.height}cm x ${product.dimensions_cm.width}cm x ${product.dimensions_cm.length}cm`
                          : "-"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Toast
        message={`${product.name} adicionado ao carrinho!`}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
