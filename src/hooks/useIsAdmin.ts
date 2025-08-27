import useAuth from "./useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useIsAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    async function fetchRole() {
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        setIsAdmin(data?.role === "admin");
      } else if (user === null) {
        setIsAdmin(false);
      }
    }
    fetchRole();
  }, [user]);

  return isAdmin;
}