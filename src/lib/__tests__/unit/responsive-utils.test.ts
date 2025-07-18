import {
  getOptimalImageFormat,
  generateResponsiveSrcSet,
  getOptimalImageSize,
  supportsLazyLoading,
  getConnectionSpeed,
  shouldPreloadImages,
  getImageLoadingStrategy,
  getResponsiveSizes,
  getTouchTargetClass,
  isThumbFriendlyMode,
  getResponsiveLayoutClass,
  getThumbZoneSafety,
  supportsSwipeGestures
} from '../../responsive-utils';

// Mock window and navigator objects
const mockWindow = () => {
  // Only define if not already defined
  if (!(global as any).window) {
    Object.defineProperty(global, 'window', {
      value: {
        innerWidth: 1024,
        innerHeight: 768,
        devicePixelRatio: 2,
        HTMLImageElement: {
          prototype: {
            loading: true
          }
        },
        document: {
          createElement: jest.fn().mockImplementation(() => ({
            toDataURL: jest.fn().mockReturnValue('data:image/webp;base64,test')
          }))
        }
      },
      writable: true,
      configurable: true
    });
  } else {
    // Update existing window properties
    (global as any).window.innerWidth = 1024;
    (global as any).window.innerHeight = 768;
    (global as any).window.devicePixelRatio = 2;
  }

  if (!(global as any).navigator) {
    Object.defineProperty(global, 'navigator', {
      value: {
        connection: {
          effectiveType: '4g',
          downlink: 10
        },
        maxTouchPoints: 5
      },
      writable: true,
      configurable: true
    });
  }

  if (!(global as any).document) {
    Object.defineProperty(global, 'document', {
      value: {
        createElement: jest.fn().mockImplementation(() => ({
          toDataURL: jest.fn().mockReturnValue('data:image/webp;base64,test')
        }))
      },
      writable: true,
      configurable: true
    });
  }
};

// Reset mocks
const resetMocks = () => {
  // Don't delete, just reset to undefined to avoid redefinition errors
  if ((global as any).window) {
    (global as any).window = undefined;
  }
  if ((global as any).navigator) {
    (global as any).navigator = undefined;
  }
  if ((global as any).document) {
    (global as any).document = undefined;
  }
};

describe('Responsive Utilities', () => {
  beforeEach(() => {
    mockWindow();
  });

  afterEach(() => {
    resetMocks();
    jest.resetAllMocks();
  });

  describe('Image Format Detection', () => {
    test('getOptimalImageFormat should return webp when supported', () => {
      expect(getOptimalImageFormat()).toBe('webp');
    });

    test('generateResponsiveSrcSet should generate correct srcset', () => {
      const srcSet = generateResponsiveSrcSet('image.jpg');
      expect(srcSet).toContain('image.webp?w=640 640w');
      expect(srcSet).toContain('image.webp?w=1920 1920w');
    });

    test('getOptimalImageSize should calculate correct size based on container and pixel ratio', () => {
      expect(getOptimalImageSize(400)).toBe(828); // 400 * 2 = 800, next size up is 828
    });
  });

  describe('Loading Strategies', () => {
    test('supportsLazyLoading should detect browser support', () => {
      expect(supportsLazyLoading()).toBe(true);
    });

    test('getConnectionSpeed should detect fast connection', () => {
      expect(getConnectionSpeed()).toBe('fast');
    });

    test('shouldPreloadImages should return true for fast connections', () => {
      expect(shouldPreloadImages()).toBe(true);
    });

    test('getImageLoadingStrategy should prioritize above-fold images', () => {
      expect(getImageLoadingStrategy(true, false)).toBe('eager');
      expect(getImageLoadingStrategy(false, false)).toBe('lazy');
    });
  });

  describe('Responsive Layout', () => {
    test('getResponsiveSizes should generate correct sizes attribute', () => {
      const sizes = getResponsiveSizes();
      expect(sizes).toBe('(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw');
    });

    test('getTouchTargetClass should return appropriate size classes', () => {
      expect(getTouchTargetClass('small')).toBe('min-h-[44px] min-w-[44px]');
      expect(getTouchTargetClass('medium')).toBe('min-h-[48px] min-w-[48px]');
      expect(getTouchTargetClass('large')).toBe('min-h-[56px] min-w-[56px]');
    });
  });

  describe('Mobile-First Features', () => {
    test('isThumbFriendlyMode should detect portrait touch devices', () => {
      // Mock portrait orientation
      (global.window as any).innerHeight = 1024;
      (global.window as any).innerWidth = 768;
      expect(isThumbFriendlyMode()).toBe(true);
      
      // Mock landscape orientation
      (global.window as any).innerHeight = 768;
      (global.window as any).innerWidth = 1024;
      expect(isThumbFriendlyMode()).toBe(false);
    });

    test('getResponsiveLayoutClass should return appropriate layout classes', () => {
      // Test mobile width
      (global.window as any).innerWidth = 500;
      expect(getResponsiveLayoutClass()).toBe('flex flex-col');
      
      // Test tablet width
      (global.window as any).innerWidth = 800;
      expect(getResponsiveLayoutClass()).toBe('grid grid-cols-2 gap-4');
      
      // Test desktop width
      (global.window as any).innerWidth = 1200;
      expect(getResponsiveLayoutClass()).toBe('grid');
    });

    test('getThumbZoneSafety should return appropriate positioning classes', () => {
      expect(getThumbZoneSafety('bottom')).toBe('mb-4 mt-auto');
      expect(getThumbZoneSafety('top')).toBe('mt-2 mb-auto');
    });

    test('supportsSwipeGestures should detect touch capability', () => {
      expect(supportsSwipeGestures()).toBe(true);
      
      // Test no touch support
      (global.navigator as any).maxTouchPoints = 0;
      expect(supportsSwipeGestures()).toBe(false);
    });
  });
});