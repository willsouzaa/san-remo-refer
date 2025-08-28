import { Navigate, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { useIsAdmin, useUserRole } from "@/hooks/useIsAdmin";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  financeOnly?: boolean;
  commercialOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false, financeOnly = false, commercialOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin();
  const userRole = useUserRole();
  const location = useLocation();

  // Show loading while auth is being determined
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Não logado → manda pro login com redirect
  if (!user) {
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Role-based access control
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (financeOnly && userRole !== 'finance' && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (commercialOnly && userRole !== 'commercial' && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}