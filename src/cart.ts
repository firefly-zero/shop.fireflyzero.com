import { useState } from "preact/hooks";
import { CartItem } from "./types";

export interface Cart {
  size: number;
  add(_: CartItem): void;
  list(): CartItem[];
  remove(item: CartItem): void;
  clear(): void;
}

export function useCart(): Cart {
  const [count, setCount] = useState(0);

  return {
    size: count,

    add: (item: CartItem): void => {
      const rawCart = localStorage.getItem("cart");
      let cart: CartItem[];
      if (rawCart) {
        cart = JSON.parse(rawCart);
      } else {
        cart = [];
      }
      let found = false;
      for (const other of cart) {
        const sameProduct = other.product.id === item.product.id;
        const sameVariant = other.variant.id === item.variant.id;
        if (sameProduct && sameVariant) {
          found = true;
          other.qty += item.qty;
          break;
        }
      }
      if (!found) {
        cart.push(item);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      setCount(count + item.qty);
    },

    list: (): CartItem[] => {
      const rawCart = localStorage.getItem("cart");
      if (rawCart) {
        return JSON.parse(rawCart);
      } else {
        return [];
      }
    },

    remove: (item: CartItem): void => {
      const rawCart = localStorage.getItem("cart");
      if (!rawCart) {
        return;
      }
      const oldItems: CartItem[] = JSON.parse(rawCart);

      const newItems: CartItem[] = [];
      oldItems.map((other) => {
        const sameProduct = other.product.id === item.product.id;
        const sameVariant = other.variant.id === item.variant.id;
        const keep = !sameProduct || !sameVariant;
        if (keep) {
          newItems.push(other);
        } else {
          setCount(count - other.qty);
        }
      });
      localStorage.setItem("cart", JSON.stringify(newItems));
    },

    clear: (): void => {
      localStorage.removeItem("cart");
      setCount(0);
    },
  };
}
