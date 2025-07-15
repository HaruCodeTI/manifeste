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
      className="w-full bg-primary text-white border-b"
      style={{
        fontFamily: "Montserrat, Arial, sans-serif",
        borderRadius: "0 0 var(--radius) var(--radius)",
        borderBottom: "2px solid #a06cc1",
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between max-w-7xl mx-auto w-full px-4 sm:px-8 py-4 gap-2 md:gap-0">
        <div className="flex justify-center md:justify-start w-full md:w-auto mb-2 md:mb-0">
          <Link
            href="/"
            className="select-none flex items-center justify-center"
            style={{
              fontWeight: 700,
              letterSpacing: "0.04em",
              fontSize: 32,
              fontFamily: "Montserrat, Arial, sans-serif",
              lineHeight: 1,
            }}
          >
            <Image
              src="/logo.svg"
              alt="Logo Manifeste"
              width={250}
              height={50}
              priority
              draggable={false}
              style={{
                display: 'block',
                width: '250px',
                height: '50px',
                objectFit: 'contain',
                objectPosition: 'center',
                flexShrink: 0
              }}
            />
          </Link>
        </div>
        <nav className="flex justify-center items-center gap-4 md:gap-8 text-base font-medium font-sans relative w-full">
          <Link
            href="/"
            className="transition-colors duration-200 text-white px-2 py-1 rounded-md font-sans hover:text-secondary focus:text-secondary"
            style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
          >
            INÍCIO
          </Link>
          <Link
            href="/produtos"
            className="transition-colors duration-200 text-white px-2 py-1 rounded-md font-sans hover:text-secondary focus:text-secondary"
            style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
          >
            PRODUTOS
          </Link>
          {categories.length > 0 && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                className={`transition-colors duration-200 text-white px-2 py-1 rounded-md font-sans hover:text-secondary focus:text-secondary font-medium select-none bg-transparent border-none outline-none flex items-center gap-1`}
                style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 500 }}
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
                <div
                  className="absolute left-0 mt-2 min-w-[180px] max-w-[90vw] bg-white rounded-xl shadow-lg z-50 flex flex-col py-2 animate-fadein"
                  style={{ border: "none" }}
                >
                  <button
                    onClick={() => {
                      onCategoryChange("");
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg font-sans font-medium text-primary text-[1rem] transition-colors duration-200 ${selectedCategory === "" ? "bg-secondary/10 text-secondary" : "bg-transparent text-primary"} hover:bg-secondary/10 hover:text-secondary focus:bg-secondary/10 focus:text-secondary`}
                    style={{ border: "none", fontFamily: 'Montserrat, Arial, sans-serif' }}
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
                      className={`w-full text-left px-4 py-2 rounded-lg font-sans font-medium text-primary text-[1rem] transition-colors duration-200 ${selectedCategory === category.id ? "bg-secondary/10 text-secondary" : "bg-transparent text-primary"} hover:bg-secondary/10 hover:text-secondary focus:bg-secondary/10 focus:text-secondary`}
                      style={{ border: "none", fontFamily: 'Montserrat, Arial, sans-serif' }}
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
            className="relative ml-2 px-2 py-1.5 rounded-full font-medium font-sans bg-secondary text-white border-2 border-accent shadow-md transition-colors duration-200 hover:bg-[#fe53b3] focus:bg-[#fe53b3]"
            style={{
              minWidth: 0,
              fontFamily: "Poppins, sans-serif",
              boxShadow: "0 2px 8px 0 #d4af3720",
            }}
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
              <span
                className="pointer-events-none select-none"
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  background: "#00ff00", 
                  color: "#fff",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  borderRadius: "9999px",
                  width: 22,
                  height: 22,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 1px 4px 0 #d4af3720",
                  zIndex: 10,
                  border: "2px solid #fff",
                  lineHeight: 1,
                }}
              >
                {itemCount}
              </span>
            )}
          </Button>
          <Button
            variant="secondary"
            className="ml-2 px-2 py-1 rounded-full font-medium font-sans bg-secondary text-white border-2 border-accent shadow-md transition-colors duration-200 hover:bg-[#fe53b3] focus:bg-[#fe53b3] md:px-4 md:py-1.5 md:text-sm"
            onClick={onTrackOrderClick}
            style={{
              minWidth: 0,
              fontFamily: "Poppins, sans-serif",
              boxShadow: "0 2px 8px 0 #d4af3720",
            }}
          >
            <span className="hidden xs:inline md:inline font-bold">
              Acompanhar Pedido
            </span>
            <span className="inline xs:hidden md:hidden font-bold">Pedido</span>
          </Button>
        </div>
      </div>
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
          <nav className="flex flex-col gap-6 items-center justify-center flex-1 text-lg font-medium font-sans">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3 rounded-[0.75rem] font-sans font-medium text-primary bg-transparent hover:bg-[#ede3f6] hover:text-[#8e44ad] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 w-[90vw] max-w-xs text-center"
            >
              INÍCIO
            </Link>
            <Link
              href="/produtos"
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3 rounded-[0.75rem] font-sans font-medium text-primary bg-transparent hover:bg-[#ede3f6] hover:text-[#8e44ad] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 w-[90vw] max-w-xs text-center"
            >
              PRODUTOS
            </Link>
            {categories.length > 0 && (
              <div className="w-full flex flex-col items-center">
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-1 px-6 py-3 rounded-[0.75rem] font-sans font-medium text-primary bg-transparent hover:bg-[#ede3f6] hover:text-[#8e44ad] transition-colors duration-200 select-none w-[90vw] max-w-xs justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
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
                  <div
                    className="w-[90vw] max-w-xs bg-[#ede3f6] rounded-[0.75rem] shadow-lg z-50 flex flex-col py-2 animate-fadein mt-2"
                    style={{ border: "none" }}
                  >
                    <button
                      onClick={() => {
                        onCategoryChange("");
                        setDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-[0.75rem] font-sans font-medium text-primary text-[1rem] transition-colors duration-200 ${selectedCategory === "" ? "bg-[#ede3f6] text-[#8e44ad]" : "bg-transparent text-primary"} hover:bg-[#ede3f6] hover:text-[#8e44ad] focus:bg-[#ede3f6] focus:text-[#8e44ad] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40`}
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
                        className={`w-full text-left px-4 py-3 rounded-[0.75rem] font-sans font-medium text-primary text-[1rem] transition-colors duration-200 ${selectedCategory === category.id ? "bg-[#ede3f6] text-[#8e44ad]" : "bg-transparent text-primary"} hover:bg-[#ede3f6] hover:text-[#8e44ad] focus:bg-[#ede3f6] focus:text-[#8e44ad] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40`}
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
