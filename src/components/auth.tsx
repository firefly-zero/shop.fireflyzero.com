import { createClient, JwtPayload } from "@supabase/supabase-js";
import { ComponentChildren, createContext, FunctionComponent } from "preact";
import { useLocation } from "preact-iso";
import { useContext, useEffect, useState } from "preact/hooks";
import { supabase } from "../supabase";

const AuthContext = createContext<JwtPayload | null>(null);

export function useAuth(): JwtPayload | null {
  return useContext(AuthContext);
}

export const Auth: FunctionComponent<{ children: ComponentChildren }> = (props) => {
  const [claims, setClaims] = useState<any>(null);
  const { route } = useLocation();

  useEffect(() => {
    const task = async () => {
      // Check for existing session using getClaims
      const resp = await supabase.auth.getClaims();
      const claims = resp.data?.claims;
      if (claims) {
        setClaims(claims);
      }
    };
    task();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      supabase.auth.getClaims().then((resp) => {
        const newClaims = resp.data?.claims;
        const loggedOut = !!claims && !newClaims;
        const loggedIn = !claims && !!newClaims;
        setClaims(newClaims);
        if (loggedOut) {
          route("/");
        }
        if (loggedIn) {
          route("/cart");
        }
      });
    });
    return () => subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={claims}>{props.children}</AuthContext.Provider>;
};
