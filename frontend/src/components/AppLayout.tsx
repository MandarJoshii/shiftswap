import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./ui/Button";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `font-sans text-sm pb-1 border-b-2 transition-colors ${
    isActive ? "border-stamp text-ink" : "border-transparent text-ink/60 hover:text-ink"
  }`;

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-rule">
        <div className="flex items-center justify-between px-6 lg:px-10 py-5">
          <h1 className="font-display text-2xl text-ink">ShiftSwap</h1>
          <div className="flex items-center gap-4">
            <span className="font-sans text-sm text-ink/70">
              {user?.name} · {user?.role}
            </span>
            <Button variant="ghost" onClick={logout}>
              Log out
            </Button>
          </div>
        </div>
        <nav className="flex items-center gap-6 px-6 lg:px-10">
          <NavLink to="/dashboard" className={navLinkClass}>
            Schedule
          </NavLink>
          <NavLink to="/swaps" className={navLinkClass}>
            Swap marketplace
          </NavLink>
          <NavLink to="/requests" className={navLinkClass}>
            {user?.role === "MANAGER" ? "Approvals" : "My requests"}
          </NavLink>
        </nav>
      </header>

      <main className="px-6 lg:px-10 py-8">
        <Outlet />
      </main>
    </div>
  );
}