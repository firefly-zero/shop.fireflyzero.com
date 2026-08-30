import { useLocation, useRoute } from "preact-iso";
import { api } from "../api";
import { Alert } from "../components/alert";
import { Loading } from "../components/loading";
import { useCart } from "../cart";
import { OrderCard } from "../components/order";
import { Container } from "../components/container";
import { Order } from "../types";
import { Header } from "../components/header";
import { supabase } from "../supabase";
import { Icon } from "../components/icon";
import { useAuth } from "../components/auth";

export function Me() {
  const order = api.get(`/orders`);
  const location = useLocation();
  const auth = useAuth();

  if (order.isLoading || auth.loading) {
    return (
      <Container title="Me">
        <Loading />
      </Container>
    );
  }
  if (!auth.email) {
    location.route("/sign-in");
  }
  if (order.error) {
    return (
      <Container title="Me">
        <Alert>{order.error}</Alert>
      </Container>
    );
  }

  const signOut = () => {
    supabase.auth.signOut();
    location.route("/");
  };
  return (
    <>
      <Header>Me</Header>
      <div>
        <p>
          Logged in as <b>{auth.email}</b>
        </p>
        <a class="btn btn-secondary" onClick={signOut}>
          <Icon>right-from-bracket</Icon> sign out
        </a>
      </div>
      <hr />
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-2 justify-content-center">
        {order.data.map((order: Order) => (
          <OrderCard>{order}</OrderCard>
        ))}
      </div>
    </>
  );
}
