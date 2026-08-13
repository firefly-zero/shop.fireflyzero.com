import { useLocation } from "preact-iso";
import { Icon } from "./icon";

export function Footer() {
  const { url } = useLocation();

  return (
    <footer class="text-center fs-1 pb-2 pt-2">
      <a href={url == "/" ? "https://fireflyzero.com" : "/"}>
        <Icon>lightbulb</Icon>
      </a>
    </footer>
  );
}
