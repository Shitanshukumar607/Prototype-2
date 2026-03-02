import type { Metadata } from "next"
import Image from "next/image"
import Script from "next/script"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SiteNav } from "@/components/site-nav"

import rnsitLogoImg from "@/assets/Rnsit_logo.png"
import logo25Img from "@/assets/25_logo.png"

export const metadata: Metadata = {
  title: "Luminus Techfest",
  description:
    "Luminus Techfest — Register for events, explore the schedule, and be part of the experience.",
}
import { SiteBackground } from "@/components/site-background"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body suppressHydrationWarning className={`${GeistSans.className} antialiased text-white`}>
        <Script id="chunk-load-recovery" strategy="beforeInteractive">
          {`
            (function () {
              if (typeof window === "undefined") return;
              var KEY = "__chunk_reload_once__";
              function recover(reason) {
                try {
                  if (sessionStorage.getItem(KEY) === "1") return;
                  sessionStorage.setItem(KEY, "1");
                } catch (e) {}
                console.warn("Recovering from chunk load failure:", reason);
                window.location.reload();
              }

              window.addEventListener("error", function (event) {
                var msg = String((event && event.message) || "");
                if (msg.includes("ChunkLoadError") || msg.includes("Loading chunk")) recover(msg);
              });

              window.addEventListener("unhandledrejection", function (event) {
                var reason = event && event.reason;
                var text = String((reason && (reason.message || reason)) || "");
                if (text.includes("ChunkLoadError") || text.includes("Loading chunk")) recover(text);
              });

              window.addEventListener("load", function () {
                try { sessionStorage.removeItem(KEY); } catch (e) {}
              });
            })();
          `}
        </Script>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Universal Site Background */}
          <SiteBackground />

          {/* Navigation */}
          <SiteNav />

          {/* Left Logo */}
          <div
            className="fixed top-4 left-4 z-50 flex h-10 sm:h-20 items-center justify-center pointer-events-none"
            aria-hidden
          >
            <Image
              src={rnsitLogoImg}
              alt="RNSIT Bengaluru"
              width={80}
              height={80}
              priority
              className="h-10 w-auto max-h-10 object-contain sm:h-20 sm:max-h-20"
            />
          </div>

          {/* Right Logo */}
          <div
            className="fixed top-4 right-4 z-50 flex h-10 sm:h-20 items-center justify-center pointer-events-none"
            aria-hidden
          >
            <Image
              src={logo25Img}
              alt="Luminus Techfest"
              width={80}
              height={80}
              priority
              className="h-10 w-auto max-h-10 object-contain sm:h-20 sm:max-h-20"
            />
          </div>

          {/* Page Content */}
          {children}

          {/* Toasts */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
