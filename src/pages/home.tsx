import { api } from "../api";
import { Alert } from "../components/alert";
import { Icon } from "../components/icon";
import { Loading } from "../components/loading";

function getPrice(variants: any[]): number {
  return variants[0].attributes.price / 100;
}

export function Home() {
  const query = api.get("/products");
  if (query.error) {
    return <Alert>{query.error}</Alert>;
  }
  if (!query.data) {
    return <Loading />;
  }

  const cards = query.data.map((item: any) => {
    const price = getPrice(item.attributes.variants);
    const name: string = item.attributes.name;
    if (name.toLowerCase().indexOf("donation") >= 0) {
      return;
    }
    return (
      <div class="col">
        <article class="card">
          <div class="card-body">
            <h4 class="card-title">
              {name}
              {price !== 0 && (
                <span style="float: right" class="text-muted">
                  €{price}
                </span>
              )}
            </h4>
            <p class="card-text">{item.attributes.description}</p>
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
    );
  });
  return <section class="row row-cols-3 g-2">{cards}</section>;
}
