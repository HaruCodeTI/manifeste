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
    <header className="w-full bg-black text-white border-b border-border">
      <div className="w-full text-center text-xs py-1.5 bg-black/90 border-b border-border font-medium tracking-wide">
        Parcele em até 6x sem juros!
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between max-w-7xl mx-auto w-full px-4 sm:px-8 py-4 gap-2 md:gap-0">
        <div className="flex justify-center md:justify-start w-full md:w-auto mb-2 md:mb-0">
          <Link
            href="/"
            className="select-none flex items-center justify-center"
          >
            <Image
              src="/logo.png"
              alt="Logo Manifeste"
              width={220}
              height={48}
              className="h-10 sm:h-12 w-auto"
              priority
              draggable={false}
            />
          </Link>
        </div>
        <nav className="flex justify-center items-center gap-4 md:gap-8 text-base font-medium font-sans relative w-full">
          <Link
            href="/"
            className="hover:text-foreground/80 transition text-foreground/60"
          >
            INÍCIO
          </Link>
          <Link
            href="/produtos"
            className="hover:text-foreground/80 transition text-foreground/60"
          >
            PRODUTOS
          </Link>
          {categories.length > 0 && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-1 px-3 py-2 rounded hover:bg-neutral-800 transition select-none"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                CATEGORIAS
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
                <div className="absolute left-0 mt-2 w-48 bg-black border border-neutral-700 rounded shadow-lg z-50 flex flex-col py-2 animate-fadein">
                  <button
                    onClick={() => {
                      onCategoryChange("");
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-neutral-900 transition ${selectedCategory === "" ? "text-white font-bold" : "text-foreground/60"}`}
                  >
                    TODOS
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        onCategoryChange(category.id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-neutral-900 transition ${selectedCategory === category.id ? "text-white font-bold" : "text-foreground/60"}`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>
        <div className="flex items-center gap-3 justify-center md:justify-end w-full md:w-auto mt-2 md:mt-0">
          <Button
            variant="secondary"
            size="icon"
            onClick={onCartClick}
            className="relative ml-2 px-2 py-1.5 rounded-full font-medium text-white bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 transition text-sm flex-1 min-w-0 max-w-[50%] md:max-w-none md:flex-initial md:block"
            style={{ minWidth: 0 }}
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
              <span
                className="pointer-events-none select-none"
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  background: "#ffacc2",
                  color: "#000",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  borderRadius: "9999px",
                  width: 22,
                  height: 22,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 1px 4px 0 #0002",
                  zIndex: 10,
                  border: "2px solid #222",
                  lineHeight: 1,
                }}
              >
                {itemCount}
              </span>
            )}
          </Button>
          <Button
            variant="secondary"
            className="ml-2 px-2 py-1 rounded-full font-medium text-white bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 transition text-xs flex-1 min-w-0 max-w-[50%] md:max-w-none md:flex-initial md:block md:px-4 md:py-1.5 md:text-sm"
            onClick={onTrackOrderClick}
            style={{ minWidth: 0 }}
          >
            <span className="hidden xs:inline md:inline">
              Acompanhar Pedido
            </span>
            <span className="inline xs:hidden md:hidden">Pedido</span>
          </Button>
        </div>
      </div>
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
          <nav className="flex flex-col gap-6 items-center justify-center flex-1 text-lg font-medium font-sans">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-foreground/80 transition text-foreground/60"
            >
              INÍCIO
            </Link>
            <Link
              href="/produtos"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-foreground/80 transition text-foreground/60"
            >
              PRODUTOS
            </Link>
            {categories.length > 0 && (
              <div className="w-full flex flex-col items-center">
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-1 px-3 py-2 rounded hover:bg-neutral-800 transition select-none w-full justify-center"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  CATEGORIAS
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
                  <div className="w-full bg-black border border-neutral-700 rounded shadow-lg z-50 flex flex-col py-2 animate-fadein mt-2">
                    <button
                      onClick={() => {
                        onCategoryChange("");
                        setDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-neutral-900 transition ${selectedCategory === "" ? "text-white font-bold" : "text-foreground/60"}`}
                    >
                      TODOS
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          onCategoryChange(category.id);
                          setDropdownOpen(false);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-neutral-900 transition ${selectedCategory === category.id ? "text-white font-bold" : "text-foreground/60"}`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
