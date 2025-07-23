module.exports = {
  useTranslations: () => (key) => {
    const translations = {
      'title': 'What if you\'re only using 10% of your true potential?',
      'description': 'Most people never discover their hidden strengths. Our assessment reveals what\'s possible when you unlock your full potential.',
      'cta': 'Discover Your Hidden 90%',
      'stats.livesTransformed': 'Lives Transformed',
      'stats.successRate': 'Success Rate',
      'stats.yearsExperience': 'Years Experience'
    };
    return translations[key] || key;
  },
  useLocale: () => 'en',
  useMessages: () => ({}),
  NextIntlProvider: ({ children }) => children,
};