"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";
import { useCartContext } from "@/contexts/CartContext";
import { Product } from "@/lib/supabaseClient";
import {
  ArrowLeft,
  CheckCircle,
  Heart,
  Info,
  Package,
  Ruler,
  Share2,
  Shield,
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
            <div className="aspect-square bg-gradient-to-br from-muted/20 to-muted/40 rounded-2xl overflow-hidden relative border border-muted/30 shadow-lg">
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
                <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-white gap-2">
                  <span style={{ fontSize: 44, lineHeight: 1 }}>🤫</span>
                  <span className="text-xs font-medium text-white/80">
                    Surpresa! Imagem indisponível 😏
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
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif leading-tight mb-2 text-foreground">
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
                  <span className="text-3xl sm:text-4xl font-bold text-foreground">
                    R$ {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    R$ {formatPrice(product.price * 1.2)}
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="rounded-full px-3 py-1 font-medium border-0"
                  style={{ background: "#ffacc2", color: "#000" }}
                >
                  <CheckCircle
                    className="w-3 h-3 mr-1"
                    style={{ color: "#ffacc2" }}
                  />
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
                  <div className="flex items-center border border-muted/40 rounded-xl overflow-hidden">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="rounded-none hover:bg-muted/50 text-foreground"
                    >
                      -
                    </Button>
                    <span className="px-4 py-2 text-foreground font-medium min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      className="rounded-none hover:bg-muted/50 text-foreground"
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
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-base py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                Adicionar ao Carrinho
              </Button>
            </div>

            {/* Informações de Entrega */}
            <Card className="bg-gradient-to-r from-[#ffacc2]/10 to-[#ffacc2]/20 border border-0 rounded-2xl">
              <CardContent className="p-4">
                <div
                  className="flex items-center gap-3"
                  style={{ color: "#ffacc2" }}
                >
                  <Truck className="w-5 h-5" style={{ color: "#ffacc2" }} />
                  <div>
                    <p
                      className="font-medium text-sm"
                      style={{ color: "#ffacc2" }}
                    >
                      Entrega em até 1 hora
                    </p>
                    <p
                      className="text-xs text-muted-foreground"
                      style={{ color: "#ffacc2" }}
                    >
                      Consulte disponibilidade para sua região
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Descrição */}
            {product.description && (
              <Card className="bg-background border border-muted/30 rounded-2xl shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg font-serif mb-4 flex items-center gap-2 text-foreground">
                    <Info className="w-5 h-5 text-secondary" />
                    Descrição do Produto
                  </h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {product.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <Card className="bg-background border border-muted/30 rounded-2xl shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-foreground mb-4">
                    Características
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-muted/20 text-foreground border-muted/40 rounded-full px-3 py-1 font-medium hover:bg-secondary/10 hover:border-secondary/30 transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Especificações */}
            {(product.weight_grams || product.dimensions_cm) && (
              <Card className="bg-background border border-muted/30 rounded-2xl shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-foreground mb-4">
                    Especificações Técnicas
                  </h3>
                  <div className="space-y-3">
                    {product.weight_grams && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Package className="w-4 h-4 text-secondary" />
                        <span className="font-medium">Peso:</span>
                        <span>{product.weight_grams}g</span>
                      </div>
                    )}
                    {product.dimensions_cm && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Ruler className="w-4 h-4 text-secondary" />
                        <span className="font-medium">Dimensões:</span>
                        <span>
                          {product.dimensions_cm.height}cm x{" "}
                          {product.dimensions_cm.width}cm x{" "}
                          {product.dimensions_cm.length}cm
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Garantia */}
            <Card className="bg-gradient-to-r from-[#ffacc2]/10 to-[#ffacc2]/20 border-0 rounded-2xl">
              <CardContent className="p-4">
                <div
                  className="flex items-center gap-3"
                  style={{ color: "#ffacc2" }}
                >
                  <Shield className="w-5 h-5" style={{ color: "#ffacc2" }} />
                  <div>
                    <p
                      className="font-medium text-sm"
                      style={{ color: "#ffacc2" }}
                    >
                      Garantia de 30 dias
                    </p>
                    <p className="text-xs" style={{ color: "#ffacc2" }}>
                      Devolução gratuita
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
