"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CartItem, Product } from "@/lib/types";
import { trackCommerceEvent } from "@/components/analytics-tracker";

type StoreContextValue = {
  cart: CartItem[];
  wishlist: Product[];
  cartCount: number;
  subtotal: number;
  couponCode: string;
  discount: number;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: number) => boolean;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("southaura-cart");
    const savedWishlist = localStorage.getItem("southaura-wishlist");
    const savedCoupon = localStorage.getItem("southaura-coupon");
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedCoupon) setCouponCode(savedCoupon);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("southaura-cart", JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("southaura-wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (couponCode) localStorage.setItem("southaura-coupon", couponCode);
    else localStorage.removeItem("southaura-coupon");
  }, [couponCode, hydrated]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      cart,
      wishlist,
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      couponCode,
      discount: couponCode === "AURA10" ? Math.round(subtotal * 0.1) : 0,
      addToCart: (product, quantity = 1) =>
        setCart((current) => {
          trackCommerceEvent("add_to_cart", {
            productRef: product.slug,
            value: product.price * quantity,
            metadata: { name: product.name, quantity }
          });
          const existing = current.find(
            (item) => item.product.id === product.id
          );
          if (existing) {
            return current.map((item) =>
              item.product.id === product.id
                ? {
                    ...item,
                    quantity: Math.min(
                      item.product.stock,
                      item.quantity + quantity
                    )
                  }
                : item
            );
          }
          return [
            ...current,
            { product, quantity: Math.min(product.stock, quantity) }
          ];
        }),
      updateQuantity: (productId, quantity) =>
        setCart((current) =>
          quantity < 1
            ? current.filter((item) => item.product.id !== productId)
            : current.map((item) =>
                item.product.id === productId
                  ? {
                      ...item,
                      quantity: Math.min(item.product.stock, quantity)
                    }
                  : item
              )
        ),
      removeFromCart: (productId) =>
        setCart((current) =>
          current.filter((item) => item.product.id !== productId)
        ),
      clearCart: () => {
        setCart([]);
        setCouponCode("");
      },
      applyCoupon: (code) => {
        const normalized = code.trim().toUpperCase();
        if (normalized !== "AURA10") return false;
        setCouponCode(normalized);
        return true;
      },
      removeCoupon: () => setCouponCode(""),
      toggleWishlist: (product) =>
        setWishlist((current) =>
          current.some((item) => item.id === product.id)
            ? current.filter((item) => item.id !== product.id)
            : [...current, product]
        ),
      isWishlisted: (productId) =>
        wishlist.some((product) => product.id === productId)
    }),
    [cart, couponCode, subtotal, wishlist]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
