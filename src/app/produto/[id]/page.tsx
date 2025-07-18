"use client";

import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetail } from "@/components/ProductDetail";
import { ShoppingCart } from "@/components/ShoppingCart";
import { gtagEvent } from "@/lib/gtag";
import { getProductImageUrls, Product, supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
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
        setProduct({
          ...data,
          image_urls: getProductImageUrls(data.image_urls || []),
        });
        // Buscar relacionados
        if (data.category_id) {
          const { data: relatedData } = await supabase
            .from("products")
            .select("*")
            .eq("category_id", data.category_id)
            .eq("status", "active")
            .neq("id", id)
            .limit(10);
          setRelated(relatedData || []);
        } else {
          setRelated([]);
        }
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
      <div className="min-h-screen bg-[#e1e1e1]">
        <Header
          onCartClick={() => setIsCartOpen(true)}
          onTrackOrderClick={() => {}}
          categories={[]}
          selectedCategory={""}
          onCategoryChange={() => {}}
        />
        <main className="py-8 sm:py-12">
          <div
            className="text-center flex flex-col items-center justify-center"
            style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-primary font-medium text-base">
              Carregando produto...
            </p>
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
        {/* Produtos relacionados */}
        {related.length > 0 && (
          <section className="mt-16 w-full flex flex-col items-center justify-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#7b61ff] mb-6 font-[Poppins] text-center">
              Produtos relacionados
            </h2>
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 hide-scrollbar w-full max-w-full justify-center px-2">
              {related.map((prod) => (
                <div
                  key={prod.id}
                  className="flex-shrink-0 flex items-center justify-center"
                >
                  <ProductCard product={prod} small />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
