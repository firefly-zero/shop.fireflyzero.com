import { CartItem } from "./types";

export const cart = {
  add: (item: CartItem): void => {
    const rawCart = localStorage.getItem("cart");
    let cart: CartItem[];
    if (rawCart) {
      cart = JSON.parse(rawCart);
    } else {
      cart = [];
    }
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
  },
  list: (): CartItem[] => {
    const rawCart = localStorage.getItem("cart");
    if (rawCart) {
      return JSON.parse(rawCart);
    } else {
      return [];
    }
  },
  clear: (): void => {
    localStorage.removeItem("cart");
  },
};
