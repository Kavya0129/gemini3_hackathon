'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { MonthlySnapshot, UserProfile, InvestmentRecommendation } from '@/lib/types'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts'
import { Loader2, TrendingUp, Target, AlertCircle, CheckCircle2 } from 'lucide-react'

interface InvestmentRecommendationProps {
  snapshots: MonthlySnapshot[]
  profile: UserProfile | null
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))']

export function InvestmentRecommendationWidget({ snapshots, profile }: InvestmentRecommendationProps) {
  const [recommendation, setRecommendation] = useState<InvestmentRecommendation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRecommendation = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/investment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snapshots, profile }),
      })

      if (!response.ok) throw new Error('Failed to fetch recommendation')
      const data = await response.json()
      setRecommendation(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching recommendation')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendation()
  }, [snapshots, profile])

  if (isLoading) {
    return (
      <Card className="h-full border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Investment Allocation
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Analyzing your profile...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !recommendation) {
    return (
      <Card className="h-full border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Investment Allocation
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-muted-foreground">{error || 'Failed to generate recommendation'}</p>
            <Button onClick={fetchRecommendation} variant="outline" size="sm" className="mt-2 bg-transparent">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const allocationData = [
    { name: 'Stocks', value: recommendation.allocation.stocks },
    { name: 'Bonds', value: recommendation.allocation.bonds },
    { name: 'Cash', value: recommendation.allocation.cash },
    ...(recommendation.allocation.alternatives ? [{ name: 'Alternatives', value: recommendation.allocation.alternatives }] : []),
  ]

  // Projection over time (simple calculation)
  const projectionData = Array.from({ length: 11 }).map((_, i) => {
    const year = i
    const returnRate = parseFloat(recommendation.expectedReturn.split('-')[0]) / 100
    const value = 10000 * Math.pow(1 + returnRate, year)
    return { year, value: Math.round(value) }
  })

  const riskColors = recommendation.riskScore <= 3 ? 'text-chart-3' : recommendation.riskScore <= 6 ? 'text-chart-2' : 'text-destructive'

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Personalized Investment Allocation
          </CardTitle>
          <CardDescription>Based on your financial profile and risk tolerance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Allocation Pie Chart */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold mb-4">Portfolio Breakdown</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={allocationData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {allocationData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-sm">Portfolio Details</h4>
                <div className="space-y-2">
                  {allocationData.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="font-semibold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Expected Return</p>
                  <p className="font-semibold text-green-600">{recommendation.expectedReturn}/year</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                  <p className={`font-semibold ${riskColors}`}>{recommendation.riskScore}/10</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reasoning */}
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Why This Allocation?
            </h4>
            <p className="text-sm text-muted-foreground">{recommendation.reasoning}</p>
          </div>

          {/* 10-Year Projection */}
          <div>
            <h4 className="font-semibold text-sm mb-4">10-Year Growth Projection ($10K Initial Investment)</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} />
                <YAxis label={{ value: 'Portfolio Value ($)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Actionable Suggestions */}
          <div>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Next Steps
            </h4>
            <ul className="space-y-2">
              {recommendation.suggestions.map((suggestion, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
            <p className="text-xs text-amber-900 dark:text-amber-200">
              <strong>Disclaimer:</strong> This is educational guidance based on your profile. This is not personalized financial advice. Consult with a qualified financial advisor before making investment decisions.
            </p>
          </div>

          <Button onClick={fetchRecommendation} variant="outline" className="w-full bg-transparent" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              'Refresh Recommendation'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
