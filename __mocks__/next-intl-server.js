module.exports = {
  getRequestConfig: () => ({
    locale: 'en',
    messages: {
      hero: {
        title: 'What if you\'re only using 10% of your true potential?',
        description: 'Most people never discover their hidden strengths. Our assessment reveals what\'s possible when you unlock your full potential.',
        cta: 'Discover Your Hidden 90%',
      }
    }
  }),
  getTranslations: () => (key) => {
    const translations = {
      'title': 'What if you\'re only using 10% of your true potential?',
      'description': 'Most people never discover their hidden strengths. Our assessment reveals what\'s possible when you unlock your full potential.',
      'cta': 'Discover Your Hidden 90%',
    };
    return translations[key] || key;
  },
  getLocale: () => 'en',
  getMessages: () => ({}),
  setRequestLocale: jest.fn(),
};