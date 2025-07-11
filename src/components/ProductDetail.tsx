"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";
import { useCartContext } from "@/contexts/CartContext";
import { Product } from "@/lib/supabaseClient";
import { ArrowLeft, Package, Ruler, ShoppingCart } from "lucide-react";
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
      }
    );
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-foreground">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="font-sans hover:bg-muted/60"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos produtos
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Galeria de Imagens */}
          <div className="space-y-6">
            <div className="aspect-square bg-muted/30 rounded-xl overflow-hidden relative border border-border/50">
              {product.image_urls && product.image_urls[selectedImage] ? (
                <Image
                  src={product.image_urls[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-300 hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  priority={false}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                  Sem imagem disponível
                </div>
              )}
            </div>

            {/* Miniaturas */}
            {product.image_urls && product.image_urls.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.image_urls.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-muted/50 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:border-primary/50 ${
                      selectedImage === index
                        ? "border-primary shadow-md"
                        : "border-transparent hover:shadow-sm"
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

          {/* Informações do Produto */}
          <div className="space-y-8">
            {/* Título e Preço */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-bold font-sans leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-3xl sm:text-4xl font-bold text-primary">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </span>
                {product.stock_quantity > 0 ? (
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    Em estoque
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-sm px-3 py-1">
                    Indisponível
                  </Badge>
                )}
              </div>
            </div>

            {/* Descrição */}
            {product.description && (
              <Card className="bg-muted/20 border border-border/50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3 font-sans text-lg">
                    Descrição
                  </h3>
                  <p className="text-muted-foreground whitespace-pre-wrap text-base font-sans leading-relaxed">
                    {product.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold font-sans text-lg">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Especificações */}
            {(product.weight_grams || product.dimensions_cm) && (
              <div className="space-y-3">
                <h3 className="font-semibold font-sans text-lg">
                  Especificações
                </h3>
                <div className="space-y-3">
                  {product.weight_grams && (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Package className="w-4 h-4" />
                      <span>Peso: {product.weight_grams}g</span>
                    </div>
                  )}
                  {product.dimensions_cm && (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Ruler className="w-4 h-4" />
                      <span>
                        Dimensões: {product.dimensions_cm.height}cm x{" "}
                        {product.dimensions_cm.width}cm x{" "}
                        {product.dimensions_cm.length}cm
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Botão de Adicionar ao Carrinho */}
            <div className="pt-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base py-6 hover:scale-[1.02] transition-transform duration-200 rounded-xl"
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                Adicionar ao Carrinho
              </Button>
            </div>
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
