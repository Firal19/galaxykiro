import { z } from 'zod'

// Progressive capture validation schemas
export const Level1Schema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
})

export const Level2Schema = Level1Schema.extend({
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'),
})

export const Level3Schema = Level2Schema.extend({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),
  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters'),
})

// Assessment response validation
export const AssessmentResponseSchema = z.object({
  questionId: z.string(),
  response: z.union([
    z.string(),
    z.number(),
    z.array(z.string()),
    z.boolean(),
  ]),
  timeSpent: z.number().min(0),
})

export const AssessmentSubmissionSchema = z.object({
  toolName: z.string(),
  responses: z.array(AssessmentResponseSchema),
  completionRate: z.number().min(0).max(1),
})

// User preferences validation
export const UserPreferencesSchema = z.object({
  language: z.enum(['en', 'am']),
  timezone: z.string(),
  communicationPreferences: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean(),
  }),
})

// Database model validation schemas
export const UserCreateSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().optional(),
  full_name: z.string().optional(),
  city: z.string().optional(),
  capture_level: z.number().int().min(1).max(3).default(1),
  entry_point: z.string().optional(),
  language: z.enum(['en', 'am']).default('en'),
  timezone: z.string().default('UTC'),
  communication_preferences: z.record(z.string(), z.unknown()).default({}),
})

export const UserUpdateSchema = UserCreateSchema.partial()

export const InteractionCreateSchema = z.object({
  user_id: z.string().uuid().optional(),
  session_id: z.string(),
  event_type: z.string(),
  event_data: z.record(z.string(), z.unknown()).default({}),
  page_url: z.string().optional(),
  referrer: z.string().optional(),
  user_agent: z.string().optional(),
  ip_address: z.string().optional(),
})

export const ToolUsageCreateSchema = z.object({
  user_id: z.string().uuid(),
  tool_id: z.string(),
  tool_name: z.string(),
  responses: z.array(z.record(z.string(), z.unknown())).default([]),
  scores: z.record(z.string(), z.unknown()).default({}),
  insights: z.array(z.record(z.string(), z.unknown())).default([]),
  completion_rate: z.number().min(0).max(1).default(0),
  time_spent: z.number().int().min(0).default(0),
})

export const ToolUsageUpdateSchema = ToolUsageCreateSchema.partial().omit({ user_id: true, tool_id: true, tool_name: true })

export const ContentEngagementCreateSchema = z.object({
  user_id: z.string().uuid().optional(),
  content_id: z.string(),
  content_type: z.string(),
  content_category: z.string().optional(),
  time_spent: z.number().int().min(0).default(0),
  scroll_depth: z.number().min(0).max(1).default(0),
  interactions_count: z.number().int().min(0).default(0),
  engagement_data: z.record(z.string(), z.unknown()).default({}),
  session_id: z.string().optional(),
  page_url: z.string().optional(),
  referrer: z.string().optional(),
})

export const ContentEngagementUpdateSchema = ContentEngagementCreateSchema.partial().omit({ 
  user_id: true, 
  content_id: true, 
  content_type: true 
})

export const LeadScoreCreateSchema = z.object({
  user_id: z.string().uuid(),
  page_views_score: z.number().int().min(0).default(0),
  tool_usage_score: z.number().int().min(0).default(0),
  content_downloads_score: z.number().int().min(0).default(0),
  webinar_registration_score: z.number().int().min(0).default(0),
  time_on_site_score: z.number().int().min(0).default(0),
  scroll_depth_score: z.number().int().min(0).default(0),
  cta_engagement_score: z.number().int().min(0).default(0),
  total_score: z.number().int().min(0).default(0),
  previous_score: z.number().int().min(0).default(0),
  tier: z.enum(['browser', 'engaged', 'soft-member']).default('browser'),
  previous_tier: z.enum(['browser', 'engaged', 'soft-member']).default('browser'),
  scoring_data: z.record(z.string(), z.unknown()).default({}),
  tier_progression: z.array(z.record(z.string(), z.unknown())).default([]),
})

