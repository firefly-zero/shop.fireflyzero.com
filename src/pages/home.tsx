import { api } from "../api";
import { Alert } from "../components/alert";
import { Container } from "../components/container";
import { Header } from "../components/header";
import { Icon } from "../components/icon";
import { Loading } from "../components/loading";
import { ProductCard } from "../components/product";
import { Product } from "../types";

export function Home() {
  const query = api.get("/products");
  if (query.error) {
    return (
      <>
        <Header></Header>
        <Alert>{query.error}</Alert>
      </>
    );
  }
  if (!query.data) {
    return (
      <>
        <Header></Header>
        <Loading />
      </>
    );
  }
  const cards = query.data.map((item: Product) => (
    <ProductCard products={query.data}>{item}</ProductCard>
  ));
  return (
    <>
      <Header></Header>
      <div class="alert alert-warning" role="alert">
        <Icon>earth-europe</Icon> We currently only ship within Benelux (Belgium,
        Netherlands, and Luxembourg). More countries will be added soon. Stay tuned!
      </div>
      <section class="row g-2">{cards}</section>
    </>
  );
}
