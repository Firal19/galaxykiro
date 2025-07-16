"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Calculator, Package, Video, MapPin, DollarSign, Clock, TrendingDown, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface DecisionDoorSectionProps {
  className?: string
}

export function DecisionDoorSection({ className }: DecisionDoorSectionProps) {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)

  return (
    <section className={cn("py-20 bg-gradient-to-br from-[var(--color-energy-50)] to-[var(--color-transformation-50)] dark:from-[var(--color-energy-900)] dark:to-[var(--color-transformation-900)]", className)}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          
          {/* Main Question */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight cursor-pointer hover:text-[var(--color-energy-600)] transition-colors"
              onClick={() => window.open('/decision-door', '_blank')}
            >
              You&apos;re standing at the Decision Door
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-[var(--color-energy-600)] font-medium">
                Every moment of inaction has a cost. Every day you wait, the gap between where you are and where you could be grows wider.
              </p>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                You&apos;ve discovered insights about your potential, habits, vision, and leadership. 
                Now comes the moment that separates dreamers from achievers.
              </p>
              <p className="text-lg text-muted-foreground">
                The question isn&apos;t whether you can afford to invest in yourself—it&apos;s whether you can afford not to. Click below to calculate what staying where you are will actually cost you.
              </p>
            </div>
          </motion.div>

          {/* Cost of Inaction Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 shadow-lg"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <AlertTriangle className="h-8 w-8 text-[var(--color-energy-600)]" />
                <h3 className="text-2xl font-bold">Cost of Inaction Calculator</h3>
              </div>
              
              <p className="text-muted-foreground mb-6">
                Before you decide, let&apos;s calculate what staying where you are will actually cost you.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="cta"
                  size="lg"
                  onClick={() => setIsCalculatorOpen(true)}
                  className="text-lg px-8 py-4 h-auto"
                >
                  <Calculator className="mr-2 h-5 w-5" />
                  Calculate Your Cost of Inaction
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.open('/decision-door/learn-more', '_blank')}
                  className="text-lg px-8 py-4 h-auto"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Three Final CTA Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-bold">Choose Your Next Step</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Starter Pack */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-transparent hover:border-[var(--color-growth-500)] transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-[var(--color-growth-100)] rounded-full flex items-center justify-center mx-auto">
                    <Package className="h-8 w-8 text-[var(--color-growth-600)]" />
                  </div>
                  
                  <h4 className="text-xl font-bold">Starter Pack</h4>
                  <p className="text-muted-foreground">
                    Get immediate access to our complete assessment suite and personalized action plans.
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[var(--color-growth-500)] rounded-full" />
                      <span>All 15 assessment tools</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[var(--color-growth-500)] rounded-full" />
                      <span>Personalized action plans</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[var(--color-growth-500)] rounded-full" />
                      <span>Progress tracking dashboard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[var(--color-growth-500)] rounded-full" />
                      <span>Email support</span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <div className="text-2xl font-bold text-[var(--color-growth-600)] mb-2">FREE</div>
                    <Button className="w-full" variant="outline" onClick={() => window.open('/register', '_blank')}>
                      Get Starter Pack
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Free Webinar */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-[var(--color-energy-500)] relative overflow-hidden"
              >
                {/* Popular Badge */}
                <div className="absolute top-0 right-0 bg-[var(--color-energy-500)] text-white px-3 py-1 text-xs font-medium">
                  MOST POPULAR
                </div>
                
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-[var(--color-energy-100)] rounded-full flex items-center justify-center mx-auto">
                    <Video className="h-8 w-8 text-[var(--color-energy-600)]" />
                  </div>
                  
                  <h4 className="text-xl font-bold">Free Masterclass</h4>
                  <p className="text-muted-foreground">
                    Join our live masterclass and learn the exact system that&apos;s helped 50,000+ people unlock their potential.
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[var(--color-energy-500)] rounded-full" />
                      <span>90-minute live training</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[var(--color-energy-500)] rounded-full" />
                      <span>Q&A with our experts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[var(--color-energy-500)] rounded-full" />
                      <span>Exclusive bonus materials</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[var(--color-energy-500)] rounded-full" />
                      <span>Recording if you can&apos;t attend live</span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <div className="text-2xl font-bold text-[var(--color-energy-600)] mb-2">FREE</div>
                    <Button className="w-full" variant="cta" onClick={() => window.open('/register', '_blank')}>
                      Reserve My Seat
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Office Visit */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-transparent hover:border-[var(--color-transformation-500)] transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-[var(--color-transformation-100)] rounded-full flex items-center justify-center mx-auto">
                    <MapPin className="h-8 w-8 text-[var(--color-transformation-600)]" />
                  </div>
                  
                  <h4 className="text-xl font-bold">Office Visit</h4>
                  <p className="text-muted-foreground">
                    Schedule a personal consultation at our Addis Ababa office for a customized development plan.
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[var(--color-transformation-500)] rounded-full" />
                      <span>2-hour personal consultation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[var(--color-transformation-500)] rounded-full" />
                      <span>Custom development plan</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[var(--color-transformation-500)] rounded-full" />
                      <span>90-day implementation guide</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[var(--color-transformation-500)] rounded-full" />
                      <span>Follow-up support</span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <div className="text-2xl font-bold text-[var(--color-transformation-600)] mb-2">Book Now</div>
                    <Button className="w-full" variant="outline" onClick={() => window.open('/register', '_blank')}>
                      Schedule Visit
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Final Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[var(--color-energy-500)] to-[var(--color-transformation-500)] rounded-2xl p-8 text-white"
          >
            <h3 className="text-2xl font-bold mb-4">The Choice Is Yours</h3>
            <p className="text-lg opacity-90 mb-6">
              You can close this page and go back to your old patterns, or you can take the first step 
              toward the life you&apos;ve always known was possible. The tools, insights, and support are here. 
              The only question is: Are you ready?
            </p>
            <p className="text-sm opacity-75">
              Remember: A year from now, you&apos;ll wish you had started today.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Cost of Inaction Calculator Modal */}
      <CostOfInactionCalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </section>
  )
}

