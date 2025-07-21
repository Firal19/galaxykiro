import type { Viewport } from "next";
import { notFound } from 'next/navigation';
import { locales, type Locale } from '../../../i18n';
import { AuthProvider } from '../../lib/contexts/auth-context';

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#10B981",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <head>
        <title>Galaxy Dream Team</title>
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}