import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans, Inter, Noto_Sans } from "next/font/google";
import { AuthProvider } from "../lib/contexts/auth-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const notoSansEthiopic = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-ethiopic",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#10B981",
}

export const metadata: Metadata = {
  title: "GalaxyDreamTeam - Discover Your Hidden Potential",
  description: "Unlock your true potential with interactive tools and assessments. Transform your life through progressive engagement and personalized insights.",
  keywords: ["personal development", "potential assessment", "life coaching", "self-improvement", "Ethiopia"],
  authors: [{ name: "GalaxyDreamTeam" }],
  creator: "GalaxyDreamTeam",
  publisher: "GalaxyDreamTeam",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192x192.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "GalaxyDreamTeam - Discover Your Hidden Potential",
    description: "Unlock your true potential with interactive tools and assessments.",
    siteName: "GalaxyDreamTeam",
  },
  twitter: {
    card: "summary_large_image",
    title: "GalaxyDreamTeam - Discover Your Hidden Potential",
    description: "Unlock your true potential with interactive tools and assessments.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} ${inter.variable} ${notoSansEthiopic.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
