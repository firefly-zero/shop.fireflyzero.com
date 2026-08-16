import { ComponentChildren, createContext, FunctionComponent } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { supabase } from "../supabase";

interface User {
  email?: string;
  loading: boolean;
}

const AuthContext = createContext<User>({ loading: true });

export function useAuth(): User {
  return useContext(AuthContext);
}

export const Auth: FunctionComponent<{ children: ComponentChildren }> = (props) => {
  const [user, setUser] = useState<User>({ loading: true });

  useEffect(() => {
    const task = async () => {
      // Check for existing session using getClaims
      const resp = await supabase.auth.getClaims();
      const user = resp.data?.claims;
      if (user?.email) {
        setUser({ email: user.email, loading: false });
      }
    };
    task();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user.email) {
        setUser({ email: session?.user.email, loading: false });
      } else {
        setUser({ loading: false });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={user}>{props.children}</AuthContext.Provider>;
};
