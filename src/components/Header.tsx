"use client";

import { Button } from "@/components/ui/button";
import { useCartContext } from "@/contexts/CartContext";
import { Menu, ShoppingCart } from "lucide-react";
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
      className="w-full bg-primary text-white border-b"
      style={{
        fontFamily: "Montserrat, Arial, sans-serif",
        borderRadius: "0 0 0 0",
        borderBottom: "2px solid #a06cc1",
      }}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto w-full px-4 sm:px-8 py-3">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <Link
            href="/"
            className="flex items-center select-none"
            style={{
              fontWeight: 700,
              fontSize: 28,
              fontFamily: "Montserrat, Arial, sans-serif",
            }}
          >
            <Image
              src="/logo.svg"
              alt="Logo Manifeste"
              width={160}
              height={40}
              priority
              draggable={false}
              style={{ objectFit: "contain", objectPosition: "center" }}
              className="h-10 w-auto max-w-[180px] p-0 m-0"
            />
          </Link>
        </div>
        {/* Desktop Menu */}
        <nav
          className="hidden md:flex items-center gap-6 lg:gap-8 text-base font-bold font-sans"
          style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
        >
          <Link href="/" className="hover:text-secondary transition-colors">
            INÍCIO
          </Link>
          <Link
            href="/produtos"
            className="hover:text-secondary transition-colors"
          >
            PRODUTOS
          </Link>
          <Link
            href="/quem-somos"
            className="hover:text-secondary transition-colors"
          >
            SOBRE
          </Link>

          {categories.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-1 font-bold bg-transparent border-none outline-none hover:text-secondary transition-colors"
                style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
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
                <div className="absolute left-0 mt-2 min-w-[180px] max-w-[90vw] bg-white rounded-xl shadow-lg z-50 flex flex-col py-2 animate-fadein">
                  <button
                    onClick={() => {
                      onCategoryChange("");
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg font-sans font-bold text-primary text-[1rem] transition-colors duration-200 ${
                      selectedCategory === ""
                        ? "bg-secondary/10 text-secondary"
                        : "bg-transparent text-primary"
                    } hover:bg-secondary/10 hover:text-secondary focus:bg-secondary/10 focus:text-secondary`}
                    style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
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
                      className={`w-full text-left px-4 py-2 rounded-lg font-sans font-bold text-primary text-[1rem] transition-colors duration-200 ${
                        selectedCategory === category.id
                          ? "bg-secondary/10 text-secondary"
                          : "bg-transparent text-primary"
                      } hover:bg-secondary/10 hover:text-secondary focus:bg-secondary/10 focus:text-secondary`}
                      style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>
        {/* Carrinho e Pedido */}
        <div className="flex items-center gap-2 md:gap-3">
          <Button
            variant="secondary"
            size="icon"
            onClick={onCartClick}
            className="relative px-2 py-1.5 rounded-full font-bold font-sans bg-secondary text-white border-2 border-accent shadow-md hover:bg-[#fe53b3] focus:bg-[#fe53b3]"
            style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
            onMouseEnter={() => setIsCartHovered(true)}
            onMouseLeave={() => setIsCartHovered(false)}
            aria-label="Abrir carrinho"
          >
            <ShoppingCart
              className={`w-5 h-5 transition-transform duration-200 font-bold text-white ${
                isCartHovered ? "scale-110" : "scale-100"
              }`}
            />
            {itemCount > 0 && (
              <span className="pointer-events-none select-none absolute -top-2 -right-2 bg-[#00ff00] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white z-10">
                {itemCount}
              </span>
            )}
          </Button>
          <Button
            variant="secondary"
            className="px-3 py-1 rounded-full font-bold font-sans bg-secondary text-white border-2 border-accent shadow-md hover:bg-[#fe53b3] focus:bg-[#fe53b3] hidden md:block"
            onClick={onTrackOrderClick}
            style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
          >
            <span>Acompanhar Pedido</span>
          </Button>
          {/* Menu Mobile */}
          <button
            className="md:hidden ml-2 p-2 rounded-full hover:bg-secondary/20 transition"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="w-7 h-7 text-white" />
          </button>
        </div>
      </div>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#ede3f6]/95 flex flex-col">
          <div className="flex justify-end p-4">
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Fechar menu"
              className="rounded-full p-2 text-primary hover:bg-[#ede3f6] hover:text-[#8e44ad] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
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
          <nav
            className="flex flex-col gap-4 items-center justify-center flex-1 text-lg font-bold font-sans"
            style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
          >
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3 rounded-xl font-bold text-primary bg-transparent hover:bg-[#ede3f6] hover:text-[#8e44ad] transition-colors w-[90vw] max-w-xs text-center"
            >
              INÍCIO
            </Link>
            <Link
              href="/produtos"
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3 rounded-xl font-bold text-primary bg-transparent hover:bg-[#ede3f6] hover:text-[#8e44ad] transition-colors w-[90vw] max-w-xs text-center"
            >
              PRODUTOS
            </Link>
            <Link
              href="/quem-somos"
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3 rounded-xl font-bold text-primary bg-transparent hover:bg-[#ede3f6] hover:text-[#8e44ad] transition-colors w-[90vw] max-w-xs text-center"
            >
              SOBRE
            </Link>
            <Link
              href="/missao-visao-valores"
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3 rounded-xl font-bold text-primary bg-transparent hover:bg-[#ede3f6] hover:text-[#8e44ad] transition-colors w-[90vw] max-w-xs text-center"
            >
              PROPÓSITO
            </Link>
            <Link
              href="/acompanhar"
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3 rounded-xl font-bold text-primary bg-transparent hover:bg-[#ede3f6] hover:text-[#8e44ad] transition-colors w-[90vw] max-w-xs text-center"
            >
              AJUDA
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3 rounded-xl font-bold text-primary bg-transparent hover:bg-[#ede3f6] hover:text-[#8e44ad] transition-colors w-[90vw] max-w-xs text-center"
            >
              ÁREA ADMIN
            </Link>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3 rounded-xl font-bold text-primary bg-transparent hover:bg-[#ede3f6] hover:text-[#8e44ad] transition-colors w-[90vw] max-w-xs text-center"
            >
              CLUBE
            </Link>
            {categories.length > 0 && (
              <div className="w-full flex flex-col items-center">
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-1 px-6 py-3 rounded-xl font-bold text-primary bg-transparent hover:bg-[#ede3f6] hover:text-[#8e44ad] transition-colors w-[90vw] max-w-xs justify-center"
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
                  <div className="w-[90vw] max-w-xs bg-[#ede3f6] rounded-xl shadow-lg z-50 flex flex-col py-2 animate-fadein mt-2">
                    <button
                      onClick={() => {
                        onCategoryChange("");
                        setDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold text-primary text-[1rem] transition-colors duration-200 ${
                        selectedCategory === ""
                          ? "bg-[#ede3f6] text-[#8e44ad]"
                          : "bg-transparent text-primary"
                      } hover:bg-[#ede3f6] hover:text-[#8e44ad] focus:bg-[#ede3f6] focus:text-[#8e44ad]`}
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
                        className={`w-full text-left px-4 py-3 rounded-xl font-bold text-primary text-[1rem] transition-colors duration-200 ${
                          selectedCategory === category.id
                            ? "bg-[#ede3f6] text-[#8e44ad]"
                            : "bg-transparent text-primary"
                        } hover:bg-[#ede3f6] hover:text-[#8e44ad] focus:bg-[#ede3f6] focus:text-[#8e44ad]`}
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
