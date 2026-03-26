import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "@/stores/auth-store";

/** Requires authenticated user. Redirects to /login if not. */
export function AuthGuard() {
  const user = useAuthStore((s) => s.user);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      fetchMe().catch(() => {});
    }
  }, []);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

/** Requires authenticated user + active player selected. */
export function PlayerGuard() {
  const activePlayer = useAuthStore((s) => s.activePlayer);

  if (!activePlayer) {
    return <Navigate to="/players" replace />;
  }

  return <Outlet />;
}
