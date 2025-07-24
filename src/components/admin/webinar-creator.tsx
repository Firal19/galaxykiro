"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/lib/hooks/use-i18n'
import webinarSystem, { Webinar, EmailTemplate, WebinarAutomation } from '@/lib/webinar-system'
import {
  Calendar,
  Clock,
  Users,
  Settings,
  Mail,
  Zap,
  Save,
  X,
  Plus,
  Globe,
  Video,
  FileText,
  Target,
  MessageSquare,
  BarChart3,
  CheckCircle
} from 'lucide-react'

interface WebinarCreatorProps {
  onClose: () => void
  onSave: (webinar: Webinar) => void
  editingWebinar?: Webinar | null
}

interface WebinarFormData {
  title: string
  description: string
  hostName: string
  scheduledDate: string
  duration: number
  timezone: string
  registrationLimit?: number
  registrationDeadline?: string
  requireApproval: boolean
  allowQuestions: boolean
  enablePolls: boolean
  enableChat: boolean
  isRecorded: boolean
  agenda: string[]
  customFields: {
    name: string
    type: 'text' | 'email' | 'select' | 'checkbox'
    required: boolean
    options?: string[]
  }[]
}

export function WebinarCreator({ onClose, onSave, editingWebinar }: WebinarCreatorProps) {
  const { t } = useI18n()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<WebinarFormData>({
    title: editingWebinar?.title || '',
    description: editingWebinar?.description || '',
    hostName: editingWebinar?.hostName || '',
    scheduledDate: editingWebinar?.scheduledDate || '',
    duration: editingWebinar?.duration || 60,
    timezone: editingWebinar?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    registrationLimit: editingWebinar?.registrationLimit,
    registrationDeadline: editingWebinar?.registrationDeadline,
    requireApproval: editingWebinar?.requireApproval || false,
    allowQuestions: editingWebinar?.allowQuestions || true,
    enablePolls: editingWebinar?.enablePolls || true,
    enableChat: editingWebinar?.enableChat || true,
    isRecorded: editingWebinar?.isRecorded || true,
    agenda: editingWebinar?.agenda || [''],
    customFields: editingWebinar?.customFields || []
  })

  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([
    {
      id: 'confirmation',
      name: 'Registration Confirmation',
      subject: 'You\'re registered for {{webinarTitle}}!',
      content: `
        <h1>Welcome {{firstName}}!</h1>
        <p>Thank you for registering for: <strong>{{webinarTitle}}</strong></p>
        <p><strong>Date:</strong> {{webinarDate}} at {{webinarTime}}</p>
        <p><a href="{{joinUrl}}">Join the webinar</a></p>
      `,
      type: 'confirmation',
      timing: 0,
      isActive: true,
      variables: ['firstName', 'webinarTitle', 'webinarDate', 'webinarTime', 'joinUrl']
    },
    {
      id: 'reminder',
      name: '24 Hour Reminder',
      subject: 'Tomorrow: {{webinarTitle}}',
      content: `
        <h1>Don't forget, {{firstName}}!</h1>
        <p>Your webinar is tomorrow at {{webinarTime}}.</p>
        <p><a href="{{joinUrl}}">Join the webinar</a></p>
      `,
      type: 'reminder',
      timing: 24,
      isActive: true,
      variables: ['firstName', 'webinarTitle', 'webinarTime', 'joinUrl']
    }
  ])

  const [automations, setAutomations] = useState<Partial<WebinarAutomation>[]>([
    {
      type: 'lead_scoring',
      trigger: 'attendance',
      conditions: { attendancePercentage: 80, questionsAsked: 1 },
      actions: { updateLeadScore: 50, addTags: ['Hot Lead'], assignToSales: true },
      isActive: true
    }
  ])

  const totalSteps = 4

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = async () => {
    try {
      const webinarData = {
        ...formData,
        hostId: 'current-user-id', // Would get from auth context
        status: 'draft' as const,
        streamingUrl: '',
        presentationUrl: '',
        resources: [],
        emailTemplates,
        automations: automations as WebinarAutomation[],
        customFields: formData.customFields
      }

      let webinarId: string
      if (editingWebinar) {
        await webinarSystem.updateWebinar(editingWebinar.id, webinarData)
        webinarId = editingWebinar.id
      } else {
        webinarId = await webinarSystem.createWebinar(webinarData)
      }

      const savedWebinar = webinarSystem.getWebinar(webinarId)
      if (savedWebinar) {
        onSave(savedWebinar)
      }
      onClose()
    } catch (error) {
      console.error('Error saving webinar:', error)
    }
  }

  const addAgendaItem = () => {
    setFormData({
      ...formData,
      agenda: [...formData.agenda, '']
    })
  }

  const removeAgendaItem = (index: number) => {
    const newAgenda = formData.agenda.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      agenda: newAgenda.length > 0 ? newAgenda : ['']
    })
  }

  const updateAgendaItem = (index: number, value: string) => {
    const newAgenda = [...formData.agenda]
    newAgenda[index] = value
    setFormData({
      ...formData,
      agenda: newAgenda
    })
  }

  const addCustomField = () => {
    setFormData({
      ...formData,
      customFields: [
        ...formData.customFields,
        { name: '', type: 'text', required: false }
      ]
    })
  }

  const removeCustomField = (index: number) => {
    const newFields = formData.customFields.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      customFields: newFields
    })
  }

  const updateCustomField = (index: number, field: Partial<typeof formData.customFields[0]>) => {
    const newFields = [...formData.customFields]
    newFields[index] = { ...newFields[index], ...field }
    setFormData({
      ...formData,
      customFields: newFields
    })
  }

  const steps = [
    {
      number: 1,
      title: 'Basic Information',
      icon: FileText,
      description: 'Webinar title, description, and schedule'
    },
    {
      number: 2,
      title: 'Settings & Features',
      icon: Settings,
      description: 'Registration settings and interactive features'
    },
    {
      number: 3,
      title: 'Email Automation',
      icon: Mail,
      description: 'Automated email sequences and templates'
    },
    {
      number: 4,
      title: 'Review & Publish',
      icon: CheckCircle,
      description: 'Review all settings and publish webinar'
    }
  ]

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-background border border-border rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {editingWebinar ? 'Edit Webinar' : 'Create New Webinar'}
            </h2>
            <p className="text-muted-foreground">
              Step {currentStep} of {totalSteps}: {steps[currentStep - 1].title}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.number
              const isCompleted = currentStep > step.number
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors
                    ${isActive ? 'bg-primary text-primary-foreground' : 
                      isCompleted ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                      'bg-muted text-muted-foreground'}
                  `}>
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium hidden sm:inline">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-px bg-border mx-2" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Webinar Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                      placeholder="Enter webinar title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Host Name *
                    </label>
                    <input
                      type="text"
                      value={formData.hostName}
                      onChange={(e) => setFormData({ ...formData, hostName: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                      placeholder="Enter host name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Duration (minutes) *
                      </label>
                      <input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                        min="15"
                        max="300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Timezone
                      </label>
                      <select
                        value={formData.timezone}
                        onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                      >
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="UTC">UTC</option>
                        <option value="Europe/London">London</option>
                        <option value="Africa/Addis_Ababa">Addis Ababa</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Scheduled Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Registration Limit
                    </label>
                    <input
                      type="number"
                      value={formData.registrationLimit || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        registrationLimit: e.target.value ? parseInt(e.target.value) : undefined 
                      })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                      placeholder="No limit"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Registration Deadline
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.registrationDeadline || ''}
                      onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  placeholder="Describe what attendees will learn..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Agenda
                </label>
                <div className="space-y-2">
                  {formData.agenda.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateAgendaItem(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                        placeholder={`Agenda item ${index + 1}`}
                      />
                      {formData.agenda.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAgendaItem(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addAgendaItem}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Agenda Item
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-semibold text-foreground mb-4">Registration Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Require Approval</p>
                        <p className="text-sm text-muted-foreground">Manually approve registrations</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.requireApproval}
                        onChange={(e) => setFormData({ ...formData, requireApproval: e.target.checked })}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Record Session</p>
                        <p className="text-sm text-muted-foreground">Save recording for later access</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.isRecorded}
                        onChange={(e) => setFormData({ ...formData, isRecorded: e.target.checked })}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold text-foreground mb-4">Interactive Features</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Q&A Session</p>
                        <p className="text-sm text-muted-foreground">Allow attendees to ask questions</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.allowQuestions}
                        onChange={(e) => setFormData({ ...formData, allowQuestions: e.target.checked })}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Live Polls</p>
                        <p className="text-sm text-muted-foreground">Create interactive polls</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.enablePolls}
                        onChange={(e) => setFormData({ ...formData, enablePolls: e.target.checked })}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Live Chat</p>
                        <p className="text-sm text-muted-foreground">Enable chat between attendees</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.enableChat}
                        onChange={(e) => setFormData({ ...formData, enableChat: e.target.checked })}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                      />
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-4">
                <h3 className="font-semibold text-foreground mb-4">Custom Registration Fields</h3>
                <div className="space-y-4">
                  {formData.customFields.map((field, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 items-end">
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) => updateCustomField(index, { name: e.target.value })}
                          placeholder="Field name"
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                        />
                      </div>
                      <div className="col-span-3">
                        <select
                          value={field.type}
                          onChange={(e) => updateCustomField(index, { type: e.target.value as any })}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                        >
                          <option value="text">Text</option>
                          <option value="email">Email</option>
                          <option value="select">Select</option>
                          <option value="checkbox">Checkbox</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateCustomField(index, { required: e.target.checked })}
                            className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                          />
                          <span className="text-sm">Required</span>
                        </label>
                      </div>
                      <div className="col-span-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomField(index)}
                          className="w-full"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addCustomField}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom Field
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <Card className="p-4">
                <h3 className="font-semibold text-foreground mb-4">Email Templates</h3>
                <div className="space-y-4">
                  {emailTemplates.map((template, index) => (
                    <div key={template.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-foreground">{template.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {template.type === 'confirmation' && 'Sent immediately after registration'}
                            {template.type === 'reminder' && `Sent ${template.timing} hours before webinar`}
                            {template.type === 'follow_up' && `Sent ${template.timing} hours after webinar`}
                          </p>
                        </div>
                        <Badge className={template.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                          {template.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Subject</label>
                          <input
                            type="text"
                            value={template.subject}
                            onChange={(e) => {
                              const newTemplates = [...emailTemplates]
                              newTemplates[index].subject = e.target.value
                              setEmailTemplates(newTemplates)
                            }}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Content</label>
                          <textarea
                            value={template.content}
                            onChange={(e) => {
                              const newTemplates = [...emailTemplates]
                              newTemplates[index].content = e.target.value
                              setEmailTemplates(newTemplates)
                            }}
                            rows={3}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold text-foreground mb-4">Automation Rules</h3>
                <div className="space-y-4">
                  {automations.map((automation, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-foreground">
                          {automation.type === 'lead_scoring' && 'Lead Scoring Rule'}
                          {automation.type === 'email_sequence' && 'Email Sequence'}
                          {automation.type === 'tag_assignment' && 'Tag Assignment'}
                        </h4>
                        <Badge className={automation.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                          {automation.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <p><strong>Trigger:</strong> {automation.trigger}</p>
                        {automation.conditions && (
                          <p><strong>Conditions:</strong> {JSON.stringify(automation.conditions)}</p>
                        )}
                        {automation.actions && (
                          <p><strong>Actions:</strong> {JSON.stringify(automation.actions)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Review Your Webinar</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground">Basic Information</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong>Title:</strong> {formData.title}</p>
                        <p><strong>Host:</strong> {formData.hostName}</p>
                        <p><strong>Date:</strong> {new Date(formData.scheduledDate).toLocaleDateString()}</p>
                        <p><strong>Duration:</strong> {formData.duration} minutes</p>
                        <p><strong>Timezone:</strong> {formData.timezone}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground">Registration</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong>Limit:</strong> {formData.registrationLimit || 'No limit'}</p>
                        <p><strong>Deadline:</strong> {formData.registrationDeadline ? new Date(formData.registrationDeadline).toLocaleDateString() : 'No deadline'}</p>
                        <p><strong>Approval:</strong> {formData.requireApproval ? 'Required' : 'Automatic'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground">Features</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong>Q&A:</strong> {formData.allowQuestions ? 'Enabled' : 'Disabled'}</p>
                        <p><strong>Polls:</strong> {formData.enablePolls ? 'Enabled' : 'Disabled'}</p>
                        <p><strong>Chat:</strong> {formData.enableChat ? 'Enabled' : 'Disabled'}</p>
                        <p><strong>Recording:</strong> {formData.isRecorded ? 'Enabled' : 'Disabled'}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground">Automation</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong>Email Templates:</strong> {emailTemplates.filter(t => t.isActive).length} active</p>
                        <p><strong>Automation Rules:</strong> {automations.filter(a => a.isActive).length} active</p>
                      </div>
                    </div>
                  </div>
                </div>

                {formData.agenda.filter(item => item.trim()).length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-foreground mb-2">Agenda</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {formData.agenda.filter(item => item.trim()).map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          <div className="flex items-center space-x-3">
            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSave} className="bg-primary text-primary-foreground">
                <Save className="h-4 w-4 mr-2" />
                {editingWebinar ? 'Update Webinar' : 'Create Webinar'}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}