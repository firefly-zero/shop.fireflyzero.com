import { Icon } from "../../components/Icon";

export function Home() {
  const items = ["Firefly Zero", "T-Shirt", "Sticker"];
  const cards = items.map((item) => (
    <div class="col">
      <article class="card">
        <div class="card-body">
          <h4 class="card-title">{item}</h4>
          <p class="card-text">Hello world!</p>
        </div>
        <div class="card-footer">
          <a href="#" class="btn btn-primary">
            <Icon>info-circle</Icon> info
          </a>
          <a href="#" class="btn btn-primary">
            <Icon>cart-plus</Icon> buy
          </a>
        </div>
      </article>
    </div>
  ));
  return (
    <div class="home">
      <section class="row row-cols-3 g-2">{cards}</section>
    </div>
  );
}
