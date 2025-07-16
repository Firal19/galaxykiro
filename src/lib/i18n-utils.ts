import { useLocale } from 'next-intl';
import { locales } from '../../i18n';

export type Locale = typeof locales[number];

/**
 * Hook to get localized path
 */
export function useLocalizedPath() {
  const locale = useLocale();
  
  return (path: string) => {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    // Return localized path
    return `/${locale}${cleanPath ? `/${cleanPath}` : ''}`;
  };
}

/**
 * Generate localized path for a given locale
 */
export function getLocalizedPath(path: string, locale: string) {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/${locale}${cleanPath ? `/${cleanPath}` : ''}`;
}

/**
 * Extract locale from pathname
 */
export function getLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];
  
  if (locales.includes(potentialLocale as Locale)) {
    return potentialLocale;
  }
  
  return 'en'; // default locale
}

/**
 * Remove locale from pathname
 */
export function removeLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];
  
  if (locales.includes(potentialLocale as Locale)) {
    return '/' + segments.slice(2).join('/');
  }
  
  return pathname;
}

/**
 * Check if a locale is supported
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * Get opposite locale (for toggle functionality)
 */
export function getOppositeLocale(currentLocale: string): string {
  return currentLocale === 'en' ? 'am' : 'en';
}

/**
 * Format numbers according to locale
 */
export function formatNumber(number: number, locale: string): string {
  return new Intl.NumberFormat(locale === 'am' ? 'am-ET' : 'en-US').format(number);
}

/**
 * Format dates according to locale
 */
export function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'am' ? 'am-ET' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/**
 * Get text direction for locale
 */
export function getTextDirection(_locale: string): 'ltr' | 'rtl' {
  // Amharic is written left-to-right
  return 'ltr';
}

/**
 * Get locale display name
 */
export function getLocaleDisplayName(locale: string): string {
  switch (locale) {
    case 'en':
      return 'English';
    case 'am':
      return 'አማርኛ';
    default:
      return locale;
  }
}