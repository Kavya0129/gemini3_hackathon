import { generateText, Output } from 'ai'
import { z } from 'zod'
import { google } from '@ai-sdk/google';


export const maxDuration = 60

const NewsSchema = z.object({
  articles: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      summary: z.string(),
      category: z.enum(['market', 'economy', 'personal-finance', 'investing']),
      relevance: z.string(),
      actionableInsight: z.string(),
    })
  ),
})

export async function POST(req: Request) {
  const { userContext, selectedCategory } = await req.json()

  const categoryFilter =
    selectedCategory === 'all'
      ? 'all categories (market, economy, personal-finance, investing)'
      : selectedCategory

  const prompt = `You are a financial news curator. Generate 6 realistic, current financial news articles that would be relevant to someone with this financial profile:

${userContext}

Focus on: ${categoryFilter}

Today's date is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.

Generate news that:
1. Reflects realistic current economic events and trends
2. Is directly relevant to someone trying to grow their wealth
3. Includes both macro-economic news and personal finance tips
4. Provides actionable insights

For each article, include:
- A compelling title
- A 2-3 sentence summary
- The appropriate category
- Why it's relevant to this user specifically
- One actionable insight they can apply`

  const result = await generateText({
    model: google('gemini-3-flash-preview'),
    prompt,
    output: Output.object({ schema: NewsSchema }),
    abortSignal: req.signal,
  })

  return Response.json(result.output)
}
