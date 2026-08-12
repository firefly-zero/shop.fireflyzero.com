import { LocationProvider, Router, Route, hydrate, prerender as ssr } from "preact-iso";

import { Header } from "./components/Header.jsx";
import { Home } from "./pages/Home/index.jsx";
import { NotFound } from "./pages/_404.jsx";
import "./style.css";
import { Footer } from "./components/Footer.js";

export function App() {
  return (
    <LocationProvider>
      <Header />
      <main>
        <Router>
          <Route path="/" component={Home} />
          <Route default component={NotFound} />
        </Router>
      </main>
      <Footer />
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
