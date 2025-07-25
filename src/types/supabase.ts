/**
 * Generated Supabase Database Types
 * This file contains all database table types for type-safe database operations
 */

// Assessment response types
export interface AssessmentResponse {
  questionId: string
  answer: string | number | string[]
  timeSpent: number
}

export interface AssessmentScores {
  total: number
  breakdown: Record<string, number>
}

export interface PersonalizedInsight {
  category: string
  message: string
  recommendation: string
}

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          phone?: string
          full_name?: string
          city?: string
          capture_level: number
          capture_timestamps: Record<string, string | null>
          engagement_score: number
          readiness_indicator: number
          last_activity: string
          entry_point?: string
          current_tier: 'browser' | 'engaged' | 'soft-member'
          language: 'en' | 'am'
          timezone: string
          communication_preferences: Record<string, unknown>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          phone?: string
          full_name?: string
          city?: string
          capture_level?: number
          capture_timestamps?: Record<string, string | null>
          engagement_score?: number
          readiness_indicator?: number
          last_activity?: string
          entry_point?: string
          current_tier?: 'browser' | 'engaged' | 'soft-member'
          language?: 'en' | 'am'
          timezone?: string
          communication_preferences?: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          phone?: string
          full_name?: string
          city?: string
          capture_level?: number
          capture_timestamps?: Record<string, string | null>
          engagement_score?: number
          readiness_indicator?: number
          last_activity?: string
          entry_point?: string
          current_tier?: 'browser' | 'engaged' | 'soft-member'
          language?: 'en' | 'am'
          timezone?: string
          communication_preferences?: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
      }
      interactions: {
        Row: {
          id: string
          user_id?: string
          session_id: string
          event_type: string
          event_data: Record<string, unknown>
          page_url?: string
          referrer?: string
          user_agent?: string
          ip_address?: string
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          session_id: string
          event_type: string
          event_data?: Record<string, unknown>
          page_url?: string
          referrer?: string
          user_agent?: string
          ip_address?: string
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string
          event_type?: string
          event_data?: Record<string, unknown>
          page_url?: string
          referrer?: string
          user_agent?: string
          ip_address?: string
          timestamp?: string
          created_at?: string
        }
      }
      tool_usage: {
        Row: {
          id: string
          user_id: string
          tool_id: string
          tool_name: string
          responses: AssessmentResponse[]
          scores: AssessmentScores
          insights: PersonalizedInsight[]
          completion_rate: number
          time_spent: number
          is_completed: boolean
          is_shared: boolean
          share_token?: string
          started_at: string
          completed_at?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tool_id: string
          tool_name: string
          responses?: AssessmentResponse[]
          scores?: AssessmentScores
          insights?: PersonalizedInsight[]
          completion_rate?: number
          time_spent?: number
          is_completed?: boolean
          is_shared?: boolean
          share_token?: string
          started_at?: string
          completed_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tool_id?: string
          tool_name?: string
          responses?: AssessmentResponse[]
          scores?: AssessmentScores
          insights?: PersonalizedInsight[]
          completion_rate?: number
          time_spent?: number
          is_completed?: boolean
          is_shared?: boolean
          share_token?: string
          started_at?: string
          completed_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      content_engagement: {
        Row: {
          id: string
          user_id?: string
          content_id: string
          content_type: string
          content_category?: string
          time_spent: number
          scroll_depth: number
          interactions_count: number
          engagement_data: Record<string, unknown>
          session_id?: string
          page_url?: string
          referrer?: string
          started_at: string
          last_interaction_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          content_id: string
          content_type: string
          content_category?: string
          time_spent?: number
          scroll_depth?: number
          interactions_count?: number
          engagement_data?: Record<string, unknown>
          session_id?: string
          page_url?: string
          referrer?: string
          started_at?: string
          last_interaction_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content_id?: string
          content_type?: string
          content_category?: string
          time_spent?: number
          scroll_depth?: number
          interactions_count?: number
          engagement_data?: Record<string, unknown>
          session_id?: string
          page_url?: string
          referrer?: string
          started_at?: string
          last_interaction_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      lead_scores: {
        Row: {
          id: string
          user_id: string
          page_views_score: number
          tool_usage_score: number
          content_downloads_score: number
          webinar_registration_score: number
          time_on_site_score: number
          scroll_depth_score: number
          cta_engagement_score: number
          total_score: number
          previous_score: number
          tier: 'browser' | 'engaged' | 'soft-member'
          previous_tier: 'browser' | 'engaged' | 'soft-member'
          scoring_data: Record<string, unknown>
          tier_progression: Array<Record<string, unknown>>
          calculated_at: string
          tier_changed_at?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          page_views_score?: number
          tool_usage_score?: number
          content_downloads_score?: number
          webinar_registration_score?: number
          time_on_site_score?: number
          scroll_depth_score?: number
          cta_engagement_score?: number
          total_score?: number
          previous_score?: number
          tier?: 'browser' | 'engaged' | 'soft-member'
          previous_tier?: 'browser' | 'engaged' | 'soft-member'
          scoring_data?: Record<string, unknown>
          tier_progression?: Array<Record<string, unknown>>
          calculated_at?: string
          tier_changed_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          page_views_score?: number
          tool_usage_score?: number
          content_downloads_score?: number
          webinar_registration_score?: number
          time_on_site_score?: number
          scroll_depth_score?: number
          cta_engagement_score?: number
          total_score?: number
          previous_score?: number
          tier?: 'browser' | 'engaged' | 'soft-member'
          previous_tier?: 'browser' | 'engaged' | 'soft-member'
          scoring_data?: Record<string, unknown>
          tier_progression?: Array<Record<string, unknown>>
          calculated_at?: string
          tier_changed_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      webinars: {
        Row: {
          id: string
          title: string
          description?: string
          presenter_name?: string
          presenter_bio?: string
          scheduled_at: string
          duration_minutes: number
          max_attendees?: number
          registration_deadline?: string
          webinar_url?: string
          recording_url?: string
          status: string
          tags?: string[]
          thumbnail_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          presenter_name?: string
          presenter_bio?: string
          scheduled_at: string
          duration_minutes?: number
          max_attendees?: number
          registration_deadline?: string
          webinar_url?: string
          recording_url?: string
          status?: string
          tags?: string[]
          thumbnail_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          presenter_name?: string
          presenter_bio?: string
          scheduled_at?: string
          duration_minutes?: number
          max_attendees?: number
          registration_deadline?: string
          webinar_url?: string
          recording_url?: string
          status?: string
          tags?: string[]
          thumbnail_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      webinar_registrations: {
        Row: {
          id: string
          webinar_id: string
          user_id: string
          registration_source?: string
          registration_data: Record<string, unknown>
          attended: boolean
          attendance_duration_minutes: number
          engagement_score: number
          feedback_rating?: number
          feedback_comment?: string
          no_show_follow_up_sent: boolean
          recording_accessed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          webinar_id: string
          user_id: string
          registration_source?: string
          registration_data?: Record<string, unknown>
          attended?: boolean
          attendance_duration_minutes?: number
          engagement_score?: number
          feedback_rating?: number
          feedback_comment?: string
          no_show_follow_up_sent?: boolean
          recording_accessed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          webinar_id?: string
          user_id?: string
          registration_source?: string
          registration_data?: Record<string, unknown>
          attended?: boolean
          attendance_duration_minutes?: number
          engagement_score?: number
          feedback_rating?: number
          feedback_comment?: string
          no_show_follow_up_sent?: boolean
          recording_accessed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      webinar_email_sequences: {
        Row: {
          id: string
          registration_id: string
          sequence_type: string
          email_subject?: string
          email_content?: string
          scheduled_at?: string
          sent_at?: string
          opened_at?: string
          clicked_at?: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          registration_id: string
          sequence_type: string
          email_subject?: string
          email_content?: string
          scheduled_at?: string
          sent_at?: string
          opened_at?: string
          clicked_at?: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          registration_id?: string
          sequence_type?: string
          email_subject?: string
          email_content?: string
          scheduled_at?: string
          sent_at?: string
          opened_at?: string
          clicked_at?: string
          status?: string
          created_at?: string
        }
      }
    }
    Functions: {
      calculate_lead_score: {
        Args: { p_user_id: string }
        Returns: number
      }
      get_tier_from_score: {
        Args: { p_score: number }
        Returns: string
      }
      update_lead_score: {
        Args: { p_user_id: string }
        Returns: void
      }
    }
  }
}