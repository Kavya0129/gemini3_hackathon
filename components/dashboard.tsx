'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { MonthlySnapshot, UserProfile } from '@/lib/types'
import { TrendingUp, TrendingDown, Wallet, PiggyBank, Target, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'

interface DashboardProps {
  snapshots: MonthlySnapshot[]
  profile: UserProfile | null
  onNavigate: (tab: 'snapshot' | 'copilot' | 'simulator') => void
}

export function Dashboard({ snapshots, profile, onNavigate }: DashboardProps) {
  const stats = useMemo(() => {
    if (snapshots.length === 0) {
      return {
        totalSavings: 0,
        avgIncome: 0,
        avgExpenses: 0,
        savingsRate: 0,
        trend: 'neutral' as const,
        chartData: [],
      }
    }

    const sorted = [...snapshots].sort((a, b) => a.month.localeCompare(b.month))
    const totalSavings = sorted.reduce((sum, s) => sum + s.savings, 0)
    const avgIncome = sorted.reduce((sum, s) => sum + s.income, 0) / sorted.length
    const avgExpenses = sorted.reduce((sum, s) => sum + s.expenses, 0) / sorted.length
    const savingsRate = avgIncome > 0 ? ((avgIncome - avgExpenses) / avgIncome) * 100 : 0

    const recentSnapshots = sorted.slice(-3)
    const trend =
      recentSnapshots.length >= 2
        ? recentSnapshots[recentSnapshots.length - 1].savings > recentSnapshots[0].savings
          ? ('up' as const)
          : ('down' as const)
        : ('neutral' as const)

    const chartData = sorted.slice(-6).map((s) => ({
      month: new Date(s.month + '-01').toLocaleDateString('en-US', { month: 'short' }),
      income: s.income,
      expenses: s.expenses,
      savings: s.savings,
    }))

    return { totalSavings, avgIncome, avgExpenses, savingsRate, trend, chartData }
  }, [snapshots])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)

  if (snapshots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Wallet className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Welcome to Finwise
        </h2>
        <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
          Start your financial journey by adding your first monthly snapshot. No bank connections needed - just simple inputs for smart insights.
        </p>
        <Button size="lg" onClick={() => onNavigate('snapshot')} className="gap-2">
          Add Your First Snapshot
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          {profile?.name ? `Welcome back, ${profile.name}` : 'Your Financial Overview'}
        </h2>
        <p className="text-muted-foreground mt-1">
          Track your progress and make informed decisions
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Savings</CardTitle>
            <PiggyBank className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalSavings)}</div>
            <div className="flex items-center gap-1 mt-1">
              {stats.trend === 'up' ? (
                <TrendingUp className="h-3 w-3 text-primary" />
              ) : stats.trend === 'down' ? (
                <TrendingDown className="h-3 w-3 text-destructive" />
              ) : null}
              <span className={`text-xs ${stats.trend === 'up' ? 'text-primary' : stats.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'}`}>
                {stats.trend === 'up' ? 'Trending up' : stats.trend === 'down' ? 'Trending down' : 'No trend data'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Monthly Income</CardTitle>
            <Wallet className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.avgIncome)}</div>
            <p className="text-xs text-muted-foreground mt-1">Based on {snapshots.length} month(s)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Monthly Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-chart-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.avgExpenses)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.avgIncome > 0 ? `${((stats.avgExpenses / stats.avgIncome) * 100).toFixed(0)}% of income` : 'No data'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Savings Rate</CardTitle>
            <Target className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.savingsRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.savingsRate >= 20 ? 'Excellent!' : stats.savingsRate >= 10 ? 'Good progress' : 'Room to improve'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {stats.chartData.length > 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenses</CardTitle>
              <CardDescription>Your monthly cash flow over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} />
                    <YAxis className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [formatCurrency(value), '']}
                    />
                    <Line type="monotone" dataKey="income" stroke="var(--chart-1)" strokeWidth={2} dot={{ fill: 'var(--chart-1)' }} name="Income" />
                    <Line type="monotone" dataKey="expenses" stroke="var(--chart-5)" strokeWidth={2} dot={{ fill: 'var(--chart-5)' }} name="Expenses" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Savings Growth</CardTitle>
              <CardDescription>Monthly savings accumulation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} />
                    <YAxis className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [formatCurrency(value), 'Savings']}
                    />
                    <Area type="monotone" dataKey="savings" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.2} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Continue building your financial picture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" onClick={() => onNavigate('snapshot')}>
              <Wallet className="h-5 w-5 text-primary" />
              <span>Add Monthly Snapshot</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" onClick={() => onNavigate('copilot')}>
              <Target className="h-5 w-5 text-chart-2" />
              <span>Ask AI Copilot</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" onClick={() => onNavigate('simulator')}>
              <TrendingUp className="h-5 w-5 text-chart-4" />
              <span>Run Simulation</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
