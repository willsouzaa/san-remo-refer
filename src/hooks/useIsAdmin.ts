import useAuth from "./useAuth";

export function useIsAdmin() {
  const { user } = useAuth();
  
  if (!user) return false;
  return user.role === 'admin';
}

export function useIsStaff() {
  const { user } = useAuth();
  
  if (!user) return false;
  return ['admin', 'finance', 'commercial'].includes(user.role);
}

export function useUserRole() {
  const { user } = useAuth();
  return user?.role || null;
}