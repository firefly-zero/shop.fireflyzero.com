import { useLocation } from "preact-iso";
import { useAuth } from "../components/auth";
import { Loading } from "../components/loading";
import { Icon } from "../components/icon";
import { useCart } from "../cart";
import { CartItemCard } from "../components/cart-item";

export function Cart() {
  const { route } = useLocation();
  const auth = useAuth();
  const cart = useCart();

  if (auth.loading) {
    return <Loading />;
  }
  if (!auth.email) {
    route("/sign-in");
  }

  const items = cart
    .list()
    .map((item) => <CartItemCard cart={cart}>{item}</CartItemCard>);
  return (
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h2>
          {" "}
          <a href="/" class="btn btn-secondary">
            <Icon>chevron-left</Icon> back
          </a>{" "}
          Cart
        </h2>
        {items}

        <p>
          Shipping costs and currency exchange comissions will be calculated on the next
          step.
        </p>
        <button class="btn btn-primary w-100" onClick={() => {}}>
          <Icon>money-bill-wave</Icon> proceed to checkout
        </button>
      </div>
    </div>
  );
}
