"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";
import { useCartContext } from "@/contexts/CartContext";
import { Product } from "@/lib/supabaseClient";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartContext();
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_urls?.[0] || "",
      },
      () => {
        setShowToast(true);
        setTimeout(() => setIsAddingToCart(false), 500);
      }
    );
  };

  return (
    <>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 border-border/50 bg-card/50 hover:bg-card">
        <Link href={`/produto/${product.id}`}>
          <div className="aspect-square bg-muted/30 relative overflow-hidden">
            {product.image_urls && product.image_urls[0] ? (
              <Image
                src={product.image_urls[0]}
                alt={product.name}
                fill
                className={`object-cover transition-transform duration-500 ${
                  isHovered ? "scale-110" : "scale-100"
                }`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                Sem imagem
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>
        </Link>

        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <Link href={`/produto/${product.id}`}>
              <h3 className="font-semibold text-base font-sans line-clamp-2 group-hover:text-primary transition-colors duration-200">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </span>
              {product.stock_quantity > 0 ? (
                <Badge variant="secondary" className="text-xs">
                  Em estoque
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-xs">
                  Indisponível
                </Badge>
              )}
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0 || isAddingToCart}
            className="w-full font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <ShoppingCart
              className={`w-4 h-4 mr-2 transition-transform duration-200 ${
                isAddingToCart ? "animate-spin" : ""
              }`}
            />
            {isAddingToCart ? "Adicionando..." : "Adicionar ao Carrinho"}
          </Button>
        </CardContent>
      </Card>

      <Toast
        message={`${product.name} adicionado ao carrinho!`}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
