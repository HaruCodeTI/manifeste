"use client";

import { CartItem, useCart } from "@/hooks/useCart";
import { createContext, ReactNode, useContext } from "react";

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    item: Omit<CartItem, "quantity">,
    onSuccess?: () => void,
    quantity?: number
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const cartData = useCart();

  return (
    <CartContext.Provider value={cartData}>{children}</CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}
