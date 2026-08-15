import { api } from "../api";
import { Alert } from "../components/alert";
import { Icon } from "../components/icon";
import { Loading } from "../components/loading";
import { Product } from "../components/product";

export function Home() {
  const query = api.get("/products");
  if (query.error) {
    return <Alert>{query.error}</Alert>;
  }
  if (!query.data) {
    return <Loading />;
  }
  const cards = query.data.map((item: any) => <Product>{item}</Product>);
  return <section class="row row-cols-3 g-2">{cards}</section>;
}
