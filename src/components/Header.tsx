"use client";

import { Button } from "@/components/ui/button";
import { useCartContext } from "@/contexts/CartContext";
import { Menu, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface HeaderProps {
  onCartClick: () => void;
  onTrackOrderClick: () => void;
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function Header({
  onCartClick,
  onTrackOrderClick,
  categories,
  selectedCategory,
  onCategoryChange,
}: HeaderProps) {
  const { cart } = useCartContext();
  const [isCartHovered, setIsCartHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="w-full bg-black text-white border-b border-border">
      {/* Barra de aviso */}
      <div className="w-full text-center text-xs py-1.5 bg-black/90 border-b border-border font-medium tracking-wide">
        Parcele em até 6x sem juros!
      </div>
      {/* Logo centralizada */}
      <div className="flex flex-col items-center justify-center py-4">
        <Link href="/" className="select-none">
          <span className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
            Manifeste
          </span>
        </Link>
      </div>
      {/* Menu + ícones */}
      <div className="relative flex items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto pb-1">
        {/* Ícone de busca (desktop) */}
        <button
          className="hidden md:flex items-center justify-center w-8 h-8"
          aria-label="Buscar"
        >
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
        {/* Menu hambúrguer (mobile) */}
        <button
          className="md:hidden flex items-center justify-center w-8 h-8"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        {/* Navegação (desktop) */}
        <nav className="hidden md:flex gap-6 mx-auto text-base font-medium font-sans">
          <button
            onClick={() => onCategoryChange("")}
            className={`hover:text-foreground/80 transition ${
              selectedCategory === "" ? "text-white" : "text-foreground/60"
            }`}
          >
            TODOS
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`hover:text-foreground/80 transition ${
                selectedCategory === category.id
                  ? "text-white"
                  : "text-foreground/60"
              }`}
            >
              {category.name.toUpperCase()}
            </button>
          ))}
        </nav>
        {/* Ícones à direita */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="icon"
            onClick={onCartClick}
            className="ml-2 px-2 py-1.5 rounded-full font-medium text-white bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 transition hidden md:block text-sm"
            onMouseEnter={() => setIsCartHovered(true)}
            onMouseLeave={() => setIsCartHovered(false)}
            aria-label="Abrir carrinho"
          >
            <ShoppingCart
              className={`w-5 h-5 transition-transform duration-200 text-foreground ${
                isCartHovered ? "scale-110" : "scale-100"
              }`}
            />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-in zoom-in-50 duration-200">
                {itemCount}
              </span>
            )}
          </Button>
          <Button
            variant="secondary"
            className="ml-2 px-4 py-1.5 rounded-full font-medium text-white bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 transition hidden md:block text-sm"
            onClick={onTrackOrderClick}
          >
            Acompanhar Pedido
          </Button>
        </div>
      </div>
      {/* Menu mobile drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
          <div className="flex justify-end p-4">
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Fechar menu"
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col gap-5 items-center justify-center flex-1 text-lg font-medium font-sans">
            <button
              onClick={() => {
                onCategoryChange("");
                setMobileMenuOpen(false);
              }}
              className={`hover:text-foreground/80 transition ${
                selectedCategory === "" ? "text-white" : "text-foreground/60"
              }`}
            >
              TODOS
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onCategoryChange(category.id);
                  setMobileMenuOpen(false);
                }}
                className={`hover:text-foreground/80 transition ${
                  selectedCategory === category.id
                    ? "text-white"
                    : "text-foreground/60"
                }`}
              >
                {category.name.toUpperCase()}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
