import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { loginSchema, type LoginFormData } from "../lib/schemas";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import SplitFlap from "../components/features/SplitFlap";

const FLAP_MESSAGES = [
  "7:00 → 15:00",
  "SWAP PENDING",
  "APPROVED",
  "22:00 → 06:00",
  "COVERAGE FOUND",
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setServerError(null);
    try {
      await login(data);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Login failed");
    }
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col lg:flex-row">
      {/* Editorial side */}
      <div className="lg:w-1/2 bg-ink text-paper flex flex-col justify-between p-10 lg:p-16">
        <span className="font-sans text-sm tracking-wide text-paper/60">ShiftSwap</span>

        <div>
          <h1 className="font-display text-4xl lg:text-5xl leading-tight mb-6">
            Trade shifts,
            <br />
            not text messages.
          </h1>
          <SplitFlap messages={FLAP_MESSAGES} />
        </div>

        <p className="font-sans text-sm text-paper/50 max-w-xs">
          Every swap tracked, every approval logged, every conflict caught before it happens.
        </p>
      </div>

      {/* Form side */}
      <div className="lg:w-1/2 flex items-center justify-center p-10 lg:p-16">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-3xl text-ink mb-2">Sign in</h2>
          <p className="font-sans text-sm text-ink/60 mb-8">
            Welcome back. Enter your details below.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register("password")}
            />

            {serverError && (
              <p className="font-sans text-sm text-stamp-deep" role="alert">
                {serverError}
              </p>
            )}

            <Button type="submit" isLoading={isSubmitting} className="mt-2 bg-stamp hover:bg-stamp-deep">
              Sign in
            </Button>
          </form>

          <p className="font-sans text-sm text-ink/60 mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-stamp-deep font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}