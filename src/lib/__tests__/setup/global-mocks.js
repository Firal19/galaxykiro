/**
 * Global Mock Setup for Test Suite
 * Centralizes only the most essential mocks that are needed across all tests
 * Individual test files can override these mocks if needed
 */

const React = require('react');

// Only mock Next.js router if not already mocked
if (!jest.isMockFunction(require('next/navigation').useRouter)) {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  };

  jest.mock('next/navigation', () => ({
    useRouter: () => mockRouter,
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
  }));
}

// Mock auth context
const mockAuthContext = {
  user: null,
  supabaseUser: null,
  isAuthenticated: false,
  isLoading: false,
  updateUserProfile: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  signUp: jest.fn(),
};

jest.mock('@/lib/contexts/auth-context', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }) => children,
}));

// Mock lead scoring
const mockLeadScoring = {
  addToolUsagePoints: jest.fn(),
  updateEngagementScore: jest.fn(),
  getEngagementLevel: jest.fn(() => 'browser'),
  calculateLeadScore: jest.fn(() => 0),
};

jest.mock('@/lib/hooks/use-lead-scoring', () => ({
  useLeadScoring: () => mockLeadScoring,
}));

// Mock app store
const mockAppStore = {
  user: null,
  captureUserInfo: jest.fn(),
  isLoading: false,
  updateUser: jest.fn(),
  clearUser: jest.fn(),
};

jest.mock('@/lib/store', () => ({
  useAppStore: () => mockAppStore,
}));

// Mock Supabase
const mockSupabase = {
  auth: {
    getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
    signUp: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null }),
    signInWithPassword: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
    onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  })),
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn().mockResolvedValue({ data: { path: 'test-path' }, error: null }),
      download: jest.fn().mockResolvedValue({ data: new Blob(), error: null }),
      getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://test-url.com' } }),
    })),
  },
};

jest.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
}));

// Mock AssessmentEngine
const mockAssessmentEngine = {
  initializeAssessment: jest.fn(),
  getCurrentQuestion: jest.fn(() => ({
    id: 'q1',
    text: 'Sample question?',
    type: 'scale',
    min: 1,
    max: 5,
    required: true,
    options: [
      { value: 1, label: 'Strongly Disagree' },
      { value: 5, label: 'Strongly Agree' }
    ],
  })),
  nextQuestion: jest.fn(),
  previousQuestion: jest.fn(),
  submitResponse: jest.fn(),
  completeAssessment: jest.fn(() => ({
    toolId: 'test-assessment',
    scores: { overall: 75 },
    insights: ['High potential for growth'],
    recommendations: ['Focus on daily habits'],
  })),
  calculateCompletionRate: jest.fn(() => 0.5),
  loadAssessmentState: jest.fn(),
  saveAssessmentState: jest.fn(),
};

jest.mock('@/lib/assessment-engine', () => ({
  AssessmentEngine: jest.fn().mockImplementation(() => mockAssessmentEngine),
}));

// Mock PWA hooks
jest.mock('@/lib/hooks/use-pwa', () => ({
  usePWA: () => ({
    isInstallable: false,
    installApp: jest.fn(),
    isOnline: true,
    isInstalled: false,
  }),
}));

// Mock React Hook Form
const mockFormMethods = {
  register: jest.fn(),
  handleSubmit: jest.fn((fn) => fn),
  formState: { errors: {}, isValid: true, isDirty: false },
  reset: jest.fn(),
  setValue: jest.fn(),
  getValues: jest.fn(() => ({})),
  watch: jest.fn(),
  control: {},
};

jest.mock('react-hook-form', () => ({
  useForm: () => mockFormMethods,
  Controller: ({ render }) => render({ field: { onChange: jest.fn(), value: '' } }),
}));

// Mock validation libraries
jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: jest.fn(),
}));

// Mock toast notifications
const mockToast = jest.fn();

jest.mock('@/components/ui/use-toast', () => ({
  toast: mockToast,
  useToast: () => ({
    toast: mockToast,
    dismiss: jest.fn(),
  }),
}));

// Mock localStorage and sessionStorage
const mockStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockStorage,
  writable: true,
});

Object.defineProperty(window, 'sessionStorage', {
  value: mockStorage,
  writable: true,
});

// Mock window.matchMedia for responsive design tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
};

// Mock crypto for UUID generation
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: jest.fn(() => 'test-uuid-1234'),
    getRandomValues: jest.fn(() => new Uint32Array(1)),
  },
});

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
);

// Mock performance API
Object.defineProperty(global, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByType: jest.fn(() => []),
    getEntriesByName: jest.fn(() => []),
  },
});

// Mock URL constructor
global.URL = class URL {
  constructor(href) {
    this.href = href;
  }
  toString() { return this.href; }
};

// Mock HTMLElement methods
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  value: jest.fn(),
  writable: true,
});

Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
  value: 100,
  writable: true,
});

Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
  value: 100,
  writable: true,
});

// Export all mocks for easy access
module.exports = {
  mockRouter,
  mockAuthContext,
  mockLeadScoring,
  mockAppStore,
  mockSupabase,
  mockAssessmentEngine,
  mockFormMethods,
  mockToast,
  mockStorage,
};