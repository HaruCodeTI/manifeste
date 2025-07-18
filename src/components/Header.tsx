"use client";

import { Button } from "@/components/ui/button";
import { useCartContext } from "@/contexts/CartContext";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header
      className="w-full border-b"
      style={{
        background: "#b68ae1",
        fontFamily: "Poppins, Arial, sans-serif",
        borderBottom: "2px solid #b68ae1",
        borderRadius: 0,
      }}
    >
      <div className="flex flex-col items-center justify-center max-w-7xl mx-auto w-full px-4 sm:px-8 py-2 gap-2">
        <div className="flex items-center justify-center w-full py-2">
          <Link
            href="/"
            className="flex items-center select-none"
            style={{
              fontWeight: 700,
              fontSize: 28,
              fontFamily: "Poppins, Arial, sans-serif",
            }}
          >
            <Image
              src="/logo.png"
              alt="Logo Manifeste"
              width={180}
              height={60}
              priority
              draggable={false}
              style={{ objectFit: "contain", objectPosition: "center" }}
              className="h-10 w-auto max-w-[180px] p-0 m-0"
            />
          </Link>
        </div>
        {/* Menu centralizado */}
        <nav
          className="flex items-center justify-center gap-6 md:gap-10 text-base font-bold w-full"
          style={{ fontFamily: "Poppins, Arial, sans-serif" }}
        >
          <Link
            href="/"
            className="capitalize text-white hover:text-secondary transition-colors"
          >
            Início
          </Link>
          <Link
            href="/produtos"
            className="capitalize text-white hover:text-secondary transition-colors"
          >
            Produtos
          </Link>
          <Link
            href="/quem-somos"
            className="capitalize text-white hover:text-secondary transition-colors"
          >
            Sobre
          </Link>
          {categories.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-1 font-bold bg-transparent border-none outline-none capitalize text-white hover:text-secondary transition-colors"
                style={{ fontFamily: "Poppins, Arial, sans-serif" }}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                Categorias
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 mt-2 min-w-[180px] max-w-[90vw] bg-white rounded-xl shadow-lg z-50 flex flex-col py-2 animate-fadein">
                  <button
                    onClick={() => {
                      onCategoryChange("");
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg font-bold text-primary text-[1rem] transition-colors duration-200 ${selectedCategory === "" ? "bg-secondary/10 text-secondary" : "bg-transparent text-primary"} hover:bg-secondary/10 hover:text-secondary focus:bg-secondary/10 focus:text-secondary`}
                    style={{ fontFamily: "Poppins, Arial, sans-serif" }}
                  >
                    Todos
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        onCategoryChange(category.id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg font-bold text-primary text-[1rem] transition-colors duration-200 ${selectedCategory === category.id ? "bg-secondary/10 text-secondary" : "bg-transparent text-primary"} hover:bg-secondary/10 hover:text-secondary focus:bg-secondary/10 focus:text-secondary`}
                      style={{ fontFamily: "Poppins, Arial, sans-serif" }}
                    >
                      {category.name.charAt(0).toUpperCase() +
                        category.name.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>
        {/* Ícones à direita */}
        <div className="flex items-center gap-4 mt-2 w-full justify-center md:justify-end">
          <Button
            variant="secondary"
            className="px-3 py-1 rounded-full font-bold bg-secondary text-white border-2 border-accent shadow-md hover:bg-[#fe53b3] focus:bg-[#fe53b3] cursor-pointer"
            onClick={onTrackOrderClick}
            style={{ fontFamily: "Poppins, Arial, sans-serif" }}
            aria-label="Acompanhar pedidos"
          >
            Meus Pedidos
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={onCartClick}
            className="relative px-2 py-1.5 rounded-full font-bold bg-secondary text-white border-2 border-accent shadow-md hover:bg-[#fe53b3] focus:bg-[#fe53b3] cursor-pointer"
            style={{ fontFamily: "Poppins, Arial, sans-serif" }}
            onMouseEnter={() => setIsCartHovered(true)}
            onMouseLeave={() => setIsCartHovered(false)}
            aria-label="Abrir carrinho"
          >
            <ShoppingCart
              className={`w-5 h-5 transition-transform duration-200 font-bold text-white ${isCartHovered ? "scale-110" : "scale-100"}`}
            />
            {itemCount > 0 && (
              <span className="pointer-events-none select-none absolute -top-2 -right-2 bg-[#00ff00] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white z-10">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
