"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartContext } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useCartContext();
  const router = useRouter();

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-[400px] max-w-full bg-background border-l z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <Card className="h-full rounded-2xl border-none bg-card text-foreground shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 px-6 border-b border-border/30">
            <CardTitle className="text-xl font-sans flex items-center gap-2 text-foreground">
              <ShoppingBag className="w-5 h-5 text-secondary" />
              Carrinho
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-secondary/20 rounded-full"
            >
              <X className="h-4 w-4 text-foreground" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col h-full px-4 py-0">
            {cart.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
                <div className="space-y-3">
                  <ShoppingBag className="w-12 h-12 mx-auto opacity-50 text-secondary" />
                  <div>
                    <p className="font-semibold text-foreground">
                      Seu carrinho está vazio
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Adicione alguns produtos para começar
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto py-6 max-h-[40vh] sm:max-h-[55vh]">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 border rounded-2xl border-transparent bg-card hover:bg-primary/40 transition-colors"
                    >
                      <div className="w-16 h-16 bg-muted/40 rounded-2xl overflow-hidden flex-shrink-0 relative border border-muted/30">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                            priority={false}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-white text-primary gap-1 rounded-2xl border border-primary/40">
                            <span style={{ fontSize: 28, lineHeight: 1 }}>
                              🤫
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div>
                          <h4
                            className="font-semibold text-sm truncate font-sans text-foreground"
                            style={{
                              fontFamily: "Montserrat, Arial, sans-serif",
                            }}
                          >
                            {item.name}
                          </h4>
                          <p
                            className="text-sm font-sans text-green-600"
                            style={{
                              fontFamily: "Montserrat, Arial, sans-serif",
                            }}
                          >
                            R$ {item.price.toFixed(2).replace(".", ",")}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-white border border-muted rounded-xl px-2 py-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="h-7 w-7 p-0 rounded-full bg-primary text-white hover:bg-primary/90"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-base font-semibold w-6 text-center text-foreground">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="h-7 w-7 p-0 rounded-full bg-primary text-white hover:bg-primary/90"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="h-8 w-8 p-0 rounded-full bg-destructive hover:bg-destructive/90"
                          >
                            <Trash2 className="h-4 w-4 text-white" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-muted pt-6 space-y-4 bg-card sticky bottom-0 z-10 pb-4">
                  <div className="flex justify-between items-center">
                    <span
                      className="font-semibold font-sans text-lg text-foreground"
                      style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
                    >
                      Total:
                    </span>
                    <span
                      className="text-2xl font-bold text-green-600 font-sans"
                      style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
                    >
                      R$ {getTotalPrice().toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <Button
                      onClick={handleCheckout}
                      className="w-full font-semibold py-5 text-base rounded-2xl bg-green-600 text-white hover:bg-green-600/90 hover:animate-pulse shadow-md hover:shadow-lg transition-all duration-300"
                      style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
                      disabled={cart.length === 0}
                    >
                      Finalizar Compra
                    </Button>
                    <Button
                      onClick={clearCart}
                      className="w-full font-semibold py-5 text-base rounded-2xl bg-destructive text-white hover:bg-destructive/90 hover:animate-pulse shadow-md hover:shadow-lg transition-all duration-300"
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
