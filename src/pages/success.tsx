import { useRoute } from "preact-iso";
import { api } from "../api";
import { Alert } from "../components/alert";
import { Loading } from "../components/loading";
import { useCart } from "../cart";
import { Icon } from "../components/icon";

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
      <ul class="list-group">
        <li class="list-group-item bg-primary">
          <b>
            <Icon>fingerprint</Icon> Order ID
          </b>
          : {orderId}
        </li>
        {order.data && (
          <>
            <li class="list-group-item">
              <b>
                <Icon>money-bills</Icon> Amount paid:
              </b>{" "}
              {order.data.attributes.amount / 100}{" "}
              {order.data.attributes.currency.toUpperCase()}
            </li>
            <li class="list-group-item">
              <b>
                <Icon>calendar-days</Icon> Placed on:
              </b>{" "}
              {order.data.attributes.created_at.split("T")[0]}
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
