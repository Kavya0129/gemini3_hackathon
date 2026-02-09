import { useEffect } from 'react'
import type { MonthlySnapshot, UserProfile } from '@/lib/types'

// Demo user with realistic financial data
const DEMO_USER: UserProfile & { id: string; email: string } = {
  id: '1',
  email: 'demo@example.com',
  name: 'Alex Johnson',
  financialGoals: ['Save 6 months emergency fund', 'Invest in index funds', 'Buy a house in 5 years'],
  riskTolerance: 'moderate',
  monthlyBudget: 5000,
}

// Demo snapshots with realistic financial data across 6 months
const DEMO_SNAPSHOTS: MonthlySnapshot[] = [
  {
    id: '1',
    month: '2024-09',
    income: 5500,
    expenses: 3200,
    savings: 2300,
    majorEvents: ['Started new job'],
    notes: 'Good month, got a promotion with salary increase',
    createdAt: '2024-09-15T10:30:00Z',
  },
  {
    id: '2',
    month: '2024-10',
    income: 5500,
    expenses: 3450,
    savings: 2050,
    majorEvents: ['Car maintenance', 'Wedding gift'],
    notes: 'Higher expenses due to unexpected car repairs',
    createdAt: '2024-10-15T10:30:00Z',
  },
  {
    id: '3',
    month: '2024-11',
    income: 5500,
    expenses: 3100,
    savings: 2400,
    majorEvents: ['Thanksgiving expenses'],
    notes: 'Spent more on groceries and travel for holidays',
    createdAt: '2024-11-15T10:30:00Z',
  },
  {
    id: '4',
    month: '2024-12',
    income: 6200,
    expenses: 3800,
    savings: 2400,
    majorEvents: ['Holiday bonuses', 'Christmas shopping'],
    notes: 'Received year-end bonus, managed expenses well',
    createdAt: '2024-12-15T10:30:00Z',
  },
  {
    id: '5',
    month: '2025-01',
    income: 5500,
    expenses: 2800,
    savings: 2700,
    majorEvents: ['New Year resolution started'],
    notes: 'Started budgeting app, reduced dining out expenses',
    createdAt: '2025-01-15T10:30:00Z',
  },
  {
    id: '6',
    month: '2025-02',
    income: 5500,
    expenses: 3100,
    savings: 2400,
    majorEvents: ['Investments made'],
    notes: 'Started investing $500/month in index funds',
    createdAt: '2025-02-08T10:30:00Z',
  },
]

export function useDemoData(user: any) {
  useEffect(() => {
    if (user && user.email === DEMO_USER.email) {
      // Initialize demo data in localStorage if demo user is logged in
      const existingSnapshots = localStorage.getItem('finwise-snapshots')
      if (!existingSnapshots) {
        localStorage.setItem('finwise-snapshots', JSON.stringify(DEMO_SNAPSHOTS))
      }

      const existingProfile = localStorage.getItem('finwise-profile')
      if (!existingProfile) {
        localStorage.setItem('finwise-profile', JSON.stringify(DEMO_USER))
      }
    }
  }, [user])
}
