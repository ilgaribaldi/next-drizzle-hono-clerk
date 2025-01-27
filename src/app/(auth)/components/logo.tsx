import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export const Logo = () => {
  const { theme } = useTheme();

  return (
    <Link
      href="/"
      className={cn(
        "font-normal flex space-x-2 items-center text-sm mr-4 text-black px-2 py-1 relative z-20 dark:invert",
        theme === "dark" && "dark:invert"
      )}
    >
      <Image src={"/assets/logo.svg"} alt="yeyar Logo" width={65} height={65} />
    </Link>
  );
};
