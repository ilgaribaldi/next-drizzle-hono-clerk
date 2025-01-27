import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { esES, enUS } from "@clerk/localizations";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { ModalsProvider } from "@/components/modals/modals-provider";
import { siteConfig } from "@/config/site";
import { seoKeywords } from "../../public/data/seo";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL("https://admin.yeyar.mx"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://admin.yeyar.mx",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    // images: [
    //   {
    //     url: 'https://yeyar.mx/images/og-image.jpg',
    //     width: 1200,
    //     height: 630,
    //     alt: 'Yeyar - Plataforma líder en preventa inmobiliaria en México',
    //   },
    // ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    // images: ['https://yeyar.mx/images/twitter-image.jpg'],
  },
  icons: [
    {
      url: "/images/favicon.ico",
      href: "/images/favicon.ico",
    },
    // {
    //   rel: 'apple-touch-icon',
    //   url: '/images/apple-touch-icon.png'
    // },
  ],
  alternates: {
    canonical: "https://admin.yeyar.mx",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: seoKeywords,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={esES} afterSignOutUrl={"/"}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>
              <ModalsProvider />
              <Toaster />
              {children}
            </Providers>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
