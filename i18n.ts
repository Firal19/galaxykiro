import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import enMessages from './messages/en.json';
import amMessages from './messages/am.json';

// Can be imported from a shared config
export const locales = ['en', 'am'] as const;
export type Locale = (typeof locales)[number];

const messagesMap = { en: enMessages, am: amMessages };

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) notFound();

  return {
    locale: locale as Locale,
    messages: messagesMap[locale as Locale] || {}
  };
});