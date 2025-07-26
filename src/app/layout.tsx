import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/auth-context";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { ServiceProvider } from "@/components/providers/ServiceProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Galaxy Dream Team - Discover Your Hidden Potential",
  description: "Unlock your true potential with Galaxy Dream Team's interactive tools and assessments. Transform your life through progressive engagement and personalized insights.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <ServiceProvider>
            <AuthProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </AuthProvider>
          </ServiceProvider>
          <PerformanceMonitor />
        </QueryProvider>
      </body>
    </html>
  );
}
