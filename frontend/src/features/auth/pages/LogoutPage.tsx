import { useEffect, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/** Summary: Signs the user out and redirects to login. */
export function LogoutPage(): ReactElement {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const runLogout = async (): Promise<void> => {
      try {
        await logout();
      } finally {
        if (isMounted) {
          navigate("/login", { replace: true });
        }
      }
    };

    void runLogout();

    return () => {
      isMounted = false;
    };
  }, [logout, navigate]);

  return (
    <section className="space-y-2 text-center">
      <h1 className="text-2xl font-semibold">Signing out</h1>
      <p className="text-sm text-slate-600">Please wait while we clear your session.</p>
    </section>
  );
}
