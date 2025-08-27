import useAuth from "./useAuth";

export function useIsAdmin() {
  const { user } = useAuth();
  return user?.role === "admin";
}

export function useIsFinance() {
  const { user } = useAuth();
  return user?.role === "finance";
}

export function useIsIndicator() {
  const { user } = useAuth();
  return user?.role === "indicator";
}

export function useIsCommercial() {
  const { user } = useAuth();
  return user?.role === "commercial";
}