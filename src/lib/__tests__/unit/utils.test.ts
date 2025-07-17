import {
  formatDate,
  formatNumber,
  truncate,
  generateId,
  debounce,
  getInitials,
  calculateReadTime,
  isValidEmail,
  isValidPhone,
  getRandomItem,
  shuffleArray,
  groupBy,
  toTitleCase,
  toKebabCase,
  toCamelCase
} from '../../utils';

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('should format a date object correctly', () => {
      const date = new Date(2025, 0, 15); // January 15, 2025
      expect(formatDate(date)).toBe('January 15, 2025');
    });

    it('should format a date string correctly', () => {
      const result = formatDate('2025-01-15');
      expect(result).toMatch(/January (14|15), 2025/); // Account for timezone differences
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
      expect(formatNumber(1234567890)).toBe('1,234,567,890');
    });

    it('should handle small numbers correctly', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(999)).toBe('999');
    });
  });

  describe('truncate', () => {
    it('should truncate strings longer than the specified length', () => {
      expect(truncate('This is a long string', 10)).toBe('This is a ...');
    });

    it('should not truncate strings shorter than the specified length', () => {
      expect(truncate('Short', 10)).toBe('Short');
    });

    it('should handle strings equal to the specified length', () => {
      expect(truncate('Exactly 10', 10)).toBe('Exactly 10');
    });
  });

  describe('generateId', () => {
    it('should generate a string', () => {
      expect(typeof generateId()).toBe('string');
    });

    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('should debounce a function call', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should cancel previous timer when called again', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      jest.advanceTimersByTime(50);
      debouncedFn();
      jest.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('getInitials', () => {
    it('should get initials from a name', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Alice Bob Charlie')).toBe('AB');
    });

    it('should handle single names', () => {
      expect(getInitials('John')).toBe('J');
    });

    it('should return uppercase initials', () => {
      expect(getInitials('john doe')).toBe('JD');
    });
  });

  describe('calculateReadTime', () => {
    it('should calculate read time based on word count', () => {
      const shortText = 'This is a short text with 10 words in it.';
      expect(calculateReadTime(shortText)).toBe(1);

      const mediumText = 'a '.repeat(200);
      expect(calculateReadTime(mediumText)).toBe(1);

      const longText = 'a '.repeat(400);
      expect(calculateReadTime(longText)).toBe(2);
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('test')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('test@domain')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate correct phone numbers', () => {
      expect(isValidPhone('1234567890')).toBe(true);
      expect(isValidPhone('+1234567890')).toBe(true);
      expect(isValidPhone('123 456 7890')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('abcdefghij')).toBe(false);
      expect(isValidPhone('123456789012345678901')).toBe(false);
    });
  });

  describe('getRandomItem', () => {
    it('should return an item from the array', () => {
      const array = [1, 2, 3, 4, 5];
      const result = getRandomItem(array);
      expect(array).toContain(result);
    });
  });

  describe('shuffleArray', () => {
    it('should return an array with the same items', () => {
      const array = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(array);
      expect(shuffled).toHaveLength(array.length);
      expect(shuffled.sort()).toEqual(array.sort());
    });

    it('should not modify the original array', () => {
      const array = [1, 2, 3, 4, 5];
      const original = [...array];
      shuffleArray(array);
      expect(array).toEqual(original);
    });
  });

  describe('groupBy', () => {
    it('should group array items by key', () => {
      const array = [
        { id: 1, category: 'A' },
        { id: 2, category: 'B' },
        { id: 3, category: 'A' },
        { id: 4, category: 'C' },
        { id: 5, category: 'B' }
      ];

      const grouped = groupBy(array, 'category');
      expect(Object.keys(grouped)).toEqual(['A', 'B', 'C']);
      expect(grouped['A']).toHaveLength(2);
      expect(grouped['B']).toHaveLength(2);
      expect(grouped['C']).toHaveLength(1);
    });
  });

  describe('toTitleCase', () => {
    it('should convert strings to title case', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
      expect(toTitleCase('HELLO WORLD')).toBe('Hello World');
      expect(toTitleCase('hello-world')).toBe('Hello-world');
    });
  });

  describe('toKebabCase', () => {
    it('should convert strings to kebab case', () => {
      expect(toKebabCase('Hello World')).toBe('hello-world');
      expect(toKebabCase('HelloWorld')).toBe('hello-world');
      expect(toKebabCase('hello world')).toBe('hello-world');
    });
  });

  describe('toCamelCase', () => {
    it('should convert strings to camel case', () => {
      expect(toCamelCase('Hello World')).toBe('helloWorld');
      expect(toCamelCase('hello-world')).toBe('helloWorld');
      expect(toCamelCase('hello world')).toBe('helloWorld');
    });
  });
});