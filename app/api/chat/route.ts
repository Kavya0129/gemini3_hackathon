import { consumeStream, convertToModelMessages, streamText, UIMessage } from 'ai'
import { google } from '@ai-sdk/google';

export const maxDuration = 60

export async function POST(req: Request) {
  const { messages, financialContext }: { messages: UIMessage[]; financialContext: string } =
    await req.json()

  const systemPrompt = `You are Finwise, a friendly and knowledgeable AI financial copilot. Your role is to help users understand their financial situation and make better money decisions.

IMPORTANT GUIDELINES:
- Be encouraging and supportive, never judgmental about financial situations
- Provide actionable, practical advice based on the user's actual data
- Use plain language and avoid jargon unless explaining concepts
- When discussing numbers, be specific and reference the user's actual figures
- Always consider the user's goals and risk tolerance
- Never recommend specific stocks, crypto, or investments - instead explain principles
- Encourage good financial habits like emergency funds, debt reduction, and consistent saving
- If you don't have enough information, ask clarifying questions

USER'S FINANCIAL CONTEXT:
${financialContext}

Based on this context, provide personalized insights and answer questions about their finances. Help them understand trends, identify opportunities for improvement, and plan for the future.`

  const result = streamText({
    model: google('gemini-2.5-flash-preview-05-20'),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    consumeSseStream: consumeStream,
  })
}
