import { useLocation } from "preact-iso";
import { Icon } from "./icon";
import { useAuth } from "./auth";
import { supabase } from "../supabase";
import { cart } from "../cart";

export function Header() {
  const { url, route } = useLocation();
  const auth = useAuth();

  const signOut = () => {
    supabase.auth.signOut();
    route("/");
  };

  let cartSuffix = <></>;
  const cartSize = cart.list().length;
  if (cartSize > 0) {
    cartSuffix = <span class="text-muted">({cartSize})</span>;
  }

  return (
    <header class="row justify-content-between align-items-end mb-2">
      <h1 class="col">Firefly Zero shop</h1>
      <nav class="col text-end lead">
        <a href="https://fireflyzero.com" target="_blank" class="btn btn-secondary">
          <Icon>circle-info</Icon> about
        </a>
        {url !== "/" && (
          <a href="/" class="btn btn-secondary">
            <Icon>shirt</Icon> products
          </a>
        )}
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
}
