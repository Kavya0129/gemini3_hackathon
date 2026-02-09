'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { MonthlySnapshot } from '@/lib/types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import { useMemo } from 'react'

interface BudgetTrackerProps {
  snapshots: MonthlySnapshot[]
}

export function BudgetTracker({ snapshots }: BudgetTrackerProps) {
  const budgetData = useMemo(() => {
    if (snapshots.length === 0) return { categoryData: [], summary: [] }

    // Get the most recent snapshot with budget data
    const sorted = [...snapshots].sort((a, b) => b.month.localeCompare(a.month))
    const mostRecent = sorted.find((s) => s.budgetCategories && s.budgetCategories.length > 0)

    if (!mostRecent || !mostRecent.budgetCategories) {
      return { categoryData: [], summary: [] }
    }

    // Calculate aggregate across all snapshots
    const categoryMap = new Map<string, { budgeted: number; actual: number; count: number }>()

    snapshots.forEach((snapshot) => {
      if (snapshot.budgetCategories) {
        snapshot.budgetCategories.forEach((cat) => {
          const existing = categoryMap.get(cat.name) || { budgeted: 0, actual: 0, count: 0 }
          categoryMap.set(cat.name, {
            budgeted: existing.budgeted + cat.budgeted,
            actual: existing.actual + cat.actual,
            count: existing.count + 1,
          })
        })
      }
    })

    const categoryData = Array.from(categoryMap.entries()).map(([name, data]) => ({
      category: name,
      Budgeted: Math.round(data.budgeted),
      Actual: Math.round(data.actual),
      difference: Math.round(data.actual - data.budgeted),
    }))

    const summary = categoryData.map((cat) => ({
      ...cat,
      isOver: cat.difference > 0,
      percentage: ((cat.Actual / cat.Budgeted - 1) * 100).toFixed(1),
    }))

    return { categoryData, summary }
  }, [snapshots])

  if (budgetData.categoryData.length === 0) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Budget vs Actual
          </CardTitle>
          <CardDescription>Track spending across categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              Add budget categories in your monthly snapshots to see tracking data here.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalBudgeted = budgetData.summary.reduce((sum, cat) => sum + cat.Budgeted, 0)
  const totalActual = budgetData.summary.reduce((sum, cat) => sum + cat.Actual, 0)
  const overBudget = budgetData.summary.filter((cat) => cat.isOver).length
  const onTrack = budgetData.summary.length - overBudget

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Budget vs Actual
        </CardTitle>
        <CardDescription>Aggregate spending across all tracked months</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Total Budgeted</p>
            <p className="font-semibold text-sm">${totalBudgeted.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Total Actual</p>
            <p className="font-semibold text-sm">${totalActual.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">On Track / Over</p>
            <p className="font-semibold text-sm">
              {onTrack}/{budgetData.summary.length}
            </p>
          </div>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={budgetData.categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Legend />
            <Bar dataKey="Budgeted" fill="hsl(var(--chart-3))" opacity={0.7} />
            <Bar dataKey="Actual" fill="hsl(var(--primary))">
              {budgetData.categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.difference > 0 ? 'hsl(var(--destructive))' : 'hsl(var(--chart-2))'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Category Details */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Category Breakdown</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {budgetData.summary.map((cat) => (
              <div key={cat.category} className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                <span className="font-medium">{cat.category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">${cat.Actual.toLocaleString()}</span>
                  {cat.isOver ? (
                    <div className="flex items-center gap-1 text-destructive text-xs">
                      <TrendingUp className="h-3 w-3" />
                      +{cat.percentage}%
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-chart-2 text-xs">
                      <TrendingDown className="h-3 w-3" />
                      {cat.percentage}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
