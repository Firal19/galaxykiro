import { supabase, Database, AssessmentResponse, AssessmentScores, PersonalizedInsight } from '../../../lib/supabase'

export type ToolUsageRow = Database['public']['Tables']['tool_usage']['Row']
export type ToolUsageInsert = Database['public']['Tables']['tool_usage']['Insert']
export type ToolUsageUpdate = Database['public']['Tables']['tool_usage']['Update']

export class ToolUsageModel {
  private data: ToolUsageRow

  constructor(data: ToolUsageRow) {
    this.data = data
  }

  // Getters
  get id(): string {
    return this.data.id
  }

  get userId(): string {
    return this.data.user_id
  }

  get toolId(): string {
    return this.data.tool_id
  }

  get toolName(): string {
    return this.data.tool_name
  }

  get responses(): AssessmentResponse[] {
    return this.data.responses as AssessmentResponse[]
  }

  get scores(): AssessmentScores {
    return this.data.scores as AssessmentScores
  }

  get insights(): PersonalizedInsight[] {
    return this.data.insights as PersonalizedInsight[]
  }

  get completionRate(): number {
    return this.data.completion_rate
  }

  get timeSpent(): number {
    return this.data.time_spent
  }

  get isCompleted(): boolean {
    return this.data.is_completed
  }

  get isShared(): boolean {
    return this.data.is_shared
  }

  get shareToken(): string | undefined {
    return this.data.share_token
  }

  get startedAt(): Date {
    return new Date(this.data.started_at)
  }

  get completedAt(): Date | null {
    return this.data.completed_at ? new Date(this.data.completed_at) : null
  }

  get createdAt(): Date {
    return new Date(this.data.created_at)
  }

  get updatedAt(): Date {
    return new Date(this.data.updated_at)
  }

