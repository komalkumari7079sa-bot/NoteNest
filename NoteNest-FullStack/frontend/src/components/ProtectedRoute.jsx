import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Splash() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-lav-200 border-t-lav-600" role="status" aria-label="Loading" />
    </div>
  );
}

export function ProtectedRoute() {
  const { isAuthenticated, checking } = useAuth();
  const location = useLocation();
  if (checking) return <Splash />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { isAuthenticated, checking } = useAuth();
  if (checking) return <Splash />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
