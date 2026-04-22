import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@chaos/ui";
import { themeInitScript } from "@/lib/theme-init";
import { PWARegister } from "@/components/pwa/PWARegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "ChaosLengua",
  description:
      "AI-powered Spanish language learning through productive confusion and structured chaos",
  applicationName: "ChaosLengua",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ChaosLengua",
  },
  icons: {
    icon: '/logo.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "ChaosLengua",
    description: "AI-powered Spanish language learning through productive confusion and structured chaos",
    siteName: "ChaosLengua",
    locale: "en_US",
    type: "website",
    url: "https://chaoslengua.adhdesigns.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChaosLengua",
    description: "AI-powered Spanish language learning for ADHD brains",
  },
}

export const viewport: Viewport = {
  themeColor: "#E76F51",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            storageKey="chaoslengua-mode"
            disableTransitionOnChange
          >
            <div className="flex min-h-screen flex-col">
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster richColors closeButton position="bottom-right" />
            <PWARegister />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
