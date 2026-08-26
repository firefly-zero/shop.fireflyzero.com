import { LocationProvider, Router, Route, hydrate, prerender as ssr } from "preact-iso";
import { Home } from "./pages/home.js";
import { SignIn } from "./pages/sign-in.js";
import { NotFound } from "./pages/_404.jsx";
import "./style.css";
import { Footer } from "./components/footer.js";
import { Cart } from "./pages/cart.js";
import { QueryClientProvider } from "@tanstack/preact-query";
import { queryClient } from "./api.js";
import { Auth } from "./components/auth.js";
import { Success } from "./pages/success.js";

export function App() {
  return (
    <LocationProvider>
      <QueryClientProvider client={queryClient}>
        <Auth>
          <main>
            <Router>
              <Route path="/" component={Home} />
              <Route path="/sign-in" component={SignIn} />
              <Route path="/cart" component={Cart} />
              <Route path="/success/:id" component={Success} />
              <Route default component={NotFound} />
            </Router>
          </main>
          <Footer />
        </Auth>
      </QueryClientProvider>
    </LocationProvider>
  );
}

if (typeof window !== "undefined") {
  const container = document.getElementById("app");
  if (container) {
    hydrate(<App />, container);
  }
}

export async function prerender(data: any) {
  return await ssr(<App {...data} />);
}
