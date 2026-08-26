import { useLocation } from "preact-iso";
import { Icon } from "./icon";
import { useAuth } from "./auth";
import { supabase } from "../supabase";
import { useCart } from "../cart";
import { FunctionComponent } from "preact";

interface Props {
  children?: string;
}

export const Header: FunctionComponent<Props> = (props) => {
  const { url, route } = useLocation();
  const auth = useAuth();
  const cart = useCart();

  const signOut = () => {
    supabase.auth.signOut();
    route("/");
  };

  let cartSuffix = <></>;
  const cartSize = cart.list().length;
  if (cartSize > 0) {
    cartSuffix = (
      <span class="position-absolute top-100 start-100 translate-middle badge rounded-pill bg-secondary">
        {cartSize}
      </span>
    );
  }

  return (
    <header class="row justify-content-between align-items-end mb-2">
      <h1 class="col-12 col-md-8">
        <a href="https://fireflyzero.com/" target="_blank">
          Firefly Zero
        </a>
        {" / "}
        {url === "/" ? "Shop" : <a href="/">Shop</a>}
        {props.children && " / " + props.children}
      </h1>
      <nav class="col text-end lead">
        {auth.email ? (
          <>
            <a class="btn btn-secondary" onClick={signOut}>
              <Icon>right-from-bracket</Icon> sign out
            </a>
            {url !== "/cart" && (
              <a href="/cart" class="btn btn-primary">
                <Icon>cart-shopping</Icon> cart {cartSuffix}
              </a>
            )}
          </>
        ) : (
          url !== "/sign-in" && (
            <>
              <a href="/sign-in" class="btn btn-secondary">
                <Icon>right-from-bracket</Icon> sign in
              </a>
              <a href="/sign-in" class="btn btn-primary">
                <Icon>cart-shopping</Icon> cart {cartSuffix}
              </a>
            </>
          )
        )}
      </nav>
    </header>
  );
};
