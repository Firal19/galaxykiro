// Unused import removed

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('AssessmentEngine', () => {
  // Sample assessment configuration for testing
  const sampleConfig: AssessmentConfig = {
    id: 'test-assessment',
    title: 'Test Assessment',
    description: 'A test assessment for unit testing',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        text: 'What is your favorite color?',
        required: true,
        options: [
          { id: 'o1', text: 'Red', value: 'red', score: 1 },
          { id: 'o2', text: 'Blue', value: 'blue', score: 2 },
          { id: 'o3', text: 'Green', value: 'green', score: 3 }
        ]
      },
      {
        id: 'q2',
        type: 'scale',
        text: 'How satisfied are you?',
        required: true,
        min: 1,
        max: 5
      },
      {
        id: 'q3',
        type: 'text',
        text: 'Any additional comments?',
        required: false
      }
    ],
    scoringConfig: {
      type: 'simple'
    },
    progressSaving: true
  };

  let engine: AssessmentEngine;

  beforeEach(() => {
    jest.clearAllMocks();
    engine = new AssessmentEngine(sampleConfig);
  });

  describe('initialization', () => {
    it('should initialize with the provided config', () => {
      expect(engine['config']).toEqual(sampleConfig);
    });

    it('should initialize assessment for a user', async () => {
      const state = await engine.initializeAssessment('user123');
      expect(state.assessmentId).toBe('test-assessment');
      expect(state.userId).toBe('user123');
      expect(state.currentQuestionIndex).toBe(0);
      expect(state.responses).toEqual([]);
      expect(state.isCompleted).toBe(false);
    });
  });

  describe('question navigation', () => {
    beforeEach(async () => {
      await engine.initializeAssessment('user123');
    });

    it('should get the current question', () => {
      const question = engine.getCurrentQuestion();
      expect(question).toEqual(sampleConfig.questions[0]);
    });

    it('should navigate to the next question', () => {
      const nextQuestion = engine.nextQuestion();
      expect(nextQuestion).toEqual(sampleConfig.questions[1]);
      expect(engine['state']?.currentQuestionIndex).toBe(1);
    });

    it('should return null when trying to navigate past the last question', () => {
      engine.nextQuestion(); // Move to question 2
      engine.nextQuestion(); // Move to question 3
      const nextQuestion = engine.nextQuestion(); // Try to move past the last question
      expect(nextQuestion).toBeNull();
    });

    it('should navigate to the previous question when allowed', () => {
      engine['config'].allowBackNavigation = true;
      engine.nextQuestion(); // Move to question 2
      const prevQuestion = engine.previousQuestion();
      expect(prevQuestion).toEqual(sampleConfig.questions[0]);
      expect(engine['state']?.currentQuestionIndex).toBe(0);
    });

    it('should not navigate to the previous question when not allowed', () => {
      engine['config'].allowBackNavigation = false;
      engine.nextQuestion(); // Move to question 2
      const prevQuestion = engine.previousQuestion();
      expect(prevQuestion).toBeNull();
      expect(engine['state']?.currentQuestionIndex).toBe(1);
    });
  });

  describe('response submission', () => {
    beforeEach(async () => {
      await engine.initializeAssessment('user123');
    });

    it('should submit a response', async () => {
      const response = {
        questionId: 'q1',
        answer: 'blue',
        timeSpent: 10
      };

      await engine.submitResponse(response);
      expect(engine['state']?.responses).toHaveLength(1);
      expect(engine['state']?.responses[0].questionId).toBe('q1');
      expect(engine['state']?.responses[0].answer).toBe('blue');
      expect(engine['state']?.timeSpent).toBe(10);
    });

    it('should update an existing response', async () => {
      await engine.submitResponse({
        questionId: 'q1',
        answer: 'blue',
        timeSpent: 10
      });

      await engine.submitResponse({
        questionId: 'q1',
        answer: 'red',
        timeSpent: 5
      });

      expect(engine['state']?.responses).toHaveLength(1);
      expect(engine['state']?.responses[0].answer).toBe('red');
      expect(engine['state']?.timeSpent).toBe(15);
    });

    it('should throw an error if assessment is not initialized', async () => {
      const newEngine = new AssessmentEngine(sampleConfig);
      await expect(newEngine.submitResponse({
        questionId: 'q1',
        answer: 'blue',
        timeSpent: 10
      })).rejects.toThrow('Assessment not initialized');
    });
  });

  describe('progress tracking', () => {
    beforeEach(async () => {
      await engine.initializeAssessment('user123');
    });

    it('should calculate completion rate correctly', () => {
      expect(engine.calculateCompletionRate()).toBe(0);

      engine['state']!.responses = [
        { questionId: 'q1', answer: 'blue', timeSpent: 10, timestamp: new Date() }
      ];
      expect(engine.calculateCompletionRate()).toBe(1/3);

      engine['state']!.responses = [
        { questionId: 'q1', answer: 'blue', timeSpent: 10, timestamp: new Date() },
        { questionId: 'q2', answer: 3, timeSpent: 5, timestamp: new Date() }
      ];
      expect(engine.calculateCompletionRate()).toBe(2/3);
    });

    it('should check if assessment is complete', () => {
      expect(engine.isComplete()).toBe(false);

      engine['state']!.responses = [
        { questionId: 'q1', answer: 'blue', timeSpent: 10, timestamp: new Date() },
        { questionId: 'q2', answer: 3, timeSpent: 5, timestamp: new Date() },
        { questionId: 'q3', answer: 'No comments', timeSpent: 15, timestamp: new Date() }
      ];
      expect(engine.isComplete()).toBe(true);
    });

    it('should get progress summary', () => {
      const summary = engine.getProgressSummary();
      expect(summary).toEqual({
        currentQuestion: 1,
        totalQuestions: 3,
        completionRate: 0,
        timeSpent: 0,
        canGoBack: false,
        canGoForward: true
      });
    });
  });

  describe('scoring algorithms', () => {
    beforeEach(async () => {
      await engine.initializeAssessment('user123');
    });

    it('should calculate simple scores correctly', async () => {
      await engine.submitResponse({
        questionId: 'q1',
        answer: 'blue',
        timeSpent: 10
      });

      await engine.submitResponse({
        questionId: 'q2',
        answer: 4,
        timeSpent: 5
      });

      const scores = engine.calculateScores();
      expect(scores.total).toBe(6); // 2 (blue) + 4 (scale)
      expect(scores.percentage).toBe(75); // 6 out of 8 possible points (3 + 5)
      expect(scores.breakdown).toEqual({
        q1: 2,
        q2: 4
      });
    });

    it('should handle weighted scoring', async () => {
      // Create a new engine with weighted scoring
      const weightedConfig = {
        ...sampleConfig,
        questions: [
          {
            ...sampleConfig.questions[0],
            weight: 2
          },
          {
            ...sampleConfig.questions[1],
            weight: 1
          }
        ],
        scoringConfig: {
          type: 'weighted'
        }
      };

      const weightedEngine = new AssessmentEngine(weightedConfig);
      await weightedEngine.initializeAssessment('user123');

      await weightedEngine.submitResponse({
        questionId: 'q1',
        answer: 'blue',
        timeSpent: 10
      });

      await weightedEngine.submitResponse({
        questionId: 'q2',
        answer: 4,
        timeSpent: 5
      });

      const scores = weightedEngine.calculateScores();
      expect(scores.total).toBe(8); // (2 * 2) + (4 * 1)
      expect(scores.percentage).toBe(73); // 8 out of 11 possible points ((3 * 2) + (5 * 1))
    });

    it('should handle category-based scoring', async () => {
      // Create a new engine with category-based scoring
      const categoryConfig = {
        ...sampleConfig,
        questions: [
          {
            ...sampleConfig.questions[0],
            category: 'preferences'
          },
          {
            ...sampleConfig.questions[1],
            category: 'satisfaction'
          }
        ],
        scoringConfig: {
          type: 'category-based',
          categories: [
            {
              id: 'preferences',
              name: 'Preferences',
              weight: 1,
              questions: ['q1']
            },
            {
              id: 'satisfaction',
              name: 'Satisfaction',
              weight: 2,
              questions: ['q2']
            }
          ]
        }
      };

      const categoryEngine = new AssessmentEngine(categoryConfig);
      await categoryEngine.initializeAssessment('user123');

      await categoryEngine.submitResponse({
        questionId: 'q1',
        answer: 'blue',
        timeSpent: 10
      });

      await categoryEngine.submitResponse({
        questionId: 'q2',
        answer: 4,
        timeSpent: 5
      });

      const scores = categoryEngine.calculateScores();
      expect(scores.categoryScores?.preferences.score).toBe(2);
      expect(scores.categoryScores?.satisfaction.score).toBe(4);
      expect(scores.total).toBe(10); // (2 * 1) + (4 * 2)
    });
  });

  describe('result generation', () => {
    beforeEach(async () => {
      await engine.initializeAssessment('user123');
      
      // Add result tiers to the config
      engine['config'].scoringConfig.resultTiers = [
        {
          min: 0,
          max: 40,
          label: 'Beginner',
          description: 'You are just starting out',
          insights: ['You have room to grow'],
          recommendations: ['Start with the basics']
        },
        {
          min: 41,
          max: 70,
          label: 'Intermediate',
          description: 'You have some experience',
          insights: ['You have a good foundation'],
          recommendations: ['Focus on advanced techniques']
        },
        {
          min: 71,
          max: 100,
          label: 'Advanced',
          description: 'You are highly skilled',
          insights: ['You have mastered the fundamentals'],
          recommendations: ['Share your knowledge with others']
        }
      ];

      // Submit all responses
      await engine.submitResponse({
        questionId: 'q1',
        answer: 'blue',
        timeSpent: 10
      });

      await engine.submitResponse({
        questionId: 'q2',
        answer: 4,
        timeSpent: 5
      });

      await engine.submitResponse({
        questionId: 'q3',
        answer: 'No comments',
        timeSpent: 15
      });
    });

    it('should generate insights based on scores', () => {
      const scores = engine.calculateScores();
      const insights = engine.generateInsights(scores);
      
      expect(insights.length).toBeGreaterThan(0);
      expect(insights[0].title).toBe('You\'re a Advanced');
      expect(insights[0].message).toBe('You are highly skilled');
    });

    it('should generate visualization data', () => {
      const scores = engine.calculateScores();
      const visualization = engine.generateVisualizationData(scores);
      
      expect(visualization.chartType).toBe('gauge');
      expect(visualization.data.datasets[0].data[0]).toBe(scores.percentage);
    });

    it('should complete the assessment and generate a result', async () => {
      const result = await engine.completeAssessment();
      
      expect(result.assessmentId).toBe('test-assessment');
      expect(result.userId).toBe('user123');
      expect(result.responses).toHaveLength(3);
      expect(result.scores.percentage).toBe(75);
      expect(result.insights.length).toBeGreaterThan(0);
      expect(result.visualizationData).toBeDefined();
      expect(result.isCompleted).toBe(undefined);
      expect(engine['state']?.isCompleted).toBe(true);
    });

    it('should throw an error if trying to complete an incomplete assessment', async () => {
      const newEngine = new AssessmentEngine(sampleConfig);
      await newEngine.initializeAssessment('user123');
      
      await expect(newEngine.completeAssessment()).rejects.toThrow('Assessment not complete');
    });
  });

  describe('progress saving', () => {
    beforeEach(async () => {
      await engine.initializeAssessment('user123');
    });

    it('should save progress to localStorage', async () => {
      await engine.saveProgress();
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'assessment_test-assessment_user123',
        expect.any(String)
      );
    });

    it('should load progress from localStorage', async () => {
      const savedState = {
        assessmentId: 'test-assessment',
        userId: 'user123',
        currentQuestionIndex: 1,
        responses: [
          { questionId: 'q1', answer: 'blue', timeSpent: 10, timestamp: new Date().toISOString() }
        ],
        startedAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
        completionRate: 0.33,
        timeSpent: 10,
        isCompleted: false
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedState));
      
      const loadedState = await engine.loadAssessmentState('user123');
      
      expect(loadedState).toBeDefined();
      expect(loadedState?.currentQuestionIndex).toBe(1);
      expect(loadedState?.responses).toHaveLength(1);
    });

    it('should clear progress', async () => {
      await engine.clearProgress();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        'assessment_test-assessment_user123'
      );
    });
  });
});