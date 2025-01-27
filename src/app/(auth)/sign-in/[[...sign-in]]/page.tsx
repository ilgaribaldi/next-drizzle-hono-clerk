"use client";
import React, { useState } from "react";
import {
  IconBrandGithub,
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { Logo } from "../../components/logo";
import { AmbientColor } from "../../components/ambient-color";

const SignIn = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <AmbientColor />
      <Form />
    </div>
  );
};

function Form() {
  const [step, setStep] = useState<"initial" | "email" | "password">("initial");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) return;

    if (step === "email") {
      if (isValidEmail(email)) {
        setStep("password");
      } else {
        // Show error message for invalid email
        console.error("Invalid email");
        return;
      }
    } else if (step === "password") {
      try {
        const result = await signIn.create({
          identifier: email,
          password,
        });

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          router.push("/dashboard");
        } else {
          console.error("Sign-in failed:", result);
        }
      } catch (err: any) {
        console.error("Error:", JSON.stringify(err, null, 2));
        if (err.errors && err.errors.length > 0) {
          setError(err.errors[0].message);
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      }
    }
  };

  const handleOAuthSignIn = async (
    strategy: "oauth_google" | "oauth_github"
  ) => {
    if (!isLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: any) {
      console.error("OAuth Error:", JSON.stringify(err, null, 2));
    }
  };

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex h-screen max-w-lg flex-col items-center justify-center relative"
    >
      <div className="absolute w-full flex justify-center top-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Logo />
        </motion.div>
      </div>
      <h1 className="my-4 text-xl font-bold text-neutral-800 dark:text-neutral-100 md:text-4xl">
        Sign in
      </h1>
      {error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6 text-red-400">
          <TriangleAlert className="w-4 h-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="flex w-full flex-col gap-4 sm:flex-row">
        <button
          type="button"
          onClick={() => handleOAuthSignIn("oauth_github")}
          className="flex flex-1 items-center justify-center space-x-2 rounded-md border border-neutral-200 bg-gray-100 px-4 py-3 text-neutral-700 shadow-[0px_1.5px_0px_0px_rgba(0,0,0,0.05)_inset] transition duration-200 hover:bg-gray-100/80 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 dark:shadow-[0px_1.5px_0px_0px_rgba(255,255,255,0.05)_inset]"
        >
          <IconBrandGithubFilled className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
          <span className="text-sm">GitHub</span>
        </button>
        <button
          type="button"
          onClick={() => handleOAuthSignIn("oauth_google")}
          className="flex flex-1 items-center justify-center space-x-2 rounded-md border border-neutral-200 bg-gray-100 px-4 py-3 text-neutral-700 shadow-[0px_1.5px_0px_0px_rgba(0,0,0,0.05)_inset] transition duration-200 hover:bg-gray-100/80 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 dark:shadow-[0px_1.5px_0px_0px_rgba(255,255,255,0.05)_inset]"
        >
          <IconBrandGoogleFilled className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
          <span className="text-sm">Google</span>
        </button>
      </div>

      <div className="my-6 h-px w-full bg-neutral-100 dark:bg-neutral-800" />
      <motion.input
        initial={{
          height: "0px",
          opacity: 0,
          marginBottom: "0px",
        }}
        animate={{
          height: step === "email" ? "40px" : "0px",
          opacity: step === "email" ? 1 : 0,
          marginBottom: step === "email" ? "10px" : "0px",
        }}
        type="email"
        placeholder="email@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="block h-10 w-full rounded-md border-0 bg-white px-4 py-1.5 pl-4 text-black shadow-input placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-white sm:text-sm sm:leading-6"
      />
      <motion.input
        initial={{
          height: "0px",
          opacity: 0,
          marginBottom: "0px",
        }}
        animate={{
          height: step === "password" ? "40px" : "0px",
          opacity: step === "password" ? 1 : 0,
          marginBottom: step === "password" ? "20px" : "0px",
        }}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="block h-10 w-full rounded-md border-0 bg-white px-4 py-1.5 pl-4 text-black shadow-input placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-white sm:text-sm sm:leading-6"
      />

      <button
        onClick={() => {
          if (step === "initial") {
            setStep("email");
          }
        }}
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
            ? "Continue with email"
            : step === "email"
              ? "Continue"
              : "Sign in"}
        </span>
      </button>
      <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
        Forgot your password?{" "}
        <Link href="/forgot-password" className="text-blue-500 hover:underline">
          Reset
        </Link>
      </p>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}

export default SignIn;
