import { useLocation } from "preact-iso";
import { Icon } from "./icon";
import { useAuth } from "./auth";
import { supabase } from "../supabase";

export function Header() {
  const { url } = useLocation();
  const auth = useAuth();

  const signOut = () => {
    supabase.auth.signOut();
  };

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
        {auth ? (
          <a class="btn btn-secondary" onClick={signOut}>
            <Icon>right-from-bracket</Icon> sign out
          </a>
        ) : (
          url !== "/sign-in" && (
            <a href="/sign-in" class="btn btn-secondary">
              <Icon>right-from-bracket</Icon> sign in
            </a>
          )
        )}
        {url !== "/sign-in" && (
          <a href="/sign-in" class="btn btn-primary">
            <Icon>cart-shopping</Icon> cart
          </a>
        )}
      </nav>
    </header>
  );
}
