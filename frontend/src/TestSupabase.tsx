import { useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function TestSupabase() {
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getSession();
      console.log("getSession error:", error);
      console.log("session:", data?.session ?? null);
    })
  }, []);

  return (
    <button
      onClick={async () => {
        const { data, error } = await supabase.from("ping").select("*").limit(1);
        console.log("ping select:", { data, error });
      }}
    >
      test supabase :D
    </button>
  );
}
