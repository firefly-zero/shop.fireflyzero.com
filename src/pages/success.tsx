import { useLocation, useRoute } from "preact-iso";
import { api } from "../api";
import { Alert } from "../components/alert";
import { Loading } from "../components/loading";
import { ProductCard } from "../components/product";
import { Product } from "../types";
import { useCart } from "../cart";

export function Success() {
  const route = useRoute();
  const orderId = route.params.id;
  const order = api.get(`/order/${orderId}`);
  const cart = useCart();

  if (order.isLoading) {
    return <Loading />;
  }
  if (order.error) {
    return <Alert>{order.error}</Alert>;
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
    <div>
      {alert}
      <p>
        <b>Order ID</b>: {orderId}
      </p>
    </div>
  );
}
