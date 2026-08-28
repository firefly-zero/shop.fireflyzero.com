import { useRoute } from "preact-iso";
import { api } from "../api";
import { Alert } from "../components/alert";
import { Loading } from "../components/loading";
import { useCart } from "../cart";
import { OrderCard } from "../components/order";
import { Container } from "../components/container";
import { Order } from "../types";
import { Header } from "../components/header";

export function Me() {
  const order = api.get(`/orders`);

  if (order.isLoading) {
    return (
      <Container title="Me">
        <Loading />
      </Container>
    );
  }
  if (order.error) {
    return (
      <Container title="Me">
        <Alert>{order.error}</Alert>
      </Container>
    );
  }

  return (
    <>
      <Header>Me</Header>
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-2 justify-content-center">
        {order.data.map((order: Order) => (
          <OrderCard>{order}</OrderCard>
        ))}
      </div>
    </>
  );
}
