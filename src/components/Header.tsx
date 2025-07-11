"use client";

import { Button } from "@/components/ui/button";
import { useCartContext } from "@/contexts/CartContext";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface HeaderProps {
  onCartClick: () => void;
}

export function Header({ onCartClick }: HeaderProps) {
  const { cart } = useCartContext();
  const [isCartHovered, setIsCartHovered] = useState(false);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold font-sans text-primary transition-colors duration-200 hover:text-primary/80">
              Manifeste
            </div>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={onCartClick}
            className="relative transition-all duration-200 hover:scale-105"
            onMouseEnter={() => setIsCartHovered(true)}
            onMouseLeave={() => setIsCartHovered(false)}
          >
            <ShoppingCart
              className={`w-5 h-5 transition-transform duration-200 ${
                isCartHovered ? "scale-110" : "scale-100"
              }`}
            />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-in zoom-in-50 duration-200">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
