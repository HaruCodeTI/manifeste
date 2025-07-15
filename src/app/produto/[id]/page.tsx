"use client";

import { Header } from "@/components/Header";
import { ProductDetail } from "@/components/ProductDetail";
import { ShoppingCart } from "@/components/ShoppingCart";
import { gtagEvent } from "@/lib/gtag";
import { Product, supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    async function getProduct() {
      const { id } = await params;
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .eq("status", "active")
        .single();

      if (error || !data) {
        setProduct(null);
      } else {
        setProduct(data);
      }
      setLoading(false);
    }

    getProduct();
  }, [params]);

  useEffect(() => {
    if (product) {
      gtagEvent("view_item", {
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            price: product.price,
          },
        ],
      });
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          onCartClick={() => setIsCartOpen(true)}
          onTrackOrderClick={() => {}}
          categories={[]}
          selectedCategory={""}
          onCategoryChange={() => {}}
        />
        <main className="py-8 sm:py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando produto...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#ede3f6]">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        onTrackOrderClick={() => {}}
        categories={[]}
        selectedCategory={""}
        onCategoryChange={() => {}}
      />

      <main className="py-8 sm:py-12">
        <ProductDetail product={product} />
      </main>

      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
