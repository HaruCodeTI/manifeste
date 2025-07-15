"use client";

import { Header } from "@/components/Header";
import { ShoppingCart } from "@/components/ShoppingCart";
import { LoadingGrid } from "@/components/ui/loading";
import { gtagEvent } from "@/lib/gtag";
import { Product, supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sort, setSort] = useState<
    "featured" | "price_asc" | "price_desc" | "az" | "za"
  >("featured");

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
      if (sort === "price_asc")
        query = query.order("price", { ascending: true });
      else if (sort === "price_desc")
        query = query.order("price", { ascending: false });
      else if (sort === "az") query = query.order("name", { ascending: true });
      else if (sort === "za") query = query.order("name", { ascending: false });
      else query = query.order("created_at", { ascending: false });
      query = query.range((page - 1) * itemsPerPage, page * itemsPerPage - 1);
      const { data, count, error } = await query;
      if (!error) {
        setProducts(data || []);
        setTotalPages(count ? Math.ceil(count / itemsPerPage) : 1);
      }
      setLoading(false);
    }
    fetchProducts();
  }, [debouncedSearch, selectedCategory, page, itemsPerPage, sort]);

  useEffect(() => {
    if (products.length > 0) {
      gtagEvent("view_item_list", {
        item_list_id: selectedCategory || "catalogo",
        item_list_name: selectedCategory || "Catálogo Principal",
        items: products.map((p, idx) => ({
          item_id: p.id,
          item_name: p.name,
          index: idx + 1,
          price: p.price,
        })),
      });
    }
  }, [products, selectedCategory]);

  // Evento GA4: clique em produto
  function handleProductClick(product: Product, idx: number) {
    gtagEvent("select_item", {
      item_list_id: selectedCategory || "catalogo",
      item_list_name: selectedCategory || "Catálogo Principal",
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          index: idx + 1,
          price: product.price,
        },
      ],
    });
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#ede3f6]">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        onTrackOrderClick={() => (window.location.href = "/acompanhar")}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 px-1">
            <div
              className="flex items-center gap-2 text-primary text-lg font-sans"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <span className="font-medium">Ordenar por:</span>
              <select
                value={sort}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setSort(e.target.value as typeof sort);
                  setPage(1);
                }}
                className="bg-transparent border-none outline-none font-medium text-lg cursor-pointer font-sans"
                style={{ minWidth: 120, fontFamily: "Poppins, sans-serif" }}
              >
                <option value="featured">Em destaque</option>
                <option value="price_asc">Menor preço</option>
                <option value="price_desc">Maior preço</option>
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
              </select>
            </div>
            <div
              className="flex items-center gap-2 text-primary text-lg font-sans"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <span className="font-medium">Exibir:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-transparent border-none outline-none font-medium text-lg cursor-pointer font-sans"
                style={{ minWidth: 60, fontFamily: "Poppins, sans-serif" }}
              >
                {[4, 8, 12, 20, 40].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span
                className="ml-4 text-primary text-lg font-medium font-sans"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {products.length} produto{products.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          {loading ? (
            <LoadingGrid />
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <p
                className="text-muted-foreground text-lg font-sans"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Nenhum produto disponível no momento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map((product, idx) => (
                <Link
                  key={product.id}
                  href={`/produto/${product.id}`}
                  className="group block bg-white rounded-[0.75rem] overflow-hidden transition-transform hover:-translate-y-1 shadow-md border border-[#d4af37]/80 hover:shadow-xl hover:border-[#d4af37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/40"
                  style={{
                    boxShadow: "0 2px 12px 0 #d4af3720",
                    border: "1.5px solid #d4af37",
                  }}
                  onClick={() => handleProductClick(product, idx)}
                >
                  <div
                    className="relative w-full aspect-[4/5] bg-white overflow-hidden flex items-center justify-center"
                    style={{ borderBottom: "1.5px solid #d4af37" }}
                  >
                    {product.is_offer && (
                      <span
                        className="absolute top-2 left-2 z-10 bg-[#6d348b] text-white text-[11px] font-medium rounded-full px-3 py-0.5 tracking-wide font-sans shadow-md"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          boxShadow: "0 1px 4px 0 #d4af3720",
                        }}
                      >
                        Oferta
                      </span>
                    )}
                    {product.image_urls && product.image_urls.length > 0 ? (
                      <Image
                        src={product.image_urls[0]}
                        alt={product.name}
                        width={400}
                        height={500}
                        className="object-cover w-full h-full transition-opacity duration-300 group-hover:opacity-0 rounded-[0.75rem]"
                        loading="lazy"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        className="w-full h-full flex flex-col items-center justify-center bg-white text-[#6d348b] gap-2 rounded-[0.75rem] border-none"
                        style={{ boxShadow: "none" }}
                      >
                        <span style={{ fontSize: 44, lineHeight: 1 }}>🤍</span>
                        <span
                          className="text-xs font-medium font-sans text-[#6d348b] text-center px-2"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          Em breve a foto do produto com todo o cuidado que você
                          merece!
                        </span>
                      </div>
                    )}
                    {product.image_urls && product.image_urls.length > 1 && (
                      <Image
                        src={product.image_urls[1]}
                        alt={product.name}
                        width={400}
                        height={500}
                        className="object-cover w-full h-full absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[0.75rem]"
                        loading="lazy"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>
                  <div className="pt-4 pb-6 px-1 text-center">
                    <h3
                      className="text-lg mb-1 leading-tight tracking-tight font-serif"
                      style={{
                        fontFamily: "Playfair Display, serif",
                        fontWeight: 700,
                        color: "#1a1a1a",
                      }}
                    >
                      {product.name}
                    </h3>
                    <div className="flex flex-col items-center gap-0.5">
                      {typeof product.original_price === "number" &&
                      product.original_price > product.price ? (
                        <span
                          className="text-sm text-muted-foreground line-through font-sans"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {product.original_price.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      ) : null}
                      <span
                        className="flex items-end justify-center gap-1 font-sans"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 700,
                        }}
                      >
                        <span
                          className="text-base align-bottom"
                          style={{ color: "#1a1a1a", fontWeight: 600 }}
                        >
                          R$
                        </span>
                        <span
                          className="text-2xl align-bottom"
                          style={{ color: "#6d348b", fontWeight: 700 }}
                        >
                          {product.price.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
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
