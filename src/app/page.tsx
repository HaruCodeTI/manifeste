"use client";

import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { ShoppingCart } from "@/components/ShoppingCart";
import { Select, SelectItem, SelectValue } from "@/components/ui/select";
import { Product, supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 12;

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from("categories").select("id, name");
      setCategories(data || []);
    }
    fetchCategories();
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
      query = query
        .order("created_at", { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
      const { data, count, error } = await query;
      if (!error) {
        setProducts(data || []);
        setTotalPages(count ? Math.ceil(count / PAGE_SIZE) : 1);
      }
      setLoading(false);
    }
    fetchProducts();
  }, [debouncedSearch, category, page]);

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
          <h1 className="text-4xl sm:text-5xl font-bold font-sans mb-2">
            Manifeste
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-2">
            Produtos que unem design, qualidade e propósito.
          </p>
        </div>
        {/* Filtros e paginação */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
          <input
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-64 px-3 py-2 rounded border border-border bg-background text-sm"
            disabled={false}
          />
          <Select
            value={category}
            onValueChange={(v) => {
              setCategory(v);
              setPage(1);
            }}
            className="w-full sm:w-64"
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
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans mb-2">
              Catálogo
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Escolha entre nossos produtos selecionados
            </p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded bg-muted text-foreground disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="text-sm">
                  Página {page} de {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded bg-muted text-foreground disabled:opacity-50"
                >
                  Próxima
                </button>
              </div>
            </>
          )}
        </div>
        <section
          id="sobre"
          className="bg-muted/20 rounded-xl p-8 sm:p-12 border border-border/50 mb-12"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold font-sans mb-4">
              Sobre o Manifeste
            </h2>
            <p className="text-muted-foreground text-base mb-4">
              O Manifeste nasceu da crença de que produtos bem projetados podem
              transformar nossa experiência diária.
            </p>
            <p className="text-muted-foreground text-base">
              Trabalhamos com marcas e artesãos que compartilham nossa visão de
              excelência, garantindo que cada produto em nossa coleção seja uma
              escolha que você pode fazer com confiança.
            </p>
          </div>
        </section>
        <section id="contato" className="text-center py-8">
          <h2 className="text-xl font-bold mb-2">Contato</h2>
          <p className="text-muted-foreground">
            Dúvidas? Fale conosco pelo e-mail contato@manifeste.com.br
          </p>
        </section>
      </main>
      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
