'use client'

import React from "react"

import { useState, useRef, useEffect, useMemo } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { MonthlySnapshot, UserProfile } from '@/lib/types'
import { Send, Bot, User, Sparkles, RefreshCw, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AICopilotProps {
  snapshots: MonthlySnapshot[]
  profile: UserProfile | null
}

const suggestedQuestions = [
  'What trends do you see in my spending?',
  'How can I improve my savings rate?',
  'Am I on track to build an emergency fund?',
  'What should I prioritize financially?',
  'How does my income vs expenses compare?',
  'What impact did my major events have?',
]

export function AICopilot({ snapshots, profile }: AICopilotProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const financialContext = useMemo(() => {
    if (snapshots.length === 0) {
      return 'No financial data available yet. The user has not added any monthly snapshots.'
    }

    const sorted = [...snapshots].sort((a, b) => a.month.localeCompare(b.month))
    const totalIncome = sorted.reduce((sum, s) => sum + s.income, 0)
    const totalExpenses = sorted.reduce((sum, s) => sum + s.expenses, 0)
    const totalSavings = sorted.reduce((sum, s) => sum + s.savings, 0)
    const avgSavingsRate =
      totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

    const allEvents = sorted.flatMap((s) =>
      s.majorEvents.map((e) => `${s.month}: ${e}`)
    )

    const recentMonths = sorted.slice(-3)
    const recentTrend =
      recentMonths.length >= 2
        ? recentMonths[recentMonths.length - 1].savings > recentMonths[0].savings
          ? 'improving'
          : 'declining'
        : 'insufficient data'

    return `
FINANCIAL SUMMARY (${sorted.length} months of data):
- Total Income: $${totalIncome.toLocaleString()}
- Total Expenses: $${totalExpenses.toLocaleString()}
- Total Savings: $${totalSavings.toLocaleString()}
- Average Savings Rate: ${avgSavingsRate.toFixed(1)}%
- Recent Trend: ${recentTrend}

MONTHLY BREAKDOWN:
${sorted
  .map(
    (s) =>
      `${s.month}: Income $${s.income.toLocaleString()}, Expenses $${s.expenses.toLocaleString()}, Savings $${s.savings.toLocaleString()}${s.majorEvents.length > 0 ? ` (Events: ${s.majorEvents.join(', ')})` : ''}`
  )
  .join('\n')}

${allEvents.length > 0 ? `\nMAJOR EVENTS:\n${allEvents.join('\n')}` : ''}

${
  profile
    ? `
USER PROFILE:
- Name: ${profile.name || 'Not set'}
- Financial Goals: ${profile.financialGoals.length > 0 ? profile.financialGoals.join(', ') : 'Not set'}
- Risk Tolerance: ${profile.riskTolerance || 'Not set'}
- Monthly Budget: $${profile.monthlyBudget?.toLocaleString() || 'Not set'}
`
    : ''
}
`.trim()
  }, [snapshots, profile])

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest: ({ id, messages }) => ({
        body: {
          id,
          messages,
          financialContext,
        },
      }),
    }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput('')
  }

  const handleSuggestion = (question: string) => {
    sendMessage({ text: question })
  }

  const handleReset = () => {
    setMessages([])
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            AI Financial Copilot
          </h2>
          <p className="text-muted-foreground mt-1">
            Get personalized insights powered by Gemini
          </p>
        </div>
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-2 bg-transparent">
            <RefreshCw className="h-4 w-4" />
            New Chat
          </Button>
        )}
      </div>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Hi! I&apos;m your financial copilot.
              </h3>
              <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
                {snapshots.length > 0
                  ? `I've analyzed your ${snapshots.length} month(s) of financial data. Ask me anything about your spending, savings, or financial goals!`
                  : 'Add some monthly snapshots first, and I can help you understand your financial trends and make better decisions.'}
              </p>

              {snapshots.length > 0 && (
                <div className="space-y-3 w-full max-w-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lightbulb className="h-4 w-4" />
                    <span>Try asking:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {suggestedQuestions.slice(0, 4).map((question) => (
                      <Button
                        key={question}
                        variant="outline"
                        className="h-auto py-3 px-4 text-left justify-start text-sm whitespace-normal bg-transparent"
                        onClick={() => handleSuggestion(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-3',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.parts.map((part, index) => {
                        if (part.type === 'text') {
                          return <span key={index}>{part.text}</span>
                        }
                        return null
                      })}
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={snapshots.length > 0 ? 'Ask about your finances...' : 'Add snapshots first to get personalized insights...'}
              className="min-h-[52px] max-h-32 resize-none"
              disabled={isLoading || snapshots.length === 0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <Button
              type="submit"
              size="icon"
              className="h-[52px] w-[52px]"
              disabled={isLoading || !input.trim() || snapshots.length === 0}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
