"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartContext } from "@/contexts/CartContext";
import { getProductImageUrl } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { ShoppingBag, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { cart, clearCart } = useCartContext();
  const router = useRouter();

  const [, setStockMap] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchStock() {
      if (!isOpen || cart.length === 0) return;
      const ids = cart.map((item) => item.variant_id);
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error } = await supabase
        .from("products")
        .select("id, stock_quantity")
        .in("id", ids);
      if (!error && data) {
        const map: Record<string, number> = {};
        data.forEach((p: { id: string; stock_quantity: number }) => {
          map[p.id] = p.stock_quantity;
        });
        setStockMap(map);
      }
    }
    fetchStock();
  }, [isOpen, cart]);

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  const getTotalPix = () =>
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-[400px] max-w-full bg-white border-l z-50 shadow-xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <Card className="h-full border-none bg-white text-black shadow-none rounded-none">
          {" "}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 px-6 border-b border-[#e5d4f7]">
            {" "}
            <CardTitle
              className="text-xl font-sans flex items-center gap-2 text-black"
              style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
            >
              <ShoppingBag className="w-5 h-5 text-[#b689e0]" />
              Carrinho
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-[#b689e0]/10 rounded-full"
            >
              <X className="h-4 w-4 text-black" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col h-full px-4 py-0">
            {cart.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center text-[#b689e0]">
                <div className="space-y-3">
                  <ShoppingBag className="w-12 h-12 mx-auto opacity-50 text-[#b689e0]" />
                  <div>
                    <p className="font-semibold text-black">
                      Seu carrinho está vazio
                    </p>
                    <p className="text-sm text-[#b689e0]">
                      Adicione alguns produtos para começar
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto py-6 max-h-[40vh] sm:max-h-[55vh]">
                  {cart.map((item) => (
                    <div
                      key={item.variant_id}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={getProductImageUrl(item.image)}
                        alt={item.name}
                        className="w-14 h-14 rounded-lg object-cover border border-[#e1e1e1] bg-[#f5f5f5]"
                      />
                      <div className="flex-1">
                        <div className="font-[Poppins] text-sm text-black font-bold">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Cor: {item.color}
                        </div>
                        <div className="text-xs text-gray-500">
                          x{item.quantity}
                        </div>
                      </div>
                      <div className="font-[Poppins] text-sm text-black font-bold min-w-[60px] text-right">
                        {item.price === 0
                          ? "Grátis"
                          : `R$ ${(item.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#e5d4f7] pt-5 space-y-3 bg-white sticky bottom-0 z-10 pb-4">
                  <div className="flex justify-between items-center">
                    <span
                      className="font-semibold font-sans text-lg text-black"
                      style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
                    >
                      Total:
                    </span>
                    <span
                      className="text-2xl font-bold text-[#b689e0] font-sans"
                      style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
                    >
                      R$ {getTotalPix().toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Button
                      onClick={handleCheckout}
                      className="w-full font-bold py-4 text-base rounded-lg bg-[#b689e0] text-white hover:bg-[#a06ac9] shadow-md transition-all duration-200"
                      style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
                      disabled={cart.length === 0}
                    >
                      Finalizar Compra
                    </Button>
                    <Button
                      onClick={clearCart}
                      className="w-full font-semibold py-4 text-base rounded-lg bg-[#faf6fd] text-[#b689e0] hover:bg-[#e5d4f7] shadow-none border border-[#e5d4f7] transition-all duration-200"
                      disabled={cart.length === 0}
                    >
                      Limpar Carrinho
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
