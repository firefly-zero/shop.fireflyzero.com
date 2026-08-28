import { useState } from "preact/hooks";
import { CartItem, Product, Variant } from "./types";

export interface Cart {
  size: number;
  add(item: CartItem): void;
  list(): CartItem[];
  remove(item: CartItem): void;
  get(item: CartItem): CartItem | null;
  updateProducts(products: Product[]): void;
  clear(): void;
}

function same(a: CartItem, b: CartItem): boolean {
  return (
    a.product.id === b.product.id &&
    a.variant.id === b.variant.id &&
    sameBundleVariants(a.bundleVariants, b.bundleVariants)
  );
}

function sameBundleVariants(a: Variant[] | null, b: Variant[] | null): boolean {
  if (a === b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }
  for (var i = 0; i < a.length; ++i) {
    if (a[i].id !== b[i].id) {
      return false;
    }
  }
  return true;
}

function saveCart(items: CartItem[]) {
  localStorage.setItem("cart", JSON.stringify(items));
}

export function useCart(): Cart {
  const [count, setCount] = useState(0);

  return {
    /** The total number of individual units in the cart.
     *
     * We track it so that carts can be compared with equality
     * to see if there are any changes in the cart items.
     */
    size: count,

    /** Add a new item into the cart.
     *
     * If the item is already in the cart, the quantity will be increased.
     */
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
        if (same(item, other)) {
          found = true;
          other.qty += item.qty;
          break;
        }
      }
      if (!found) {
        cart.push(item);
      }
      saveCart(cart);
      setCount(count + item.qty);
    },

    /** Get the list of all items in the cart. */
    list: (): CartItem[] => {
      const rawCart = localStorage.getItem("cart");
      if (rawCart) {
        return JSON.parse(rawCart);
      } else {
        return [];
      }
    },

    /** Remove the given item from the cart.
     *
     * The qty is ignored.
     */
    remove: (item: CartItem): void => {
      const rawCart = localStorage.getItem("cart");
      if (!rawCart) {
        return;
      }
      const oldItems: CartItem[] = JSON.parse(rawCart);

      const newItems: CartItem[] = [];
      oldItems.map((other) => {
        if (same(item, other)) {
          setCount(count - other.qty);
        } else {
          newItems.push(other);
        }
      });
      saveCart(newItems);
    },

    /** Get the given item from the cart.
     *
     * Can be used to check if the item is in the cart
     * and to retrieve the item qty.
     */
    get: (item: CartItem): CartItem | null => {
      const rawCart = localStorage.getItem("cart");
      if (!rawCart) {
        return null;
      }
      const items: CartItem[] = JSON.parse(rawCart);
      for (const other of items) {
        if (same(item, other)) {
          return other;
        }
      }
      return null;
    },

    /** Update product infos for all items in the cart. */
    updateProducts: (products: Product[]): void => {
      const rawCart = localStorage.getItem("cart");
      if (!rawCart) {
        return;
      }
      const items: CartItem[] = JSON.parse(rawCart);
      for (const item of items) {
        let product: Product;
        for (product of products) {
          if (product.id == item.product.id) {
            item.product = product;
            break;
          }
        }
      }
    },

    /** Remove all items from the cart. */
    clear: (): void => {
      localStorage.removeItem("cart");
      setCount(0);
    },
  };
}
