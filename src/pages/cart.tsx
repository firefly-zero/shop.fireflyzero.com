import { useLocation } from "preact-iso";
import { useAuth } from "../components/auth";
import { Loading } from "../components/loading";
import { Icon } from "../components/icon";
import { useCart } from "../cart";
import { CartItemCard } from "../components/cart-item";
import { api } from "../api";
import { Alert } from "../components/alert";

export function Cart() {
  const location = useLocation();
  const auth = useAuth();
  const cart = useCart();

  const mut = api.post("/checkout");
  const checkout = () => {
    const items = cart
      .list()
      .map((item) => ({ id: item.variant.id, quantity: item.qty }));
    mut.mutate({
      type: "checkout",
      attributes: {
        success_url: `${window.location.origin}/success/{CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/`,
        items: items,
      },
    });
  };
  if (mut.data) {
    window.location.href = mut.data.attributes.redirect_url;
  }

  if (auth.loading || mut.isPending) {
    return <Loading />;
  }
  if (!auth.email) {
    location.route("/sign-in");
  }

  let total = 0;
  for (const item of cart.list()) {
    const attrs = item.variant.attributes;
    if (attrs.price === 0) {
      total += item.qty * 100;
    } else {
      total += attrs.price * item.qty;
    }
  }

  const items = cart
    .list()
    .map((item) => <CartItemCard cart={cart}>{item}</CartItemCard>);
  return (
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h2>
          <a href="/" class="btn btn-secondary">
            <Icon>chevron-left</Icon> back
          </a>{" "}
          Cart
        </h2>
        <Alert>{mut.error}</Alert>
        {items.length > 0 ? (
          <>
            {items}
            <p class="lead" style="margin-bottom: 0px">
              <Icon>money-bills</Icon> Total: <b>€{total / 100}</b>
            </p>
            <p>
              Taxes already included in the cost. Shipping costs,{" "}
              <a
                href="https://support.stripe.com/questions/understanding-your-currency-conversion-fees"
                target="_blank"
              >
                currency exchange comission
              </a>{" "}
              (if paying not in euros), and{" "}
              <a href="https://stripe.com/en-nl/pricing" target="_blank">
                payment processor comission
              </a>{" "}
              (Stripe) will be calculated on the next step.
            </p>
            <button class="btn btn-primary w-100" onClick={checkout}>
              <Icon>money-bill-wave</Icon> proceed to checkout
            </button>
          </>
        ) : (
          <p class="alert alert-warning">The cart is empty :(</p>
        )}
      </div>
    </div>
  );
}
