export interface Resource {
  type: string;
  id: string;
  attributes: any;
}

export interface Variant {
  type: "variant";
  id: string;
  attributes: {
    name: string;
    price: number;
  };
}

export interface Product {
  type: "product";
  id: string;
  attributes: {
    name: string;
    slug: "donation" | string;
    description: string;
    image: string | null;
    out_of_stock: boolean;
    variants: Variant[];
    products: { slug: string; qty: number }[];
  };
}

export interface Order {
  type: "order";
  id: string;
  attributes: {
    paid: boolean;
    amount: number;
    currency: string;
    created_at: string;
    items: any[];
  };
}

export interface CartItem {
  product: Product;
  variant: Variant;
  bundleVariants: Variant[] | null;
  qty: number;
}