// Cost of Inaction Calculator Component
function CostOfInactionCalculator({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)

  const steps = [
    {
      title: "Current Situation",
      questions: [
        {
          id: "income",
          text: "What&apos;s your current monthly income?",
          type: "select",
          options: [
            { text: "Under 10,000 ETB", value: 8000 },
            { text: "10,000 - 25,000 ETB", value: 17500 },
            { text: "25,000 - 50,000 ETB", value: 37500 },
            { text: "50,000 - 100,000 ETB", value: 75000 },
            { text: "Over 100,000 ETB", value: 125000 }
          ]
        },
        {
          id: "satisfaction",
          text: "How satisfied are you with your current life (1-10)?",
          type: "scale",
          min: 1,
          max: 10
        },
        {
          id: "stuck_years",
          text: "How long have you felt stuck in your current situation?",
          type: "select",
          options: [
            { text: "Less than 1 year", value: 0.5 },
            { text: "1-2 years", value: 1.5 },
            { text: "3-5 years", value: 4 },
            { text: "5-10 years", value: 7.5 },
            { text: "Over 10 years", value: 12 }
          ]
        }
      ]
    },
    {
      title: "Missed Opportunities",
      questions: [
        {
          id: "opportunities",
          text: "How many opportunities do you feel you&apos;ve missed due to lack of clarity or confidence?",
          type: "select",
          options: [
            { text: "1-2 opportunities", value: 2 },
            { text: "3-5 opportunities", value: 4 },
            { text: "6-10 opportunities", value: 8 },
            { text: "More than 10", value: 15 }
          ]
        },
        {
          id: "potential_income",
          text: "If you were living up to your full potential, what would your monthly income be?",
          type: "select",
          options: [
            { text: "25,000 - 50,000 ETB", value: 37500 },
            { text: "50,000 - 100,000 ETB", value: 75000 },
            { text: "100,000 - 200,000 ETB", value: 150000 },
            { text: "Over 200,000 ETB", value: 250000 }
          ]
        }
      ]
    },
    {
      title: "Time Impact",
      questions: [
        {
          id: "daily_hours",
          text: "How many hours per day do you spend feeling unfulfilled or frustrated?",
          type: "select",
          options: [
            { text: "1-2 hours", value: 1.5 },
            { text: "3-4 hours", value: 3.5 },
            { text: "5-6 hours", value: 5.5 },
            { text: "Most of my day", value: 8 }
          ]
        },
        {
          id: "energy_level",
          text: "On a scale of 1-10, how would you rate your daily energy and motivation?",
          type: "scale",
          min: 1,
          max: 10
        }
      ]
    }
  ]

  const handleStepComplete = (stepResponses: Record<string, number>) => {
    setResponses({ ...responses, ...stepResponses })
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowResults(true)
    }
  }

  const calculateCosts = () => {
    const monthlyIncomeLoss = (responses.potential_income || 75000) - (responses.income || 37500)
    const yearlyIncomeLoss = monthlyIncomeLoss * 12
    const fiveYearIncomeLoss = yearlyIncomeLoss * 5

    const opportunityCost = (responses.opportunities || 4) * 50000 // Average opportunity value
    const timeCost = (responses.daily_hours || 3.5) * 365 * 5 // Hours over 5 years
    const satisfactionGap = 10 - (responses.satisfaction || 5)
    const energyGap = 10 - (responses.energy_level || 5)

    return {
      monthlyIncomeLoss,
      yearlyIncomeLoss,
      fiveYearIncomeLoss,
      opportunityCost,
      timeCost,
      satisfactionGap,
      energyGap,
      totalFinancialCost: fiveYearIncomeLoss + opportunityCost
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        {!showResults ? (
          <StepForm
            step={steps[currentStep]}
            stepNumber={currentStep + 1}
            totalSteps={steps.length}
            onComplete={handleStepComplete}
            onClose={onClose}
          />
        ) : (
          <CostResults
            costs={calculateCosts()}
            responses={responses}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  )
}

interface StepFormProps {
  step: {
    title: string;
    questions: Array<{
      id: string;
      text: string;
      type: string;
      options?: Array<{ text: string; value: number }>;
      min?: number;
      max?: number;
    }>;
  };
  stepNumber: number;
  totalSteps: number;
  onComplete: (answers: Record<string, number>) => void;
  onClose: () => void;
}

function StepForm({ step, stepNumber, totalSteps, onComplete, onClose }: StepFormProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({})

  const handleSubmit = () => {
    onComplete(answers)
  }

  const canSubmit = step.questions.every((q) => answers[q.id] !== undefined)

  return (
    <>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Cost of Inaction Calculator</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-[var(--color-energy-500)] h-2 rounded-full transition-all duration-300"
            style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mb-4">Step {stepNumber} of {totalSteps}: {step.title}</p>
      </div>

      <div className="space-y-6">
        {step.questions.map((question) => (
          <div key={question.id} className="space-y-3">
            <h4 className="font-medium">{question.text}</h4>
            
            {question.type === "select" && (
              <div className="space-y-2">
                {question.options?.map((option, index: number) => (
                  <button
                    key={index}
                    onClick={() => setAnswers({ ...answers, [question.id]: option.value })}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      answers[question.id] === option.value
                        ? 'bg-[var(--color-energy-50)] border-[var(--color-energy-500)] text-[var(--color-energy-700)]'
                        : 'bg-white hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            )}

            {question.type === "scale" && (
              <div className="flex gap-2 justify-center">
                {Array.from({ length: question.max - question.min + 1 }, (_, i) => {
                  const value = question.min + i
                  return (
                    <button
                      key={value}
                      onClick={() => setAnswers({ ...answers, [question.id]: value })}
                      className={`w-10 h-10 rounded-full font-medium transition-colors ${
                        answers[question.id] === value
                          ? 'bg-[var(--color-energy-500)] text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {value}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        ))}

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full"
          variant="cta"
        >
          {stepNumber === totalSteps ? 'Calculate My Costs' : 'Next Step'}
        </Button>
      </div>
    </>
  )
}

interface CostResultsProps {
  costs: {
    totalFinancialCost: number;
    fiveYearIncomeLoss: number;
    opportunityCost: number;
    timeCost: number;
    satisfactionGap: number;
  };
  responses: Record<string, number>;
  onClose: () => void;
}

function CostResults({ costs, onClose }: CostResultsProps) {
  return (
    <>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Your Cost of Inaction</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Total Cost Highlight */}
        <div className="text-center p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg border border-red-200">
          <div className="text-3xl font-bold text-red-600 mb-2">
            {costs.totalFinancialCost.toLocaleString()} ETB
          </div>
          <div className="text-lg text-red-700 dark:text-red-300">
            Total 5-Year Financial Cost of Staying Where You Are
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-red-500" />
              <span className="font-medium">Income Gap</span>
            </div>
            <div className="text-xl font-bold text-red-600">
              {costs.fiveYearIncomeLoss.toLocaleString()} ETB
            </div>
            <div className="text-sm text-gray-600">Over 5 years</div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              <span className="font-medium">Missed Opportunities</span>
            </div>
            <div className="text-xl font-bold text-red-600">
              {costs.opportunityCost.toLocaleString()} ETB
            </div>
            <div className="text-sm text-gray-600">Estimated value</div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span className="font-medium">Time Lost</span>
            </div>
            <div className="text-xl font-bold text-orange-600">
              {Math.round(costs.timeCost).toLocaleString()} hours
            </div>
            <div className="text-sm text-gray-600">Feeling unfulfilled</div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">Life Satisfaction Gap</span>
            </div>
            <div className="text-xl font-bold text-yellow-600">
              {costs.satisfactionGap}/10
            </div>
            <div className="text-sm text-gray-600">Points below optimal</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="p-6 bg-gradient-to-r from-[var(--color-energy-500)] to-[var(--color-transformation-500)] rounded-lg text-white text-center">
          <h4 className="text-xl font-bold mb-3">The Good News</h4>
          <p className="mb-4 opacity-90">
            These costs are completely avoidable. Every day you wait, the cost increases. 
            But every day you take action, you move closer to your potential.
          </p>
          <p className="text-sm opacity-75 mb-4">
            The question isn&apos;t whether you can afford to invest in yourself. 
            The question is: Can you afford not to?
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Button variant="outline" className="w-full" onClick={() => window.open('/register', '_blank')}>
            Get Starter Pack
          </Button>
          <Button variant="cta" className="w-full" onClick={() => window.open('/register', '_blank')}>
            Join Free Masterclass
          </Button>
          <Button variant="outline" className="w-full" onClick={() => window.open('/register', '_blank')}>
            Schedule Office Visit
          </Button>
        </div>

        <Button onClick={onClose} variant="ghost" className="w-full">
          Close Calculator
        </Button>
      </div>
    </>
  )
}