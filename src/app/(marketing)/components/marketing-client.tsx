"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export function MarketingClient() {
  const { isSignedIn } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <h1 className="text-3xl text-white">Landing Page</h1>
      <div className="mt-4 flex flex-col items-center gap-4">
        <div className="flex items-center justify-center gap-2"></div>
        {isSignedIn ? (
          <Link href="/dashboard" className="text-white hover:underline">
            Enter Dashboard
          </Link>
        ) : (
          <Link href="/sign-in" className="text-white hover:underline">
            Sign In
          </Link>
        )}
        <Link href="/dashboard" className="text-white hover:underline">
          Dashboard
        </Link>
      </div>
    </div>
  );
}
