"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartContext } from "@/contexts/CartContext";
import { calcDebito, cn } from "@/lib/utils";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartContext();
  const router = useRouter();
  const [stockAlertId, setStockAlertId] = useState<string | null>(null);
  const [stockMap, setStockMap] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchStock() {
      if (!isOpen || cart.length === 0) return;
      const ids = cart.map((item) => item.id);
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

  const handleIncrease = (item: { id: string; quantity: number }) => {
    const maxStock = stockMap[item.id] ?? 99;
    if (item.quantity >= maxStock) {
      setStockAlertId(item.id);
      setTimeout(() => setStockAlertId(null), 2000);
      return;
    }
    updateQuantity(item.id, item.quantity + 1);
  };

  const getTotalPix = () =>
    cart.reduce((acc, item) => acc + calcDebito(item.price) * item.quantity, 0);

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
                  {cart.map(
                    (item: {
                      id: string;
                      quantity: number;
                      name: string;
                      price: number;
                      image?: string;
                    }) => (
                      <div
                        key={item.id}
                        className="flex gap-3 p-2 border border-[#e5d4f7] rounded-lg bg-white hover:shadow-md transition-colors"
                      >
                        <div className="w-14 h-14 bg-[#faf6fd] rounded-lg overflow-hidden flex-shrink-0 relative border border-[#e5d4f7]">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="56px"
                              priority={false}
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-white text-[#b689e0] gap-1 rounded-lg border border-[#e5d4f7]">
                              <span style={{ fontSize: 24, lineHeight: 1 }}>
                                🛫
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div>
                            <h4
                              className="font-semibold text-sm truncate font-sans text-black"
                              style={{
                                fontFamily: "Montserrat, Arial, sans-serif",
                              }}
                            >
                              {item.name}
                            </h4>
                            <p
                              className="text-sm font-sans text-black"
                              style={{
                                fontFamily: "Montserrat, Arial, sans-serif",
                              }}
                            >
                              R${" "}
                              {calcDebito(item.price)
                                .toFixed(2)
                                .replace(".", ",")}{" "}
                              <span className="text-xs text-[#00b85b]">
                                (Pix/Débito)
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-[#faf6fd] border border-[#e5d4f7] rounded-lg px-2 py-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="h-6 w-6 p-0 rounded-full text-[#b689e0] hover:bg-[#b689e0]/10"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="text-base font-semibold w-5 text-center text-black">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleIncrease(item)}
                                className="h-6 w-6 p-0 rounded-full text-[#b689e0] hover:bg-[#b689e0]/10"
                                disabled={
                                  item.quantity >= (stockMap[item.id] ?? 99)
                                }
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            {stockAlertId === item.id && (
                              <div className="text-xs text-red-600 font-semibold mt-1">
                                Estoque máximo disponível!
                              </div>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="h-7 w-7 p-0 rounded-full text-[#b689e0] hover:bg-[#b689e0]/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  )}
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
