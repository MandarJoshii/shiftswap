import { NavLink, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Button from "./ui/Button";
import NotificationBell from "./features/NotificationBell";

const navItems = (isManager: boolean) => [
  { to: "/dashboard", label: "Schedule" },
  { to: "/swaps", label: "Swap marketplace" },
  { to: "/requests", label: isManager ? "Approvals" : "My requests" },
  ...(isManager ? [{ to: "/history", label: "History" }] : []),
];

function NavTabs() {
  const { user } = useAuth();
  const location = useLocation();
  const isManager = user?.role === "MANAGER";

  return (
    <nav className="flex items-center gap-6 px-6 lg:px-10 relative">
      {navItems(isManager).map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={`relative font-sans text-sm pb-2.5 transition-colors ${
              isActive ? "text-ink" : "text-ink/60 hover:text-ink"
            }`}
          >
            {item.label}
            {isActive && (
              <motion.div
                layoutId="nav-underline"
                className="absolute left-0 right-0 -bottom-px h-0.5 bg-stamp"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

export default function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-rule">
        <div className="flex items-center justify-between px-6 lg:px-10 py-5">
          <h1 className="font-display text-2xl text-ink">ShiftSwap</h1>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <span className="font-sans text-sm text-ink/70">
              {user?.name} · {user?.role}
            </span>
            <Button variant="ghost" onClick={logout}>
              Log out
            </Button>
          </div>
        </div>
        <NavTabs />
      </header>

      <main className="px-6 lg:px-10 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}