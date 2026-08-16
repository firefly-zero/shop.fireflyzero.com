import { FunctionComponent } from "preact";
import { Icon } from "./icon";
import { CartItem } from "../types";
import { Cart } from "../cart";

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
        <h4 class="card-title">
          {product.attributes.name}
          <span class="text-muted" style="display: inline-block; float: right">
            {item.qty === 1 ? (
              <>€{variant.attributes.price / 100}</>
            ) : (
              <>
                €{variant.attributes.price / 100} x {item.qty} = €
                {(variant.attributes.price * item.qty) / 100}
              </>
            )}
          </span>
        </h4>

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
