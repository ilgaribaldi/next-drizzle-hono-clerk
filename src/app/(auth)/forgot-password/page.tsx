"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Logo } from "../components/logo";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { OTPInput } from "input-otp";
import { FakeDash, Slot } from "../sign-up/[[...sign-up]]/OTPInput";
import { showInfoToast } from "@/components/toast/info-toast";
import { AmbientColor } from "../components/ambient-color";

const ForgotPassword = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <AmbientColor />
      <Form />
    </div>
  );
};

function Form() {
  const [step, setStep] = useState<"initial" | "code" | "reset">("initial");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) return;

    if (step === "initial") {
      try {
        await signIn.create({
          strategy: "reset_password_email_code",
          identifier: email,
        });
        setStep("code");
        setError(null);
        showInfoToast({ message: "Se ha enviado un código a tu email" });
      } catch (err: any) {
        console.error("Error:", JSON.stringify(err, null, 2));
        setError(
          err.errors?.[0]?.message ||
            "An unexpected error occurred. Please try again."
        );
      }
    } else if (step === "reset") {
      try {
        const result = await signIn.attemptFirstFactor({
          strategy: "reset_password_email_code",
          code,
          password,
        });

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          router.push("/dashboard");
        } else {
          console.error("Password reset failed:", result);
          setError("Password reset failed. Please try again.");
        }
      } catch (err: any) {
        console.error("Error:", JSON.stringify(err, null, 2));
        setError(
          err.errors?.[0]?.message ||
            "An unexpected error occurred. Please try again."
        );
      }
    }
  };

  const onCodeComplete = (code: string) => {
    setCode(code);
    setStep("reset");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex h-screen max-w-lg flex-col items-center justify-center"
    >
      <Logo />
      <h1 className="my-4 text-xl font-bold text-neutral-800 dark:text-neutral-100 md:text-4xl">
        Reset Password
      </h1>
      {error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6 text-red-400">
          <TriangleAlert className="w-4 h-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <motion.input
        initial={{ height: "0px", opacity: 0, marginBottom: "0px" }}
        animate={{
          height: step === "initial" ? "40px" : "0px",
          opacity: step === "initial" ? 1 : 0,
          marginBottom: step === "initial" ? "10px" : "0px",
        }}
        type="email"
        placeholder="email@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="block h-10 w-full rounded-md border-0 bg-white px-4 py-1.5 pl-4 text-black shadow-input placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-white sm:text-sm sm:leading-6"
      />

      {step === "code" && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginBottom: "0px" }}
          animate={{ opacity: 1, height: "auto", marginBottom: "20px" }}
          exit={{ opacity: 0, height: 0, marginBottom: "0px" }}
          transition={{ duration: 0.3 }}
        >
          <OTPInput
            onComplete={onCodeComplete}
            onChange={(code) => setCode(code)}
            value={code}
            maxLength={6}
            required
            className="flex justify-center"
            containerClassName="group flex items-center has-[:disabled]:opacity-30"
            render={({ slots }) => (
              <>
                <div className="flex">
                  {slots.slice(0, 3).map((slot, idx) => (
                    <Slot key={idx} {...slot} />
                  ))}
                </div>

                <FakeDash />

                <div className="flex">
                  {slots.slice(3).map((slot, idx) => (
                    <Slot key={idx} {...slot} />
                  ))}
                </div>
              </>
            )}
          />
        </motion.div>
      )}

      <motion.input
        initial={{ height: "0px", opacity: 0, marginBottom: "0px" }}
        animate={{
          height: step === "reset" ? "40px" : "0px",
          opacity: step === "reset" ? 1 : 0,
          marginBottom: step === "reset" ? "20px" : "0px",
        }}
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="block h-10 w-full rounded-md border-0 bg-white px-4 py-1.5 pl-4 text-black shadow-input placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-white sm:text-sm sm:leading-6"
      />

      <button
        type="submit"
        className="group/btn relative w-full rounded-lg bg-black px-4 py-3 text-white dark:bg-white dark:text-black"
      >
        <div className="absolute inset-0 h-full w-full transform opacity-0 transition duration-200 group-hover/btn:opacity-100">
          <div className="absolute -left-px -top-px h-4 w-4 rounded-tl-lg border-l-2 border-t-2 border-black bg-transparent transition-all duration-200 group-hover/btn:-left-4 group-hover/btn:-top-4 dark:border-white"></div>
          <div className="absolute -right-px -top-px h-4 w-4 rounded-tr-lg border-r-2 border-t-2 border-black bg-transparent transition-all duration-200 group-hover/btn:-right-4 group-hover/btn:-top-4 dark:border-white"></div>
          <div className="absolute -bottom-px -left-px h-4 w-4 rounded-bl-lg border-b-2 border-l-2 border-black bg-transparent transition-all duration-200 group-hover/btn:-bottom-4 group-hover/btn:-left-4 dark:border-white"></div>
          <div className="absolute -bottom-px -right-px h-4 w-4 rounded-br-lg border-b-2 border-r-2 border-black bg-transparent transition-all duration-200 group-hover/btn:-bottom-4 group-hover/btn:-right-4 dark:border-white"></div>
        </div>
        <span className="text-sm">
          {step === "initial"
            ? "Send code"
            : step === "code"
              ? "Verify code"
              : "Reset password"}
        </span>
      </button>
      <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
        Remember your password?{" "}
        <Link href="/sign-in" className="text-blue-500 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default ForgotPassword;
