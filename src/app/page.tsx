"use client";

import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { ShoppingCart } from "@/components/ShoppingCart";
import { Select, SelectItem, SelectValue } from "@/components/ui/select";
import { Product, supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const [category, setCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from("categories").select("id, name");
      setCategories(data || []);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchTags() {
      const { data } = await supabase
        .from("products")
        .select("tags")
        .eq("status", "active")
        .not("tags", "is", null);

      if (data) {
        const allProductTags = data
          .flatMap((product) => product.tags || [])
          .filter((tag, index, arr) => arr.indexOf(tag) === index)
          .sort();
        setAllTags(allProductTags);
      }
    }
    fetchTags();
  }, []);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [search]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      let query = supabase
        .from("products")
        .select("*", { count: "exact" })
        .eq("status", "active");
      if (debouncedSearch) query = query.ilike("name", `%${debouncedSearch}%`);
      if (category) query = query.eq("category_id", category);
      if (selectedTags.length > 0) {
        query = query.overlaps("tags", selectedTags);
      }
      query = query
        .order("created_at", { ascending: false })
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);
      const { data, count, error } = await query;
      if (!error) {
        setProducts(data || []);
        setTotalProducts(count || 0);
        setTotalPages(count ? Math.ceil(count / itemsPerPage) : 1);
      }
      setLoading(false);
    }
    fetchProducts();
  }, [debouncedSearch, category, selectedTags, page, itemsPerPage]);

  return (
    <div className="min-h-screen bg-background">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <nav className="container mx-auto flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          <Link href="/" className="font-bold text-lg text-primary">
            Loja
          </Link>
          <Link
            href="#sobre"
            className="text-muted-foreground hover:text-primary transition"
          >
            Sobre
          </Link>
          <Link
            href="#contato"
            className="text-muted-foreground hover:text-primary transition"
          >
            Contato
          </Link>
        </div>
        <Link
          href="/acompanhar"
          className="text-sm text-primary hover:underline"
        >
          Acompanhar Pedido
        </Link>
      </nav>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.jpg"
              alt="Manifeste"
              width={400}
              height={160}
              className="h-32 sm:h-40 w-auto object-contain"
              priority
            />
          </div>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed mb-2 text-black/80">
            Produtos que unem design, qualidade e propósito.
          </p>
        </div>
        {/* Filtros e paginação */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <input
              type="text"
              placeholder="Buscar produto..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-64 px-4 py-2 rounded-full border border-muted/40 bg-card text-base text-black placeholder:text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/40 outline-none transition"
              disabled={false}
            />
            <Select
              value={category}
              onValueChange={(v) => {
                setCategory(v);
                setPage(1);
              }}
              className="w-full sm:w-64 [&>div]:rounded-full [&>div]:border-muted/40 [&>div]:bg-card [&>div]:text-black [&>div]:text-base"
              disabled={false}
            >
              <SelectValue placeholder="Filtrar por categoria" />
              <SelectItem value="">Todas</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Filtro por tags */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-black mr-2">Tags:</span>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    );
                    setPage(1);
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedTags.includes(tag)
                      ? "bg-secondary text-secondary-foreground shadow-md"
                      : "bg-muted/50 text-black hover:bg-muted border border-muted/40"
                  }`}
                >
                  {tag}
                </button>
              ))}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedTags([]);
                    setPage(1);
                  }}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-all duration-200"
                >
                  Limpar tags
                </button>
              )}
            </div>
          )}
        </div>
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans mb-2 text-black">
              Catálogo
            </h2>
            <p className="text-base max-w-xl mx-auto text-black/70 mb-4">
              Escolha entre nossos produtos selecionados
            </p>
            {!loading && totalProducts > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/20 rounded-2xl p-4 border border-muted/30">
                <div className="text-sm text-black/70">
                  <span className="font-medium text-black">
                    {totalProducts} produto{totalProducts !== 1 ? "s" : ""}{" "}
                    encontrado{totalProducts !== 1 ? "s" : ""}
                  </span>
                  {totalProducts > itemsPerPage && (
                    <span className="ml-2">
                      (página {page} de {totalPages})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-black/70">
                    Itens por página:
                  </span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value));
                      setPage(1);
                    }}
                    className="w-20 [&>div]:rounded-xl [&>div]:border-muted/40 [&>div]:bg-white [&>div]:text-black [&>div]:text-sm"
                  >
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                    <SelectItem value="96">96</SelectItem>
                  </Select>
                </div>
              </div>
            )}
          </div>
          {/* Loading só na grade de produtos */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground text-lg">
                Carregando produtos...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Nenhum produto disponível no momento.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-4 bg-muted/20 rounded-2xl border border-muted/30">
                  <div className="text-sm text-black/70">
                    Mostrando {(page - 1) * itemsPerPage + 1} a{" "}
                    {Math.min(page * itemsPerPage, totalProducts)} de{" "}
                    {totalProducts} produtos
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-xl bg-white border border-muted/40 text-black hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                    >
                      Anterior
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNumber;
                          if (totalPages <= 5) {
                            pageNumber = i + 1;
                          } else if (page <= 3) {
                            pageNumber = i + 1;
                          } else if (page >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i;
                          } else {
                            pageNumber = page - 2 + i;
                          }

                          return (
                            <button
                              key={pageNumber}
                              onClick={() => setPage(pageNumber)}
                              className={`w-10 h-10 rounded-xl border transition-all duration-200 font-medium ${
                                page === pageNumber
                                  ? "bg-secondary text-secondary-foreground border-secondary shadow-md"
                                  : "bg-white text-black border-muted/40 hover:bg-muted/50"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        }
                      )}
                    </div>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="px-4 py-2 rounded-xl bg-white border border-muted/40 text-black hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                    >
                      Próxima
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <section
          id="sobre"
          className="bg-card/80 rounded-2xl p-8 sm:p-14 border border-muted/30 mb-12 shadow-sm"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold font-sans mb-4 text-primary">
              Sobre o Manifeste
            </h2>
            <p className="text-primary text-base mb-4">
              O Manifeste nasceu da crença de que produtos bem projetados podem
              transformar nossa experiência diária.
            </p>
            <p className="text-primary text-base">
              Trabalhamos com marcas e artesãos que compartilham nossa visão de
              excelência, garantindo que cada produto em nossa coleção seja uma
              escolha que você pode fazer com confiança.
            </p>
          </div>
        </section>
        <section
          id="contato"
          className="text-center py-8 bg-card/80 rounded-2xl border border-muted/30 max-w-2xl mx-auto mb-12 shadow-sm"
        >
          <h2 className="text-xl font-bold mb-2 text-primary">Contato</h2>
          <p className="text-primary">
            Dúvidas? Fale conosco pelo e-mail{" "}
            <a
              href="mailto:contato@manifeste.com.br"
              className="text-secondary underline hover:text-secondary/80 transition"
            >
              contato@manifeste.com.br
            </a>
          </p>
        </section>
      </main>
      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
