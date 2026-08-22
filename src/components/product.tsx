import { FunctionComponent, VNode } from "preact";
import { Icon } from "./icon";
import { CartItem, Product, Variant } from "../types";
import { Cart, useCart } from "../cart";
import { useState } from "preact/hooks";
import { useLocation } from "preact-iso";

export const ProductCard: FunctionComponent<{ children: Product }> = (props) => {
  const cart = useCart();

  const product = props.children;
  const variants = product.attributes.variants;
  const name: string = product.attributes.name;
  const price = formatPrice(variants);
  const footer = formatFooter(cart, product);
  return (
    <div class="col">
      <article class="card h-100">
        {product.attributes.image && (
          <img
            src={product.attributes.image}
            class="card-img-top"
            style="object-fit: cover; aspect-ratio: 3/2"
          />
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
          <p class="card-text">{product.attributes.description}</p>
        </div>
        <div class="card-footer">{footer}</div>
      </article>
    </div>
  );
};

function formatPrice(variants: Variant[]) {
  let firstPrice = variants[0].attributes.price;
  let allPricesTheSame = variants.every(
    (variant) => variant.attributes.price === firstPrice,
  );
  if (allPricesTheSame && firstPrice != 0) {
    return <>€{firstPrice / 100}</>;
  } else {
    return <></>;
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
    return (
      <div class="col">{formatButton(() => cart.add({ product, variant, qty: 1 }))}</div>
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
