import { createClient } from "@supabase/supabase-js";
import { useLocation } from "preact-iso";
import { useEffect } from "preact/hooks";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);
