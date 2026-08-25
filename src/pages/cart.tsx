import { useLocation } from "preact-iso";
import { useAuth } from "../components/auth";
import { Loading } from "../components/loading";
import { Icon } from "../components/icon";
import { useCart } from "../cart";
import { CartItemCard } from "../components/cart-item";
import { api } from "../api";
import { Alert } from "../components/alert";
import { useState } from "preact/hooks";

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
  const [promo, setPromo] = useState("");
  const [country, setCountry] = useState(detectCountry());

  const items = cart.list().map((item) => ({ id: item.variant.id, qty: item.qty }));
  const mut = api.post("/checkout");
  const checkout = () => {
    mut.mutate({
      type: "checkout",
      attributes: {
        success_url: `${window.location.origin}/success/{CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/cart`,
        items: items,
        country: "NL",
        promotion: promo || null,
      },
    });
  };

  const shipping = api.query("/shipping", {
    type: "shipping",
    attributes: { country, items },
  });

  if (mut.data) {
    window.location.href = mut.data.attributes.redirect_url;
  }

  if (auth.loading) {
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

  const itemCards = cart
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
        {itemCards.length > 0 ? (
          <>
            {itemCards}

            <article class="card mb-1">
              <div class="card-body">
                <h4 class="card-title">
                  {shipping.data ? (
                    <>
                      {shipping.data?.attributes.name}
                      <span
                        class="text-muted"
                        style="display: inline-block; float: right"
                      >
                        €{shipping.data.attributes.cost / 100}
                      </span>
                    </>
                  ) : (
                    "Shipping"
                  )}
                </h4>

                <label for="country-select" class="lead">
                  <Icon>earth-europe</Icon> Shipping country:
                </label>
                <select
                  class="form-select"
                  id="country-select"
                  onChange={(e) => {
                    setCountry(e.currentTarget.value);
                  }}
                >
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
              </div>
            </article>

            <div>
              <label for="promo-input" class="lead">
                <Icon>gift</Icon> Promotion code:
              </label>
              <input
                type="text"
                autoComplete="off"
                class="form-control"
                onInput={(e) => setPromo(e.currentTarget.value)}
              />
            </div>

            <p class="lead mb-0">
              <Icon>money-bills</Icon> Total:{" "}
              <b>€{(total + (shipping.data?.attributes.cost || 0)) / 100}</b>
            </p>
            <p>
              Taxes and shipping are already included in the cost. The{" "}
              <a
                href="https://support.stripe.com/questions/understanding-your-currency-conversion-fees"
                target="_blank"
              >
                currency exchange comission
              </a>{" "}
              (if paying not in euros) will be calculated on the next step.
            </p>
            <Alert>{mut.error}</Alert>
            <button
              class="btn btn-primary w-100"
              onClick={checkout}
              disabled={mut.isPending}
            >
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
