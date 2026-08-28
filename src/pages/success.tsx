import { useRoute } from "preact-iso";
import { api } from "../api";
import { Alert } from "../components/alert";
import { Loading } from "../components/loading";
import { useCart } from "../cart";
import { OrderCard } from "../components/order";
import { Container } from "../components/container";

export function Success() {
  const route = useRoute();
  const orderId = route.params.id;
  const order = api.get(`/order/${orderId}`);
  const cart = useCart();

  if (order.isLoading) {
    return (
      <Container title="Order">
        <Loading />
      </Container>
    );
  }
  if (order.error) {
    return (
      <Container title="Order">
        <Alert>{order.error}</Alert>
      </Container>
    );
  }

  let alert;
  if (order.data?.attributes.paid) {
    cart.clear();
    alert = (
      <div class="alert alert-success" role="alert">
        We received your payment and will ship the order soon. Thank you!
      </div>
    );
  } else {
    alert = (
      <div class="alert alert-warning" role="alert">
        We're still processing your payment. We'll keep you posted!
      </div>
    );
  }
  return (
    <Container title="Order">
      {alert}
      <OrderCard>{order.data}</OrderCard>
    </Container>
  );
}
