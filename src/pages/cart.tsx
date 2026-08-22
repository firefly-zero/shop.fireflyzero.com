import { useLocation } from "preact-iso";
import { useAuth } from "../components/auth";
import { Loading } from "../components/loading";
import { Icon } from "../components/icon";
import { useCart } from "../cart";
import { CartItemCard } from "../components/cart-item";
import { api } from "../api";
import { Alert } from "../components/alert";

function detectCountry(): string {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (tz === "Europe/Amsterdam") {
    return "NL";
  }
  if (tz === "Europe/Brussels") {
    return "BE";
  }
  if (tz === "Europe/Luxembourg") {
    return "BE";
  }
  return "NL";
}

export function Cart() {
  const location = useLocation();
  const auth = useAuth();
  const cart = useCart();

  const mut = api.post("/checkout");
  const checkout = () => {
    const items = cart.list().map((item) => ({ id: item.variant.id, qty: item.qty }));
    mut.mutate({
      type: "checkout",
      attributes: {
        success_url: `${window.location.origin}/success/{CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/cart`,
        items: items,
        country: "NL",
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
    if (item.product.attributes.slug === "donation") {
      total += item.qty * 100;
    } else {
      total += item.variant.attributes.price * item.qty;
    }
  }

  const country = detectCountry();
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
            <label for="country-select" class="lead">
              <Icon>earth-europe</Icon> Shipping country:
            </label>
            <select class="form-select" id="country-select">
              <option value="BE" selected={country === "BE"}>
                🇧🇪 Belgium (BE)
              </option>
              <option value="LU" selected={country === "LU"}>
                🇱🇺 Luxembourg (LU)
              </option>
              <option value="NL" selected={country === "NL"}>
                🇳🇱 Netherlands (NL)
              </option>
            </select>
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
