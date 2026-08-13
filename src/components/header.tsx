import { useLocation } from "preact-iso";
import { Icon } from "./icon";

export function Header() {
  const { url } = useLocation();

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
        {url !== "/basket" && (
          <a href="/sign-in" class="btn btn-primary">
            <Icon>cart-shopping</Icon> basket
          </a>
        )}
      </nav>
    </header>
  );
}
