import { LocationProvider, Router, Route, hydrate, prerender as ssr } from "preact-iso";

import { Header } from "./components/header.js";
import { Home } from "./pages/home.js";
import { SignIn } from "./pages/sign-in.js";
import { NotFound } from "./pages/_404.jsx";
import "./style.css";
import { Footer } from "./components/footer.js";
import { Cart } from "./pages/cart.js";
import { QueryClientProvider } from "@tanstack/preact-query";
import { queryClient } from "./api.js";

export function App() {
  return (
    <LocationProvider>
      <QueryClientProvider client={queryClient}>
        <Header />
        <main>
          <Router>
            <Route path="/" component={Home} />
            <Route path="/sign-in" component={SignIn} />
            <Route path="/cart" component={Cart} />
            <Route default component={NotFound} />
          </Router>
        </main>
        <Footer />
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
