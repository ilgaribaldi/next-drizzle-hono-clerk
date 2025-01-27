"use client";

import RetroGrid from "@/components/ui/retro-grid";
import Link from "next/link";
import { useOrganization } from "@clerk/nextjs";

export function NotFound() {
  const { organization } = useOrganization();
  const isAdmin = organization?.slug === "admin";

  const getRedirectPath = () => {
    if (isAdmin) {
      return "/admin";
    } else {
      return "/dashboard";
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-white dark:bg-zinc-950">
      <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
        Resource not found
      </span>
      <Link
        href={getRedirectPath()}
        className="mt-4 text-sm text-gray-400 hover:text-gray-300 transition-colors"
      >
        Back to home
      </Link>

      <RetroGrid className="absolute inset-0" />
    </div>
  );
}

export default NotFound;
