"use client";

import { Header } from "@/components/Header";
import { ShoppingCart } from "@/components/ShoppingCart";
import { LoadingGrid } from "@/components/ui/loading";
import { Product, supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from("categories")
        .select("id, name, slug");
      setCategories(data || []);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch("");
    }, 400);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      let query = supabase
        .from("products")
        .select("*", { count: "exact" })
        .eq("status", "active");
      if (debouncedSearch) query = query.ilike("name", `%${debouncedSearch}%`);
      if (selectedCategory) query = query.eq("category_id", selectedCategory);
      query = query
        .order("created_at", { ascending: false })
        .range((page - 1) * 12, page * 12 - 1);
      const { data, count, error } = await query;
      if (!error) {
        setProducts(data || []);
        setTotalPages(count ? Math.ceil(count / 12) : 1);
      }
      setLoading(false);
    }
    fetchProducts();
  }, [debouncedSearch, selectedCategory, page]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(1); // Reset para primeira página ao mudar categoria
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        onTrackOrderClick={() => (window.location.href = "/acompanhar")}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-serif mb-2 text-black">
              Catálogo
            </h2>
          </div>
          {/* Grid de produtos minimalista */}
          {loading ? (
            <LoadingGrid />
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <p className="text-muted-foreground text-lg">
                Nenhum produto disponível no momento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/produto/${product.id}`}
                  className="group block bg-white rounded-none overflow-hidden transition-transform hover:-translate-y-1"
                  style={{ boxShadow: "none", border: "none" }}
                >
                  <div className="relative w-full aspect-[4/5] bg-white overflow-hidden flex items-center justify-center">
                    {/* Badge Oferta */}
                    {product.is_offer && (
                      <span className="absolute top-2 left-2 z-10 bg-black text-white text-[11px] font-medium rounded-full px-3 py-0.5 tracking-wide">
                        Oferta
                      </span>
                    )}
                    {/* Imagem principal e hover */}
                    {product.image_urls && product.image_urls.length > 0 ? (
                      <img
                        src={product.image_urls[0]}
                        alt={product.name}
                        className="object-cover w-full h-full transition-opacity duration-300 group-hover:opacity-0"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        Sem imagem
                      </div>
                    )}
                    {product.image_urls && product.image_urls.length > 1 && (
                      <img
                        src={product.image_urls[1]}
                        alt={product.name}
                        className="object-cover w-full h-full absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="pt-4 pb-4 px-1 text-center">
                    <h3
                      className="font-serif font-medium text-lg mb-1 text-black leading-tight tracking-tight"
                      style={{ fontFamily: "Playfair Display, serif" }}
                    >
                      {product.name}
                    </h3>
                    <div className="flex flex-col items-center gap-0.5">
                      {typeof product.original_price === "number" &&
                      product.original_price > product.price ? (
                        <span className="text-sm text-muted-foreground line-through">
                          {product.original_price.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      ) : null}
                      <span className="flex items-end justify-center gap-1">
                        <span className="font-normal text-base text-black">
                          R$
                        </span>
                        <span
                          className="font-serif text-xl font-light tracking-tight text-black"
                          style={{ fontFamily: "Playfair Display, serif" }}
                        >
                          {product.price
                            .toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                            .replace(/^\d{1,3}(?=(\d{3})+(?!\d))/g, "$&.")
                            .split(",")[0]
                            .replace("R$", "")
                            .trim()}
                          ,{product.price.toFixed(2).split(".")[1]}
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {/* Paginação minimalista */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-white border border-neutral-200 text-black hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`w-10 h-10 rounded-lg border font-medium transition-all duration-200 ${
                      page === pageNumber
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-neutral-200 hover:bg-neutral-100"
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg bg-white border border-neutral-200 text-black hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      </main>
      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
