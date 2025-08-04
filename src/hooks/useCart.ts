"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface CartItem {
  product_id: string;
  variant_id: string;
  name: string;
  color: string;
  price: number;
  image: string;
  quantity: number;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  useEffect(() => {
    const savedCart = localStorage.getItem("manifeste-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        setCart([]);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem("manifeste-cart", JSON.stringify(cart));
    }, 300);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [cart, isLoaded]);

  const addToCart = useCallback(
    (
      item: Omit<CartItem, "quantity">,
      onSuccess?: () => void,
      quantity: number = 1
    ) => {
      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (cartItem) => cartItem.variant_id === item.variant_id
        );
        if (existingItem) {
          return prevCart.map((cartItem) =>
            cartItem.variant_id === item.variant_id
              ? { ...cartItem, quantity: cartItem.quantity + quantity }
              : cartItem
          );
        }
        return [...prevCart, { ...item, quantity }];
      });

      if (onSuccess) {
        onSuccess();
      }
    },
    []
  );

  const removeFromCart = useCallback((variantId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.variant_id !== variantId)
    );
  }, []);

  const updateQuantity = useCallback(
    (variantId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(variantId);
        return;
      }
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.variant_id === variantId ? { ...item, quantity } : item
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getTotalItems = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const getTotalPrice = useCallback(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isLoaded,
  };
}
