import { FunctionComponent, VNode } from "preact";
import { Icon } from "./icon";
import { CartItem, Product, Variant } from "../types";
import { Cart, useCart } from "../cart";

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
  const variants = product.attributes.variants;
  let firstPrice = variants[0].attributes.price;
  let allPricesTheSame = variants.every(
    (variant) => variant.attributes.price === firstPrice,
  );

  if (firstPrice == 0) {
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
              value={5}
              min={1}
            />
          </div>
        </div>
        <div class="col">
          <a href="#" class="btn btn-primary" style="display: block; float: right">
            <Icon>cart-plus</Icon> add to cart
          </a>
        </div>
      </div>
    );
  }

  if (variants.length == 1) {
    const variant = product.attributes.variants[0];
    return (
      <div class="col">
        <button
          class="btn btn-primary"
          style="display: block; float: right"
          onClick={() => cart.add({ product, variant, qty: 1 })}
        >
          <Icon>cart-plus</Icon> add to cart
        </button>
      </div>
    );
  }

  return variants.map((variant: Variant) => (
    <div class="row justify-content-between align-items-center mb-1">
      <div class="col fs-3">
        <b>{variant.attributes.name}</b>{" "}
        {!allPricesTheSame && "€" + variant.attributes.price / 100}
      </div>
      <div class="col">
        <a href="#" class="btn btn-primary" style="display: block; float: right">
          <Icon>cart-plus</Icon> add to cart
        </a>
      </div>
    </div>
  ));
}
