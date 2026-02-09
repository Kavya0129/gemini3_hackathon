export interface BudgetCategory {
  id: string
  name: string
  budgeted: number
  actual: number
}

export interface MonthlySnapshot {
  id: string
  month: string // YYYY-MM format
  income: number
  expenses: number
  savings: number
  majorEvents: string[]
  notes: string
  budgetCategories?: BudgetCategory[]
  createdAt: string
}

export interface UserProfile {
  name: string
  financialGoals: string[]
  riskTolerance: 'conservative' | 'moderate' | 'aggressive'
  monthlyBudget: number
}

export interface SimulationScenario {
  id: string
  name: string
  type: 'career' | 'loan' | 'purchase' | 'investment' | 'custom'
  parameters: {
    amount?: number
    duration?: number
    interestRate?: number
    monthlyPayment?: number
    description: string
  }
  createdAt: string
}

export interface NewsArticle {
  id: string
  title: string
  summary: string
  source: string
  url: string
  category: 'market' | 'economy' | 'personal-finance' | 'investing'
  publishedAt: string
}

export interface InvestmentRecommendation {
  allocation: {
    stocks: number
    bonds: number
    cash: number
    alternatives?: number
  }
  reasoning: string
  riskScore: number // 1-10
  expectedReturn: string
  timeline: string
  suggestions: string[]
}

export type TabType = 'dashboard' | 'snapshot' | 'copilot' | 'simulator' | 'news' | 'investment'
