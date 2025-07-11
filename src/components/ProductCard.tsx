"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";
import { useCartContext } from "@/contexts/CartContext";
import { Product } from "@/lib/supabaseClient";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cart, updateQuantity } = useCartContext();
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const cartItem = cart.find((item) => item.id === product.id);
  const hasItemInCart = !!cartItem;

  // Usar a quantidade do carrinho se o item já existe, senão usar o estado local
  const currentQuantity = hasItemInCart ? cartItem.quantity : quantity;

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
        if (!hasItemInCart) {
          setQuantity(1);
        }
      },
      quantity
    );
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock_quantity) {
      if (hasItemInCart) {
        updateQuantity(product.id, newQuantity);
      } else {
        setQuantity(newQuantity);
      }
    }
  };

  return (
    <>
      <Card className="group w-full overflow-hidden rounded-xl border border-muted/40 bg-card transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20 hover:-translate-y-1 p-2">
        <Link href={`/produto/${product.id}`}>
          <div className="relative w-full aspect-[4/5] bg-muted/30 overflow-hidden rounded-lg">
            {product.image_urls && product.image_urls[0] ? (
              <Image
                src={product.image_urls[0]}
                alt={product.name}
                fill
                className={`object-cover transition-transform duration-500 ${
                  isHovered ? "scale-105" : "scale-100"
                }`}
                sizes="(max-width: 640px) 40vw, (max-width: 1024px) 22vw, 15vw"
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
        {/* Miniaturas */}
        {product.image_urls && product.image_urls.length > 1 && (
          <div className="flex gap-2 mt-2 justify-center flex-wrap max-w-full overflow-x-auto">
            {product.image_urls.slice(0, 4).map((img, idx) => (
              <button
                key={img}
                className={`w-8 h-8 rounded-md overflow-hidden border transition-all duration-200 ${idx === 0 ? "border-primary" : "border-muted"}`}
                tabIndex={-1}
                type="button"
                aria-label={`Ver imagem ${idx + 1}`}
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <Image
                  src={img}
                  alt={product.name}
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        )}

        <CardContent className="p-2 space-y-3">
          <div className="space-y-2">
            <Link href={`/produto/${product.id}`}>
              <h3 className="font-semibold text-base font-sans line-clamp-2 group-hover:text-primary transition-colors duration-200 text-black">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-primary font-sans tracking-tight">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </span>
              {product.stock_quantity > 0 ? (
                <Badge className="text-xs bg-green-100 text-green-700 rounded-full px-3 py-1 border-none">
                  Em estoque
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-xs">
                  Indisponível
                </Badge>
              )}
            </div>
          </div>

          {!hasItemInCart ? (
            <Button
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0 || isAddingToCart}
              className={`w-full font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] rounded-2xl py-3 bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md hover:shadow-lg ${product.stock_quantity === 0 || isAddingToCart ? "opacity-60 cursor-not-allowed" : ""}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <ShoppingCart
                className={`w-4 h-4 mr-2 transition-transform duration-200 ${
                  isAddingToCart ? "animate-spin" : ""
                }`}
              />
              {isAddingToCart
                ? "Adicionando..."
                : `Adicionar${quantity > 1 ? ` ${quantity}x` : ""} ao Carrinho`}
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0 || isAddingToCart}
                className={`flex-1 font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] rounded-2xl py-3 bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md hover:shadow-lg ${product.stock_quantity === 0 || isAddingToCart ? "opacity-60 cursor-not-allowed" : ""}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <ShoppingCart
                  className={`w-4 h-4 mr-2 transition-transform duration-200 ${
                    isAddingToCart ? "animate-spin" : ""
                  }`}
                />
                {isAddingToCart
                  ? "Adicionando..."
                  : `Adicionar ${currentQuantity > 1 ? `${currentQuantity}x` : ""}`}
              </Button>
              <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(currentQuantity - 1)}
                  disabled={currentQuantity <= 1}
                  className="h-6 w-6 p-0 hover:bg-muted"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm font-semibold text-black min-w-[1.5rem] text-center">
                  {currentQuantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(currentQuantity + 1)}
                  disabled={currentQuantity >= product.stock_quantity}
                  className="h-6 w-6 p-0 hover:bg-muted"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Toast
        message={`${currentQuantity > 1 ? `${currentQuantity}x ` : ""}${product.name} adicionado ao carrinho!`}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
