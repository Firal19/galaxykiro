import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Galaxy Dream Team - Discover Your Hidden Potential",
  description: "Unlock your true potential with Galaxy Dream Team's interactive tools and assessments. Transform your life through progressive engagement and personalized insights.",
};

// This is the root layout that wraps all pages
// The actual layout with fonts, providers, etc. is in [locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
