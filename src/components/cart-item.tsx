import { FunctionComponent, VNode } from "preact";
import { Icon } from "./icon";
import { CartItem, Product, Variant } from "../types";
import { Cart, useCart } from "../cart";

interface Props {
  children: CartItem;
  cart: Cart;
}

export const CartItemCard: FunctionComponent<Props> = (props) => {
  const cart = props.cart;
  const item = props.children;
  const { product, variant } = item;
  return (
    <article class="card mb-1">
      <div class="card-body">
        <h4 class="card-title">{product.attributes.name}</h4>
        <p class="card-text">
          €{variant.attributes.price / 100} x {item.qty} = €
          {(variant.attributes.price * item.qty) / 100}
        </p>

        <button class="btn btn-danger m-1" onClick={() => cart.remove(item)}>
          <Icon>trash</Icon> remove
        </button>

        {item.qty > 1 && (
          <button
            class="btn btn-secondary m-1"
            onClick={() => {
              cart.remove(item);
              cart.add({
                product: item.product,
                variant: item.variant,
                qty: item.qty - 1,
              });
            }}
          >
            <Icon>minus</Icon>
          </button>
        )}

        <button
          class="btn btn-secondary"
          onClick={() =>
            cart.add({
              product: item.product,
              variant: item.variant,
              qty: 1,
            })
          }
        >
          <Icon>plus</Icon>
        </button>
      </div>
    </article>
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
