import { createClient, JwtPayload } from "@supabase/supabase-js";
import { createContext } from "preact";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);
