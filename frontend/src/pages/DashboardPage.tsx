import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-paper p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-ink">ShiftSwap</h1>
        <div className="flex items-center gap-4">
          <span className="font-sans text-sm text-ink/70">
            {user?.name} · {user?.role}
          </span>
          <Button variant="ghost" onClick={logout}>
            Log out
          </Button>
        </div>
      </div>
      <p className="font-sans text-ink/70">
        Dashboard content coming on Day 3.
      </p>
    </div>
  );
}