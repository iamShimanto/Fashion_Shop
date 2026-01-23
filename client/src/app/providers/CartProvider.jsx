"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);

const STORAGE_KEY = "fashion_shop_cart_v1";

function readCart() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(readCart());
  }, []);

  useEffect(() => {
    writeCart(items);
  }, [items]);

  const addItem = (product, { quantity = 1, size = "", color = null } = {}) => {
    const productId = product?._id;
    if (!productId) {
      toast.error("Product not found");
      return;
    }

    setItems((prev) => {
      const next = [...prev];
      const key = `${productId}::${size || ""}::${color?.code || color?.name || ""}`;
      const idx = next.findIndex((x) => x.key === key);
      const q = Math.max(1, Number(quantity) || 1);

      if (idx >= 0) {
        next[idx] = { ...next[idx], quantity: next[idx].quantity + q };
      } else {
        next.push({
          key,
          productId,
          slug: product.slug,
          title: product.title,
          image: product.images?.[0] || product.images?.[0]?.url || "/men.jpeg",
          unitPrice: Number(product.price || 0),
          compareAtPrice:
            product.oldPrice !== undefined && product.oldPrice !== null
              ? Number(product.oldPrice)
              : product.compareAtPrice !== undefined &&
                  product.compareAtPrice !== null
                ? Number(product.compareAtPrice)
                : null,
          quantity: q,
          size,
          color,
        });
      }
      return next;
    });

    toast.success("Added to cart");
  };

  const removeItem = (key) => {
    setItems((prev) => prev.filter((x) => x.key !== key));
  };

  const setItemQuantity = (key, quantity) => {
    const q = Math.max(1, Number(quantity) || 1);
    setItems((prev) =>
      prev.map((x) => (x.key === key ? { ...x, quantity: q } : x)),
    );
  };

  const clear = () => setItems([]);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, x) =>
          sum + (Number(x.unitPrice) || 0) * (Number(x.quantity) || 0),
        0,
      ),
    [items],
  );

  const discount = useMemo(() => {
    return items.reduce((sum, x) => {
      const cmp = x.compareAtPrice;
      const unit = Number(x.unitPrice) || 0;
      if (cmp !== null && cmp !== undefined && Number(cmp) > unit) {
        return sum + (Number(cmp) - unit) * (Number(x.quantity) || 0);
      }
      return sum;
    }, 0);
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      setItemQuantity,
      clear,
      subtotal,
      discount,
    }),
    [items, subtotal, discount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
