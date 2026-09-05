import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { motion } from "framer-motion";
import { registerSchema, type RegisterFormData } from "../lib/schemas";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import ApprovalStamp from "../components/features/ApprovalStamp";
import FlipClock from "../components/features/FlipClock";
import ShiftConveyor from "../components/features/ShiftConveyor";
import MouseSpotlight from "../components/features/MouseSpotlight";
import InkBurst from "../components/features/InkBurst";
import AnimatedHeadline from "../components/features/AnimatedHeadline";

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
    <div className="min-h-screen bg-ink relative overflow-hidden flex flex-col">
      <ShiftConveyor />
      <MouseSpotlight />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(243,243,239,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(243,243,239,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-6 lg:px-16 py-8 relative z-10"
      >
        <span className="font-sans text-sm tracking-wide text-paper/60">ShiftSwap</span>
        <FlipClock />
      </motion.div>

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-14 lg:gap-8 px-6 lg:px-16 py-10 relative z-10">
        <div className="lg:w-1/2 relative">
          <AnimatedHeadline
            lines={["Every shift,", "accounted", "for."]}
            className="font-display text-6xl md:text-7xl lg:text-[5.25rem] leading-[0.92] text-paper -rotate-1 origin-left"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="font-sans text-sm text-paper/45 max-w-xs mt-8 ml-1"
          >
            Set up your account to start managing or trading shifts.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 3 }}
          animate={{ opacity: 1, y: 0, rotate: 1.5 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ rotate: 0 }}
          className="relative lg:w-[420px] w-full max-w-sm"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: -12 }}
            transition={{ duration: 0.4, delay: 1.05, ease: "backOut" }}
            className="absolute w-24 h-24 md:w-28 md:h-28 text-stamp -top-10 -left-8 z-20 pointer-events-none"
          >
            <InkBurst delay={1.05} />
            <ApprovalStamp ringText="SHIFTSWAP · NEW HIRE · SHIFTSWAP · NEW HIRE ·" centerText="GO" className="w-full h-full" />
          </motion.div>

          <div className="bg-paper-raised relative" style={{ boxShadow: "7px 7px 0 rgba(20,24,29,0.9)" }}>
            <div className="border-b-2 border-dashed border-rule px-7 py-4 flex items-center justify-between relative">
              <span className="font-mono text-[11px] tracking-widest text-ink/40 uppercase">New hire docket</span>
              <span className="font-mono text-[11px] text-ink/40">{new Date().getFullYear()}</span>
            </div>

            <div className="p-7 lg:p-8">
              <h2 className="font-display text-3xl text-ink mb-1">Create account</h2>
              <p className="font-sans text-sm text-ink/60 mb-7">Set up your ShiftSwap account.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <Input label="Full name" autoComplete="name" error={errors.name?.message} {...register("name")} />
                <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
                <Input label="Password" type="password" autoComplete="new-password" error={errors.password?.message} {...register("password")} />

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

              <p className="font-sans text-sm text-ink/60 mt-7">
                Already have an account?{" "}
                <Link to="/login" className="text-stamp-deep font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}