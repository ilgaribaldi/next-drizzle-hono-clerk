"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UserButton, useUser, useAuth } from "@clerk/nextjs";
import {
  IconBrandTabler,
  IconMenu2,
  IconX,
  IconArrowNarrowLeft,
  IconPlus,
  IconCompass,
  IconDashboard,
  IconMessage2Question,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export function CollapsibleSidebar() {
  return (
    <SidebarLayout>
      <Dashboard />
    </SidebarLayout>
  );
}

export function SidebarLayout({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { orgSlug } = useAuth();
  const isAdmin = orgSlug === "admin";
  const { theme } = useTheme();

  const primaryLinks = [
    ...(isAdmin
      ? [
          {
            label: "Admin Panel",
            href: "/admin",
            icon: (
              <IconBrandTabler className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
          },
        ]
      : []),
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconDashboard className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  const secondaryLinks = [
    {
      label: "Create",
      href: "/create",
      icon: (
        <IconPlus className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Explore",
      href: "/explore",
      icon: (
        <IconCompass className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Contact",
      href: "/contact",
      icon: (
        <IconMessage2Question className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-8xl flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 dark:border-neutral-950 dark:bg-[#0a0a0a] md:flex-row",
        "h-screen",
        className
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-4 flex flex-col">
              {primaryLinks.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
            <div className="mt-4">
              <div className="h-px w-full bg-neutral-200 dark:bg-neutral-700"></div>
              <div className="h-px w-full bg-white dark:bg-neutral-900"></div>
            </div>
            <div className="mt-4 flex flex-col">
              {secondaryLinks.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
            <div className="mt-4">
              <div className="h-px w-full bg-neutral-200 dark:bg-neutral-700"></div>
              <div className="h-px w-full bg-white dark:bg-neutral-900"></div>
            </div>
            <div className="mt-4 px-0.5">
              <ModeToggle />
            </div>
          </div>

          <div className="mt-2 px-1 py-1">
            <UserButton
              appearance={{
                baseTheme: theme === "dark" ? [dark] : [],
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex-grow overflow-y-auto">{children}</div>
    </div>
  );
}

export const Logo = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center h-10">
      <Link
        href="/"
        className={cn(
          "relative z-20 flex items-center space-x-2 px-2 py-1 text-sm font-normal mb-2 text-black"
        )}
      >
        <Image
          src={"/assets/logo.svg"}
          alt="Logo"
          width={60}
          height={60}
          className="invert dark:text-white"
        />
      </Link>
    </div>
  );
};

export const LogoIcon = () => {
  return (
    <div className="h-10 flex items-center">
      <Link
        href="/"
        className="relative z-20 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black mb-1"
      >
        <Image
          src="/assets/logo.svg"
          alt="Logo"
          width={22}
          height={20}
          className="invert"
        />
      </Link>
    </div>
  );
};

// Dummy dashboard component with content
const Dashboard = () => {
  return (
    <div className="m-2 flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-2xl border border-neutral-200 bg-white p-2 dark:border-neutral-700 dark:bg-neutral-900 md:p-10">
        <div className="flex gap-2">
          {[...new Array(4)].map((_, i) => (
            <div
              key={"first-array" + i}
              className="h-20 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
            ></div>
          ))}
        </div>
        <div className="flex flex-1 gap-2">
          {[...new Array(2)].map((_, i) => (
            <div
              key={"second-array" + i}
              className="h-full w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
  value?: number;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen } = useSidebar();
  return (
    <motion.div
      className={cn(
        "group/sidebar-btn relative m-2 hidden h-full w-[300px] flex-shrink-0 rounded-xl bg-white px-4 py-4 dark:bg-neutral-900 md:flex md:flex-col",
        className
      )}
      animate={{
        width: open ? "300px" : "70px",
      }}
      initial={{ width: open ? "300px" : "70px" }}
      {...props}
    >
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "absolute -right-2 top-6 z-40 hidden h-5 w-5 transform items-center justify-center rounded-sm border border-neutral-200 bg-white transition duration-200 group-hover/sidebar-btn:flex dark:border-neutral-700 dark:bg-neutral-900",
          open ? "rotate-0" : "rotate-180"
        )}
      >
        <IconArrowNarrowLeft className="text-black dark:text-white" />
      </button>
      {children as React.ReactNode}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen } = useSidebar();
  return (
    <motion.div
      className={cn(
        "flex h-10 w-full flex-row items-center justify-between bg-neutral-100 px-4 py-4 dark:bg-neutral-800 md:hidden"
      )}
      {...props}
    >
      <div className="z-20 flex w-full justify-end">
        <IconMenu2
          className="text-neutral-800 dark:text-neutral-200"
          onClick={() => setOpen(!open)}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={cn(
              "fixed inset-0 z-[100] flex h-full w-full flex-col justify-between bg-white p-10 dark:bg-neutral-900",
              className
            )}
          >
            <div
              className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200"
              onClick={() => setOpen(!open)}
            >
              <IconX />
            </div>
            {children as React.ReactNode}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: LinkProps;
}) => {
  const { open } = useSidebar();
  return (
    <Link
      href={link.href}
      className={cn(
        "group/sidebar flex items-center justify-start gap-2 rounded-sm px-2 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 relative overflow-visible",
        className
      )}
      {...props}
    >
      <div className="relative">
        {link.icon}
        {!open && typeof link.value === "number" && link.value > 0 && (
          <Badge
            variant="outline"
            className="absolute -top-2 -right-2.5 inline-flex items-center justify-center h-4 min-w-[16px] px-1 py-0.5 bg-blue-500 text-white"
          >
            <span className="text-[8px] leading-none">{link.value}</span>
          </Badge>
        )}
      </div>

      <motion.span
        initial={{ display: "none", opacity: 0 }}
        animate={{
          display: open ? "inline-block" : "none",
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="!m-0 inline-flex items-center whitespace-pre !p-0 text-sm text-neutral-700 transition duration-150 dark:text-neutral-200"
      >
        <span className="flex items-center">
          {link.label}
          {typeof link.value === "number" && link.value > 0 && (
            <Badge
              variant="outline"
              className="ml-1.5 inline-flex items-center justify-center h-4 px-[6px] py-2 bg-blue-500 text-white"
            >
              <span className="text-[10px] leading-none">{link.value}</span>
            </Badge>
          )}
        </span>
      </motion.span>
    </Link>
  );
};
