import { useLocation } from "preact-iso";
import { icon } from "../html-utils";

export function Header() {
  const { url } = useLocation();

  return (
    <header class="row justify-content-between align-items-end">
      <h1 class="col">Firefly Zero Shop</h1>
      <nav class="col text-end lead">
        <a href="https://fireflyzero.com" target="_blank" class="btn btn-secondary">
          <i class={icon("circle-info")}></i> about
        </a>
        <a href="/" class="btn btn-secondary">
          <i class={icon("shirt")}></i> products
        </a>
        <a href="/" class="btn btn-primary">
          <i class={icon("cart-shopping")}></i> basket
        </a>
      </nav>
    </header>
  );
}