  // Methods for updating tool usage
  async updateProgress(
    responses: AssessmentResponse[],
    completionRate: number,
    timeSpent: number
  ): Promise<void> {
    const updateData: ToolUsageUpdate = {
      responses,
      completion_rate: completionRate,
      time_spent: timeSpent,
      updated_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from('tool_usage')
      .update(updateData)
      .eq('id', this.id)

    if (error) {
      throw new Error(`Failed to update tool progress: ${error.message}`)
    }

    // Update local data
    this.data = { ...this.data, ...updateData } as ToolUsageRow
  }

  async completeAssessment(
    scores: AssessmentScores,
    insights: PersonalizedInsight[]
  ): Promise<void> {
    const updateData: ToolUsageUpdate = {
      scores,
      insights,
      completion_rate: 1.0,
      is_completed: true,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from('tool_usage')
      .update(updateData)
      .eq('id', this.id)

    if (error) {
      throw new Error(`Failed to complete assessment: ${error.message}`)
    }

    // Update local data
    this.data = { ...this.data, ...updateData } as ToolUsageRow
  }

  async enableSharing(): Promise<string> {
    if (this.isShared && this.shareToken) {
      return this.shareToken
    }

    // Generate share token using Supabase function
    const { data: tokenData, error: tokenError } = await supabase
      .rpc('generate_share_token')

    if (tokenError) {
      throw new Error(`Failed to generate share token: ${tokenError.message}`)
    }

    const shareToken = tokenData as string

    const { error } = await supabase
      .from('tool_usage')
      .update({
        is_shared: true,
        share_token: shareToken,
        updated_at: new Date().toISOString()
      })
      .eq('id', this.id)

    if (error) {
      throw new Error(`Failed to enable sharing: ${error.message}`)
    }

    this.data.is_shared = true
    this.data.share_token = shareToken

    return shareToken
  }

  async disableSharing(): Promise<void> {
    const { error } = await supabase
      .from('tool_usage')
      .update({
        is_shared: false,
        share_token: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', this.id)

    if (error) {
      throw new Error(`Failed to disable sharing: ${error.message}`)
    }

    this.data.is_shared = false
    this.data.share_token = undefined
  }

  // Static methods for creating and finding tool usage
  static async create(toolUsageData: ToolUsageInsert): Promise<ToolUsageModel> {
    const { data, error } = await supabase
      .from('tool_usage')
      .insert({
        ...toolUsageData,
        started_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create tool usage: ${error.message}`)
    }

    return new ToolUsageModel(data)
  }

  static async findById(id: string): Promise<ToolUsageModel | null> {
    const { data, error } = await supabase
      .from('tool_usage')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Tool usage not found
      }
      throw new Error(`Failed to find tool usage: ${error.message}`)
    }

    return new ToolUsageModel(data)
  }

  static async findByUserId(userId: string): Promise<ToolUsageModel[]> {
    const { data, error } = await supabase
      .from('tool_usage')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to find tool usage by user ID: ${error.message}`)
    }

    return data.map(usage => new ToolUsageModel(usage))
  }

  static async findByToolId(toolId: string): Promise<ToolUsageModel[]> {
    const { data, error } = await supabase
      .from('tool_usage')
      .select('*')
      .eq('tool_id', toolId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to find tool usage by tool ID: ${error.message}`)
    }

    return data.map(usage => new ToolUsageModel(usage))
  }

  static async findByShareToken(shareToken: string): Promise<ToolUsageModel | null> {
    const { data, error } = await supabase
      .from('tool_usage')
      .select('*')
      .eq('share_token', shareToken)
      .eq('is_shared', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Shared result not found
      }
      throw new Error(`Failed to find shared tool usage: ${error.message}`)
    }

    return new ToolUsageModel(data)
  }

  static async findCompletedByUserId(userId: string): Promise<ToolUsageModel[]> {
    const { data, error } = await supabase
      .from('tool_usage')
      .select('*')
      .eq('user_id', userId)
      .eq('is_completed', true)
      .order('completed_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to find completed tool usage: ${error.message}`)
    }

    return data.map(usage => new ToolUsageModel(usage))
  }

  // Analytics methods
  static async getToolUsageStats(toolId: string): Promise<{
    totalUsages: number
    completedUsages: number
    averageCompletionRate: number
    averageTimeSpent: number
    completionRate: number
  }> {
    const { data, error } = await supabase
      .from('tool_usage')
      .select('completion_rate, time_spent, is_completed')
      .eq('tool_id', toolId)

    if (error) {
      throw new Error(`Failed to get tool usage stats: ${error.message}`)
    }

    const totalUsages = data.length
    const completedUsages = data.filter(usage => usage.is_completed).length
    const averageCompletionRate = data.reduce((sum, usage) => sum + usage.completion_rate, 0) / totalUsages
    const averageTimeSpent = data.reduce((sum, usage) => sum + usage.time_spent, 0) / totalUsages
    const completionRate = completedUsages / totalUsages

    return {
      totalUsages,
      completedUsages,
      averageCompletionRate,
      averageTimeSpent,
      completionRate
    }
  }

  static async getUserToolStats(userId: string): Promise<{
    totalTools: number
    completedTools: number
    inProgressTools: number
    totalTimeSpent: number
    averageCompletionRate: number
  }> {
    const userUsages = await this.findByUserId(userId)
    
    const totalTools = userUsages.length
    const completedTools = userUsages.filter(usage => usage.isCompleted).length
    const inProgressTools = userUsages.filter(usage => !usage.isCompleted && usage.completionRate > 0).length
    const totalTimeSpent = userUsages.reduce((sum, usage) => sum + usage.timeSpent, 0)
    const averageCompletionRate = userUsages.reduce((sum, usage) => sum + usage.completionRate, 0) / totalTools

    return {
      totalTools,
      completedTools,
      inProgressTools,
      totalTimeSpent,
      averageCompletionRate
    }
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      userId: this.userId,
      toolId: this.toolId,
      toolName: this.toolName,
      responses: this.responses,
      scores: this.scores,
      insights: this.insights,
      completionRate: this.completionRate,
      timeSpent: this.timeSpent,
      isCompleted: this.isCompleted,
      isShared: this.isShared,
      shareToken: this.shareToken,
      startedAt: this.startedAt.toISOString(),
      completedAt: this.completedAt?.toISOString() || null,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    }
  }
}