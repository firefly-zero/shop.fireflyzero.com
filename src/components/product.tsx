import { FunctionComponent, VNode } from "preact";
import { Icon } from "./icon";
import { Product, Variant } from "../types";
import { Cart, useCart } from "../cart";
import { useState } from "preact/hooks";
import { useLocation } from "preact-iso";

type ProductCardProps = {
  children: Product;
  products: Product[];
};

export const ProductCard: FunctionComponent<ProductCardProps> = (props) => {
  const cart = useCart();

  const product = props.children;
  const name: string = product.attributes.name;
  const price = formatPrice(product, props.products);
  const footer = formatFooter(cart, product);
  const bundle = product.attributes.products.map(({ slug, qty }) =>
    formatBundle(slug, qty, props.products),
  );
  return (
    <div class="col col-12 col-lg-6">
      <article class="card h-100">
        {product.attributes.image && (
          <img src={product.attributes.image} class="card-img-top" />
        )}
        <div class="card-body">
          <h4 class="card-title">
            {name}
            {price && (
              <span style="float: right" class="text-muted">
                {price}
              </span>
            )}
          </h4>
          <p class="card-text mb-1">{product.attributes.description}</p>
          {bundle.length !== 0 && <p class="card-text">{bundle}</p>}
        </div>
        <div class="card-footer">{footer}</div>
      </article>
    </div>
  );
};

function formatPrice(product: Product, products: Product[]) {
  const variants = product.attributes.variants;
  let firstPrice = variants[0].attributes.price;
  let allPricesTheSame = variants.every(
    (variant) => variant.attributes.price === firstPrice,
  );

  // Donations and products with different price for each variant
  // don't show the price.
  if (!allPricesTheSame || product.attributes.slug === "donation") {
    return <></>;
  }

  // Bundles show the crossed out total price of components.
  if (product.attributes.products.length > 0) {
    const prices = product.attributes.products.map(({ slug, qty }) => {
      const p = products.find((p) => p.attributes.slug === slug);
      if (!p) {
        return 0;
      }
      return p.attributes.variants[0].attributes.price * qty;
    });
    const totalPrice = prices.reduce((a, b) => a + b, 0);
    return (
      <>
        €{firstPrice / 100} <del class="fs-6">€{totalPrice / 100}</del>
      </>
    );
  }

  return <>€{firstPrice / 100}</>;
}

function formatBundle(slug: string, qty: number, products: Product[]) {
  {
    const subProduct = products.find((p) => p.attributes.slug === slug);
    if (!subProduct) {
      return;
    }
    const price = subProduct.attributes.variants[0].attributes.price;
    return (
      <div class="card mb-1 bundle-item">
        <div class="row g-0">
          {subProduct.attributes.image && (
            <div class="col-md-4">
              <img src={subProduct.attributes.image} class="img-fluid h-100 w-100" />
            </div>
          )}
          <div class="col">
            <div class="card-body">
              <h5 class="card-title">
                {subProduct?.attributes.name}
                {qty > 1 && (
                  <span class="text-muted" style="float: right">
                    x{qty} items
                  </span>
                )}
              </h5>
              <p class="card-text mb-1">{subProduct.attributes.description}</p>
              <p class="card-text">
                <b>Regular price:</b> €{price / 100}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function formatFooter(cart: Cart, product: Product) {
  const [qty, setQty] = useState(5);

  const variants = product.attributes.variants;
  let firstPrice = variants[0].attributes.price;
  let allPricesTheSame = variants.every(
    (variant) => variant.attributes.price === firstPrice,
  );

  if (product.attributes.slug === "donation") {
    const variant = product.attributes.variants[0];
    return (
      <div class="row justify-content-between">
        <div class="col">
          <div class="input-group mb-3">
            <span class="input-group-text" id="price-input">
              <b>€</b>
            </span>
            <input
              type="number"
              class="form-control"
              id="price-input"
              value={qty}
              min={1}
              onInput={(e) => setQty(+e.currentTarget.value)}
            />
          </div>
        </div>
        <div class="col">
          <div class="col">{formatButton(() => cart.add({ product, variant, qty }))}</div>
        </div>
      </div>
    );
  }

  if (variants.length == 1) {
    const variant = product.attributes.variants[0];
    const bundleSize = product.attributes.products
      .map(({ qty }) => qty)
      .reduce((a, b) => a + b, 0);
    return (
      <div class="row align-items-center">
        {bundleSize > 1 && (
          <div class="col">
            <b>Items included:</b> {bundleSize}
          </div>
        )}
        <div class="col">
          {formatButton(() => cart.add({ product, variant, qty: 1 }))}
        </div>
      </div>
    );
  }

  return variants.map((variant: Variant) => (
    <div class="row justify-content-between align-items-center mb-1">
      <div class="col fs-3">
        <b>{variant.attributes.name}</b>{" "}
        {!allPricesTheSame && "€" + variant.attributes.price / 100}
      </div>
      <div class="col">{formatButton(() => cart.add({ product, variant, qty: 1 }))}</div>
    </div>
  ));
}

function formatButton(onClick: () => void) {
  const [added, setAdded] = useState(false);
  const { route } = useLocation();

  if (added) {
    return (
      <button
        class="btn btn-secondary"
        style="display: block; float: right"
        onClick={() => route("/cart")}
      >
        <Icon>cart-shopping</Icon> go to cart
      </button>
    );
  }

  const add = () => {
    onClick();
    setAdded(true);
  };
  return (
    <button class="btn btn-primary" style="display: block; float: right" onClick={add}>
      <Icon>cart-plus</Icon> add to cart
    </button>
  );
}
