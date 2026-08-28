import { FunctionComponent } from "preact";
import { Icon } from "./icon";
import { CartItem } from "../types";
import { Cart } from "../cart";

interface Props {
  item: CartItem;
  cart: Cart;
}

export const CartItemCard: FunctionComponent<Props> = (props) => {
  const cart = props.cart;
  const item = props.item;
  const { product, variant } = item;

  let price;
  if (product.attributes.slug === "donation") {
    price = <>€{item.qty} ❤️</>;
  } else if (item.qty === 1) {
    price = <>€{variant.attributes.price / 100}</>;
  } else {
    price = (
      <>
        €{variant.attributes.price / 100} x {item.qty} = €
        {(variant.attributes.price * item.qty) / 100}
      </>
    );
  }

  return (
    <article class="card mb-1">
      <div class="card-body">
        <h4 class="card-title">
          {product.attributes.name}
          {variant.attributes.name !== "" && (
            <span class="text-muted"> ({variant.attributes.name})</span>
          )}
          <span class="text-muted" style="display: inline-block; float: right">
            {price}
          </span>
        </h4>

        <button class="btn m-1" onClick={() => cart.remove(item)}>
          <Icon>trash</Icon>
        </button>

        {item.qty > 1 && (
          <button
            class="btn btn-secondary m-1"
            onClick={() => {
              cart.remove(item);
              cart.add({ ...item, qty: item.qty - 1 });
            }}
          >
            <Icon>minus</Icon>
          </button>
        )}

        <button class="btn btn-secondary" onClick={() => cart.add({ ...item, qty: 1 })}>
          <Icon>plus</Icon>
        </button>
      </div>
    </article>
  );
};
