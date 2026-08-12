import { useLocation } from "preact-iso";

export function Header() {
  const { url } = useLocation();

  const isActive = (target: string) => (url == target ? "active" : undefined);
  return (
    <header>
      <nav>
        <a href="/" class={isActive("/")}>
          Home
        </a>
        <a href="/404" class={isActive("/404")}>
          404
        </a>
      </nav>
    </header>
  );
}