// Webinar registration validation
export const WebinarRegistrationSchema = z.object({
  webinarId: z.string(),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  fullName: z.string().min(2),
  phone: z.string().optional(),
  interests: z.array(z.string()).optional(),
})

// Office visit booking validation
export const OfficeVisitSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10),
  preferredDate: z.string(),
  preferredTime: z.string(),
  officeLocation: z.string(),
  message: z.string().optional(),
})

// Content engagement validation
export const ContentEngagementSchema = z.object({
  contentId: z.string(),
  timeSpent: z.number().min(0),
  scrollDepth: z.number().min(0).max(100),
  interactions: z.array(z.string()).optional(),
})

// User journey event validation
export const UserJourneyEventSchema = z.object({
  eventType: z.enum([
    'page_view',
    'section_view',
    'tool_usage',
    'content_consumption',
    'cta_click',
    'form_submission',
    'assessment_completion',
  ]),
  eventData: z.record(z.string(), z.unknown()),
  timestamp: z.string().datetime({ message: 'Please provide a valid datetime' }),
})

// Type exports for TypeScript
export type Level1Data = z.infer<typeof Level1Schema>
export type Level2Data = z.infer<typeof Level2Schema>
export type Level3Data = z.infer<typeof Level3Schema>
export type AssessmentResponse = z.infer<typeof AssessmentResponseSchema>
export type AssessmentSubmission = z.infer<typeof AssessmentSubmissionSchema>
export type UserPreferences = z.infer<typeof UserPreferencesSchema>
export type WebinarRegistration = z.infer<typeof WebinarRegistrationSchema>
export type OfficeVisit = z.infer<typeof OfficeVisitSchema>
export type ContentEngagement = z.infer<typeof ContentEngagementSchema>
export type UserJourneyEvent = z.infer<typeof UserJourneyEventSchema>

// Database model type exports
export type UserCreateData = z.infer<typeof UserCreateSchema>
export type UserUpdateData = z.infer<typeof UserUpdateSchema>
export type InteractionCreateData = z.infer<typeof InteractionCreateSchema>
export type ToolUsageCreateData = z.infer<typeof ToolUsageCreateSchema>
export type ToolUsageUpdateData = z.infer<typeof ToolUsageUpdateSchema>
export type ContentEngagementCreateData = z.infer<typeof ContentEngagementCreateSchema>
export type ContentEngagementUpdateData = z.infer<typeof ContentEngagementUpdateSchema>
export type LeadScoreCreateData = z.infer<typeof LeadScoreCreateSchema>

// Validation helper functions
export const validateProgressiveCapture = (level: 1 | 2 | 3, data: unknown) => {
  switch (level) {
    case 1:
      return Level1Schema.safeParse(data)
    case 2:
      return Level2Schema.safeParse(data)
    case 3:
      return Level3Schema.safeParse(data)
    default:
      throw new Error('Invalid capture level')
  }
}

// Form field validation helpers
export const emailValidation = {
  required: 'Email is required',
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Please enter a valid email address'
  }
}

export const phoneValidation = {
  required: 'Phone number is required',
  pattern: {
    value: /^[\+]?[1-9][\d]{0,15}$/,
    message: 'Please enter a valid phone number'
  },
  minLength: {
    value: 10,
    message: 'Phone number must be at least 10 digits'
  }
}

export const nameValidation = {
  required: 'Full name is required',
  minLength: {
    value: 2,
    message: 'Name must be at least 2 characters'
  },
  maxLength: {
    value: 100,
    message: 'Name must be less than 100 characters'
  }
}

export const cityValidation = {
  required: 'City is required',
  minLength: {
    value: 2,
    message: 'City must be at least 2 characters'
  },
  maxLength: {
    value: 50,
    message: 'City must be less than 50 characters'
  }
}