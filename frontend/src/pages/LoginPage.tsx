import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { motion } from "framer-motion";
import { loginSchema, type LoginFormData } from "../lib/schemas";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import ApprovalStamp from "../components/features/ApprovalStamp";
import FlipClock from "../components/features/FlipClock";
import ShiftConveyor from "../components/features/ShiftConveyor";
import MouseSpotlight from "../components/features/MouseSpotlight";
import InkBurst from "../components/features/InkBurst";
import AnimatedHeadline from "../components/features/AnimatedHeadline";

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
    <div className="min-h-screen bg-ink relative overflow-hidden flex flex-col">
      {/* Ambient layers */}
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

      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-6 lg:px-16 py-8 relative z-10"
      >
        <span className="font-sans text-sm tracking-wide text-paper/60">ShiftSwap</span>
        <FlipClock />
      </motion.div>

      {/* Main composition */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-14 lg:gap-8 px-6 lg:px-16 py-10 relative z-10">
        {/* Headline */}
        <div className="lg:w-1/2 relative">
          <AnimatedHeadline
            lines={["Trade shifts,", "not text", "messages."]}
            className="font-display text-6xl md:text-7xl lg:text-[5.25rem] leading-[0.92] text-paper -rotate-1 origin-left"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="font-sans text-sm text-paper/45 max-w-xs mt-8 ml-1"
          >
            Every swap tracked, every approval logged, every conflict caught before it happens.
          </motion.p>
        </div>

        {/* Docket card */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -3 }}
          animate={{ opacity: 1, y: 0, rotate: -1.5 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ rotate: 0 }}
          className="relative lg:w-[420px] w-full max-w-sm"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: 14 }}
            transition={{ duration: 0.4, delay: 1.05, ease: "backOut" }}
            className="absolute w-24 h-24 md:w-28 md:h-28 text-stamp -top-10 -right-8 z-20 pointer-events-none"
          >
            <InkBurst delay={1.05} />
            <ApprovalStamp ringText="SHIFTSWAP · VERIFIED · SHIFTSWAP · VERIFIED ·" centerText="OK" className="w-full h-full" />
          </motion.div>

          <div className="bg-paper-raised relative" style={{ boxShadow: "7px 7px 0 rgba(20,24,29,0.9)" }}>
            <div className="border-b-2 border-dashed border-rule px-7 py-4 flex items-center justify-between relative">
              <span className="font-mono text-[11px] tracking-widest text-ink/40 uppercase">Sign-in docket</span>
              <span className="font-mono text-[11px] text-ink/40">{new Date().getFullYear()}</span>
            </div>

            <div className="p-7 lg:p-8">
              <h2 className="font-display text-3xl text-ink mb-1">Sign in</h2>
              <p className="font-sans text-sm text-ink/60 mb-7">Welcome back. Enter your details below.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
                <Input label="Password" type="password" autoComplete="current-password" error={errors.password?.message} {...register("password")} />

                {serverError && (
                  <p className="font-sans text-sm text-stamp-deep" role="alert">
                    {serverError}
                  </p>
                )}

                <Button type="submit" isLoading={isSubmitting} className="mt-2 bg-stamp hover:bg-stamp-deep">
                  Sign in
                </Button>
              </form>

              <p className="font-sans text-sm text-ink/60 mt-7">
                Don't have an account?{" "}
                <Link to="/register" className="text-stamp-deep font-medium hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}