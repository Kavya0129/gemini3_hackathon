import { generateText, Output } from "ai";
import { z } from "zod";

export const maxDuration = 60;

interface SimulationRequest {
  scenarioType: string;
  parameters: Record<string, number | string>;
  financialContext: string;
}

const simulationOutputSchema = z.object({
  summary: z.string().describe("A 2-3 sentence high-level summary of the decision's impact"),
  verdict: z.enum(["recommended", "cautious", "not_recommended"]).describe("Overall recommendation"),
  verdictReason: z.string().describe("One sentence explaining the verdict"),
  monthlyImpact: z.object({
    currentMonthlySavings: z.number().describe("Current monthly savings amount"),
    projectedMonthlySavings: z.number().describe("Projected monthly savings after the decision"),
    monthlyDifference: z.number().describe("The difference (positive = more savings, negative = less)"),
  }),
  projectionTimeline: z.array(
    z.object({
      month: z.string().describe("Label like 'Now', 'Month 3', 'Month 6', 'Year 1', 'Year 2', etc."),
      withDecision: z.number().describe("Projected total savings/net worth WITH this decision"),
      withoutDecision: z.number().describe("Projected total savings/net worth WITHOUT this decision"),
    })
  ).describe("6-8 data points showing financial trajectory over time with and without this decision"),
  breakdownCategories: z.array(
    z.object({
      category: z.string().describe("Category name like 'Upfront Cost', 'Monthly Payment', 'Insurance', etc."),
      amount: z.number().describe("Dollar amount (negative = cost, positive = gain)"),
    })
  ).describe("3-6 cost/benefit categories for this decision"),
  riskScore: z.number().min(1).max(10).describe("Financial risk score from 1 (very safe) to 10 (very risky)"),
  breakEvenMonths: z.number().nullable().describe("Number of months to break even, or null if not applicable"),
  keyInsights: z.array(z.string()).describe("3-5 key financial insights or tips about this decision"),
  alternativeSuggestions: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      potentialSaving: z.number().nullable().describe("Potential dollar savings vs the proposed plan, or null"),
    })
  ).describe("2-3 alternative approaches the user could consider"),
});

export type SimulationOutput = z.infer<typeof simulationOutputSchema>;

export async function POST(req: Request) {
  const { scenarioType, parameters, financialContext }: SimulationRequest =
    await req.json();

  const prompt = `You are a financial simulation expert. Analyze the following life decision scenario and produce structured data for a visual financial dashboard.

USER'S CURRENT FINANCIAL SITUATION:
${financialContext}

SCENARIO TO SIMULATE: ${scenarioType}

SCENARIO PARAMETERS:
${Object.entries(parameters)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join("\n")}

Generate realistic, data-driven projections based on the user's actual financial data. All dollar amounts should be whole numbers. For the projection timeline, create 6-8 data points spanning from the current month to 3-5 years out, showing realistic compounding and cost effects. Make the breakdown categories specific to this scenario type.`;

  const result = await generateText({
    model: "google/gemini-2.5-flash-preview-05-20",
    prompt,
    output: Output.object({ schema: simulationOutputSchema }),
    abortSignal: req.signal,
  });

  return Response.json({ analysis: result.output });
}
