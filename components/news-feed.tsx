'use client'

import React from "react"

import { useState, useMemo, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { MonthlySnapshot, UserProfile } from '@/lib/types'
import {
  Newspaper,
  RefreshCw,
  TrendingUp,
  Globe,
  Wallet,
  LineChart,
  Loader2,
  Lightbulb,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NewsFeedProps {
  snapshots: MonthlySnapshot[]
  profile: UserProfile | null
}

type Category = 'all' | 'market' | 'economy' | 'personal-finance' | 'investing'

interface NewsArticle {
  id: string
  title: string
  summary: string
  category: 'market' | 'economy' | 'personal-finance' | 'investing'
  relevance: string
  actionableInsight: string
}

const categoryConfig: Record<Category, { label: string; icon: React.ReactNode; color: string }> = {
  all: { label: 'All News', icon: <Newspaper className="h-4 w-4" />, color: 'bg-muted' },
  market: { label: 'Markets', icon: <TrendingUp className="h-4 w-4" />, color: 'bg-chart-1/10 text-chart-1' },
  economy: { label: 'Economy', icon: <Globe className="h-4 w-4" />, color: 'bg-chart-3/10 text-chart-3' },
  'personal-finance': { label: 'Personal Finance', icon: <Wallet className="h-4 w-4" />, color: 'bg-chart-2/10 text-chart-2' },
  investing: { label: 'Investing', icon: <LineChart className="h-4 w-4" />, color: 'bg-chart-4/10 text-chart-4' },
}

export function NewsFeed({ snapshots, profile }: NewsFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  const userContext = useMemo(() => {
    if (snapshots.length === 0) {
      return 'New user with no financial data yet. Focus on general financial education and getting started with budgeting.'
    }

    const sorted = [...snapshots].sort((a, b) => a.month.localeCompare(b.month))
    const avgIncome = sorted.reduce((sum, s) => sum + s.income, 0) / sorted.length
    const avgExpenses = sorted.reduce((sum, s) => sum + s.expenses, 0) / sorted.length
    const avgSavings = sorted.reduce((sum, s) => sum + s.savings, 0) / sorted.length
    const savingsRate = avgIncome > 0 ? (avgSavings / avgIncome) * 100 : 0

    const allEvents = sorted.flatMap((s) => s.majorEvents).slice(-5)

    return `
User Financial Profile:
- Average Monthly Income: $${avgIncome.toLocaleString()}
- Average Monthly Expenses: $${avgExpenses.toLocaleString()}
- Savings Rate: ${savingsRate.toFixed(0)}%
- Recent Life Events: ${allEvents.length > 0 ? allEvents.join(', ') : 'None'}
${profile?.financialGoals?.length ? `- Financial Goals: ${profile.financialGoals.join(', ')}` : ''}
${profile?.riskTolerance ? `- Risk Tolerance: ${profile.riskTolerance}` : ''}
`.trim()
  }, [snapshots, profile])

  const fetchNews = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userContext,
          selectedCategory,
        }),
      })

      if (!response.ok) throw new Error('Failed to fetch news')

      const data = await response.json()
      setArticles(data.articles || [])
      setHasLoaded(true)
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setIsLoading(false)
    }
  }, [userContext, selectedCategory])

  const filteredArticles =
    selectedCategory === 'all'
      ? articles
      : articles.filter((a) => a.category === selectedCategory)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Newspaper className="h-6 w-6 text-primary" />
            Economic News Feed
          </h2>
          <p className="text-muted-foreground mt-1">
            Curated financial news tailored to your profile
          </p>
        </div>
        <Button onClick={fetchNews} disabled={isLoading} className="gap-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {hasLoaded ? 'Refresh News' : 'Load News'}
        </Button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(categoryConfig) as Category[]).map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            className="gap-2"
            onClick={() => setSelectedCategory(category)}
          >
            {categoryConfig[category].icon}
            {categoryConfig[category].label}
          </Button>
        ))}
      </div>

      {/* News Content */}
      {!hasLoaded ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Newspaper className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Ready to Load Your News
            </h3>
            <p className="text-muted-foreground max-w-md mb-6 leading-relaxed">
              Click the button above to generate personalized financial news based on your profile and goals.
            </p>
            <Button onClick={fetchNews} disabled={isLoading} className="gap-2">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Newspaper className="h-4 w-4" />
              )}
              Generate News Feed
            </Button>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-20 mb-2" />
                <div className="h-5 bg-muted rounded w-full" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Newspaper className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              No articles found in this category. Try selecting a different filter.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-20rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="flex flex-col h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant="secondary"
                      className={cn('gap-1', categoryConfig[article.category].color)}
                    >
                      {categoryConfig[article.category].icon}
                      {categoryConfig[article.category].label}
                    </Badge>
                  </div>
                  <CardTitle className="text-base leading-snug line-clamp-2">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <CardDescription className="flex-1 line-clamp-3 mb-4">
                    {article.summary}
                  </CardDescription>
                  
                  {/* Relevance */}
                  <div className="bg-muted/50 rounded-lg p-3 mb-3">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">
                      Why this matters to you:
                    </p>
                    <p className="text-sm text-foreground line-clamp-2">
                      {article.relevance}
                    </p>
                  </div>

                  {/* Actionable Insight */}
                  <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <Lightbulb className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-primary font-medium mb-0.5">Actionable Insight</p>
                      <p className="text-sm text-foreground line-clamp-2">
                        {article.actionableInsight}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
