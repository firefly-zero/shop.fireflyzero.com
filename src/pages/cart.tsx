import { useLocation } from "preact-iso";
import { useAuth } from "../components/auth";
import { Loading } from "../components/loading";

export function Cart() {
  const { route } = useLocation();
  const auth = useAuth();

  if (auth.loading) {
    return <Loading />;
  }
  if (!auth.email) {
    route("/sign-in");
  }

  return (
    <div class="row justify-content-center">
      <div class="col-md-6" style="border: solid 2px black">
        <h2>Cart</h2>
      </div>
    </div>
  );
}
