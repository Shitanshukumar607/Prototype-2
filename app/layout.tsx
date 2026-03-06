import type { Metadata } from "next"
import Script from "next/script"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SiteNav } from "@/components/site-nav"
import { CornerLogos } from "@/components/corner-logos"

export const metadata: Metadata = {
  metadataBase: new URL("https://luminus.rnsit.ac.in"),
  title: "Luminus Techfest",
  description:
    "Luminus Techfest — Register for events, explore the schedule, and be part of the experience.",
  verification: {
    google: "QjwFBT4FZ8oITegXR-xgntk5-NOCK7vsmBeFJIQ-Qus",
  },
  keywords: [
    "Luminus",
    "Luminous",
    "Luminus Techfest",
    "Luminous Techfest",
    "Luminus tech fest",
    "Luminous tech fest",
    "Luminus RNSIT",
    "Luminous RNSIT",
    "Luminus RNSIT fest",
    "Luminous RNSIT fest",
    "Luminus 2026",
    "Luminus 2026 techfest",
    "RNSIT techfest",
    "RNSIT fest",
    "RNSIT Luminus",
    "RNSIT Luminous",
    "Solaris X",
    "Solaris X hackathon",
    "Solaris X Grand Hackathon",
    "RNSIT hackathon",
    "Bangalore tech fest",
    "Bengaluru techfest",
    "RNS Institute of Technology fest",
    "RNSIT",
    "R N S I T",
    "RNS Institute of Technology",
    "RNSIT Bangalore",
    "RNSIT Bengaluru",
  ],
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/favicon/site.webmanifest",
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

          {/* Corner logos that fade out on scroll */}
          <CornerLogos />

          {/* Page Content + footer at bottom of page */}
          <div className="min-h-screen flex flex-col">
            <div className="flex-1">{children}</div>
            <footer className="relative z-[20] border-t border-white/10 bg-black/60 backdrop-blur-xl">
              <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-6 py-3 text-[11px] text-white/55 sm:flex-row">
                <p className="tracking-[0.18em] uppercase">
                  Luminus Techfest · RNSIT · 2026
                </p>
                <div className="flex items-center gap-3 text-[10px] text-white/45">
                  <a
                    href="https://www.instagram.com/luminus.rnsit?igsh=YW8zcXg3bmVoZ3Z3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-2 hover:text-white/80 hover:underline"
                  >
                    Instagram @luminus.rnsit
                  </a>
                  <span className="hidden sm:inline text-white/30">·</span>
                  <span className="hidden sm:inline text-white/40">
                    Crafted for the Luminus 2026 experience.
                  </span>
                </div>
              </div>
            </footer>
          </div>

          {/* Toasts */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
