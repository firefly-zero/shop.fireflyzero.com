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
    description: string;
    image: string | null;
    variants: Variant[];
  };
}
