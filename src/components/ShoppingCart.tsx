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
          "fixed right-0 top-0 h-full w-full sm:w-96 max-w-full bg-background border-l z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <Card className="h-full rounded-none border-0 bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 px-6 border-b border-border/50">
            <CardTitle className="text-xl font-sans flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Carrinho
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-muted/60"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col h-full px-6 py-0">
            {cart.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
                <div className="space-y-3">
                  <ShoppingBag className="w-12 h-12 mx-auto opacity-50" />
                  <div>
                    <p className="font-medium">Seu carrinho está vazio</p>
                    <p className="text-sm">
                      Adicione alguns produtos para começar
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto py-6">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 border rounded-xl border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors"
                    >
                      <div className="w-20 h-20 bg-muted/50 rounded-lg overflow-hidden flex-shrink-0 relative border border-border/30">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                            priority={false}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                            Sem imagem
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 space-y-3">
                        <div>
                          <h4 className="font-semibold text-sm truncate font-sans">
                            {item.name}
                          </h4>
                          <p className="text-sm text-muted-foreground font-sans">
                            R$ {item.price.toFixed(2).replace(".", ",")}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-2 py-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="h-6 w-6 p-0 hover:bg-muted"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-6 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="h-6 w-6 p-0 hover:bg-muted"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border/50 pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold font-sans text-lg">
                      Total:
                    </span>
                    <span className="text-2xl font-bold text-primary font-sans">
                      R$ {getTotalPrice().toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <Button
                      onClick={handleCheckout}
                      className="w-full font-semibold py-6 text-base hover:scale-[1.02] transition-transform duration-200"
                      disabled={cart.length === 0}
                    >
                      Finalizar Compra
                    </Button>
                    <Button
                      variant="outline"
                      onClick={clearCart}
                      className="w-full font-semibold py-6 text-base"
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
