import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin();
  const location = useLocation();

  // Se ainda está carregando user ou role → segura
  if (loading || (adminOnly && isAdmin === undefined)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg">Carregando...</span>
      </div>
    );
  }

  // Não logado → manda pro login com redirect
  if (!user) {
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Só redireciona se já tiver certeza que não é admin
  if (adminOnly && isAdmin === false) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
