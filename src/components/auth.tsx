import { createClient, JwtPayload } from "@supabase/supabase-js";
import { ComponentChildren, createContext, FunctionComponent } from "preact";
import { useLocation } from "preact-iso";
import { useContext, useEffect, useState } from "preact/hooks";
import { supabase } from "../supabase";

interface User {
  email: string;
}

const AuthContext = createContext<User | null>(null);

export function useAuth(): User | null {
  return useContext(AuthContext);
}

export const Auth: FunctionComponent<{ children: ComponentChildren }> = (props) => {
  const [user, setUser] = useState<any>(null);
  const { route } = useLocation();

  useEffect(() => {
    const task = async () => {
      // Check for existing session using getClaims
      const resp = await supabase.auth.getClaims();
      const user = resp.data?.claims;
      if (user?.email) {
        setUser({ email: user.email });
      }
    };
    task();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user.email) {
        const loggedIn = !user;
        setUser({ email: session?.user.email });
        if (loggedIn) {
          route("/cart");
        }
      } else {
        setUser(null);
        route("/");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={user}>{props.children}</AuthContext.Provider>;
};
