"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export const Logo = ({ forceTheme }: { forceTheme?: "dark" | "light" }) => {
  const { theme } = useTheme();

  // Use forced theme if provided, otherwise use system theme
  const activeTheme = forceTheme || theme;

  return (
    <Link
      href="/"
      className={cn(
        "font-normal flex space-x-2 items-center text-sm  text-black px-2 py-1 relative z-20",
        activeTheme === "dark" && "dark:invert"
      )}
    >
      <Image src={"/assets/logo.svg"} alt="yeyar Logo" width={65} height={65} />
    </Link>
  );
};
