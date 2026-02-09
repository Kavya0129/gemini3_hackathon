export interface MonthlySnapshot {
  id: string
  month: string // YYYY-MM format
  income: number
  expenses: number
  savings: number
  majorEvents: string[]
  notes: string
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

export type TabType = 'dashboard' | 'snapshot' | 'copilot' | 'simulator' | 'news'
