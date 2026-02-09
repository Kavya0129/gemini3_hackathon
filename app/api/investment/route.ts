import { generateText, Output } from 'ai'
import { z } from 'zod'
import type { MonthlySnapshot, UserProfile } from '@/lib/types'
import { google } from '@ai-sdk/google';

export const maxDuration = 60

const InvestmentSchema = z.object({
  allocation: z.object({
    stocks: z.number().describe('Percentage in stocks (0-100)'),
    bonds: z.number().describe('Percentage in bonds (0-100)'),
    cash: z.number().describe('Percentage in cash (0-100)'),
    alternatives: z.number().optional().describe('Percentage in alternatives like real estate (0-100)'),
  }),
  reasoning: z.string().describe('Brief explanation of the recommended allocation'),
  riskScore: z.number().describe('Risk level of this portfolio (1-10 scale)'),
  expectedReturn: z.string().describe('Expected annual return range, e.g., "5-7%"'),
  timeline: z.string().describe('Recommended investment timeline'),
  suggestions: z.array(z.string()).describe('3-5 specific actionable investment ideas'),
})

export async function POST(req: Request) {
  const { snapshots, profile }: { snapshots: MonthlySnapshot[]; profile: UserProfile | null } = await req.json()

  if (snapshots.length === 0) {
    return Response.json({
      allocation: { stocks: 50, bonds: 30, cash: 20 },
      reasoning: 'Balanced allocation for beginners with no financial history yet.',
      riskScore: 5,
      expectedReturn: '4-6%',
      timeline: '10+ years',
      suggestions: [
        'Start with a diversified index fund like VOO or VTSAX',
        'Open a Roth IRA if you are eligible',
        'Build an emergency fund first (3-6 months expenses)',
      ],
    })
  }

  const sorted = [...snapshots].sort((a, b) => a.month.localeCompare(b.month))
  const avgIncome = sorted.reduce((sum, s) => sum + s.income, 0) / sorted.length
  const avgSavings = sorted.reduce((sum, s) => sum + s.savings, 0) / sorted.length
  const savingsRate = avgIncome > 0 ? (avgSavings / avgIncome) * 100 : 0

  const prompt = `Based on this financial profile, recommend a personalized investment allocation:

Financial Profile:
- Average Monthly Income: $${avgIncome.toLocaleString()}
- Average Monthly Savings: $${avgSavings.toLocaleString()}
- Savings Rate: ${savingsRate.toFixed(1)}%
- Risk Tolerance: ${profile?.riskTolerance || 'moderate'}
- Financial Goals: ${profile?.financialGoals?.join(', ') || 'general wealth building'}
- Number of months tracked: ${snapshots.length}

Provide a specific portfolio allocation recommendation with percentages that add up to 100%. Consider their savings capacity, risk tolerance, and financial goals. Include actionable suggestions they can implement today.`

  const result = await generateText({
    model: google('gemini-3-flash-preview'),
    prompt,
    output: Output.object({ schema: InvestmentSchema }),
    abortSignal: req.signal,
  })

  return Response.json(result.output)
}
