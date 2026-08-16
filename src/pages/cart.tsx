import { useLocation } from "preact-iso";
import { useAuth } from "../components/auth";
import { Loading } from "../components/loading";
import { Icon } from "../components/icon";
import { useCart } from "../cart";

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

  const items = cart.list().map((item) => {
    const { product, variant } = item;
    return (
      <article class="card mb-1">
        <div class="card-body">
          <h4 class="card-title">{product.attributes.name}</h4>
          <p class="card-text">
            €{variant.attributes.price / 100} x {item.qty} = €
            {(variant.attributes.price * item.qty) / 100}
          </p>
          <button class="btn btn-danger" onClick={() => cart.remove(item)}>
            <Icon>trash</Icon> remove
          </button>
        </div>
      </article>
    );
  });
  return (
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h2>Cart</h2>
        {items}
      </div>
    </div>
  );
}
