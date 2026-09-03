import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { registerSchema, type RegisterFormData } from "../lib/schemas";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import SplitFlap from "../components/features/SplitFlap";

const FLAP_MESSAGES = [
  "NEW HIRE",
  "ROLE: EMPLOYEE",
  "ROLE: MANAGER",
  "WELCOME ABOARD",
];

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "EMPLOYEE" },
  });

  async function onSubmit(data: RegisterFormData) {
    setServerError(null);
    try {
      await registerUser(data);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Registration failed");
    }
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col lg:flex-row">
      {/* Editorial side */}
      <div className="lg:w-1/2 bg-ink text-paper flex flex-col justify-between p-10 lg:p-16">
        <span className="font-sans text-sm tracking-wide text-paper/60">ShiftSwap</span>

        <div>
          <h1 className="font-display text-4xl lg:text-5xl leading-tight mb-6">
            Every shift,
            <br />
            accounted for.
          </h1>
          <SplitFlap messages={FLAP_MESSAGES} />
        </div>

        <p className="font-sans text-sm text-paper/50 max-w-xs">
          Set up your account to start managing or trading shifts.
        </p>
      </div>

      {/* Form side */}
      <div className="lg:w-1/2 flex items-center justify-center p-10 lg:p-16">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-3xl text-ink mb-2">Create account</h2>
          <p className="font-sans text-sm text-ink/60 mb-8">
            Set up your ShiftSwap account.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              label="Full name"
              autoComplete="name"
              error={errors.name?.message}
              {...register("name")}
            />
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
              autoComplete="new-password"
              error={errors.password?.message}
              {...register("password")}
            />

            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-sm text-ink/70">Role</label>
              <div className="flex gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 border border-rule py-2.5 cursor-pointer has-[:checked]:border-stamp has-[:checked]:text-stamp-deep transition-colors font-sans text-sm">
                  <input type="radio" value="EMPLOYEE" {...register("role")} className="sr-only" />
                  Employee
                </label>
                <label className="flex-1 flex items-center justify-center gap-2 border border-rule py-2.5 cursor-pointer has-[:checked]:border-stamp has-[:checked]:text-stamp-deep transition-colors font-sans text-sm">
                  <input type="radio" value="MANAGER" {...register("role")} className="sr-only" />
                  Manager
                </label>
              </div>
            </div>

            {serverError && (
              <p className="font-sans text-sm text-stamp-deep" role="alert">
                {serverError}
              </p>
            )}

            <Button type="submit" isLoading={isSubmitting} className="mt-2 bg-stamp hover:bg-stamp-deep">
              Create account
            </Button>
          </form>

          <p className="font-sans text-sm text-ink/60 mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-stamp-deep font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}