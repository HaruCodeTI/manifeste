"use client";

import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { ShoppingCart } from "@/components/ShoppingCart";
import { LoadingGrid } from "@/components/ui/loading";
import { gtagEvent } from "@/lib/gtag";
import { Product, supabase } from "@/lib/supabaseClient";
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
  const [itemsPerPage, setItemsPerPage] = useState(15);
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
        .select("*, product_variants(*)", { count: "exact" })
        .eq("status", "active");
      if (debouncedSearch) query = query.ilike("name", `%${debouncedSearch}%`);
      if (selectedCategory) query = query.eq("category_id", selectedCategory);
      query = query.order("created_at", { ascending: false });
      query = query.range((page - 1) * itemsPerPage, page * itemsPerPage - 1);
      const { data, count, error } = await query;
      if (!error) {
        setProducts(
          (data || []).map((p) => ({
            ...p,
            variants: p.product_variants || [],
          }))
        );
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
          price: p.variants?.[0]?.price ?? 0,
        })),
      });
    }
  }, [products, selectedCategory]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#e1e1e1]">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        onTrackOrderClick={() => (window.location.href = "/acompanhar")}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      <main
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans"
        style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
      >
        <div className="mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 px-1">
            <div
              className="flex items-center gap-2 text-primary text-lg font-sans"
              style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
            >
              <span className="font-medium">Ordenar por:</span>
              <select
                value={sort}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setSort(e.target.value as typeof sort);
                  setPage(1);
                }}
                className="bg-white border border-primary rounded-lg outline-none font-medium text-base px-4 py-2 min-h-[40px] cursor-pointer font-sans focus:ring-2 focus:ring-secondary transition shadow-sm"
                style={{
                  minWidth: 120,
                  fontFamily: "Montserrat, Arial, sans-serif",
                }}
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
              style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
            >
              <span className="font-medium">Exibir:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-white border border-primary rounded-lg outline-none font-medium text-base px-4 py-2 min-h-[40px] cursor-pointer font-sans focus:ring-2 focus:ring-secondary transition shadow-sm"
                style={{
                  minWidth: 60,
                  fontFamily: "Montserrat, Arial, sans-serif",
                }}
              >
                {[4, 8, 15, 20, 40].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span
                className="ml-4 text-primary text-lg font-medium font-sans"
                style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
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
                style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
              >
                Nenhum produto disponível no momento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-7">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-full border-2 border-[#7b61ff] bg-white text-[#7b61ff] font-bold font-[Poppins] transition-all duration-200 hover:bg-[#fe53b3] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed text-base"
                style={{ fontFamily: "Poppins, Arial, sans-serif" }}
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`w-10 h-10 rounded-full border-2 font-bold font-[Poppins] transition-all duration-200 text-base ${
                      page === pageNumber
                        ? "bg-[#7b61ff] text-white border-[#7b61ff]"
                        : "bg-white text-[#7b61ff] border-[#7b61ff] hover:bg-[#fe53b3] hover:text-white hover:border-[#fe53b3]"
                    }`}
                    style={{ fontFamily: "Poppins, Arial, sans-serif" }}
                  >
                    {pageNumber}
                  </button>
                )
              )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-full border-2 border-[#7b61ff] bg-white text-[#7b61ff] font-bold font-[Poppins] transition-all duration-200 hover:bg-[#fe53b3] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed text-base"
                style={{ fontFamily: "Poppins, Arial, sans-serif" }}
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
