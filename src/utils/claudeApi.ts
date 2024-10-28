import { Anthropic } from '@anthropic-ai/sdk'
import debounce from 'lodash/debounce'

// Constants
const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY
const MAX_RETRIES = 5
const RETRY_DELAY = 2000
const MAX_CONTENT_LENGTH = 100000

const anthropic = new Anthropic({
  apiKey: CLAUDE_API_KEY,
})

// Helper to extract exam type from content
function extractExamType(content: string): string {
  return content.split('\n')[0] || ''
}

// Get appropriate prompt based on action type
function getPromptForAction(action: string): string {
  switch (action) {
    case "Generate Report":
      return `You are an experienced radiologist. Analyze this exam and generate a complete professional report following the structure:
1. Technique used
2. Detailed findings analysis
3. Diagnostic impression (if needed)

Use precise radiological terminology, include measurements when relevant, and be concise.`

    case "Follow-up Recommendations":
      return `As an experienced radiologist, provide follow-up recommendations including:
1. Next necessary exams
2. Suggested time intervals
3. Recommended complementary exams
4. Specific referrals if needed`

    case "Generate Impressions":
      return `As an experienced radiologist, provide a concise diagnostic impression:
1. List only the most relevant findings
2. Order by clinical importance
3. Use a dash (-) at the beginning of each line
4. Be objective and precise`

    case "Enhance Report":
      return `As an experienced radiologist, enhance this report by adding:
1. More precise technical details
2. Specific measurements
3. More specialized radiological terminology
4. Important anatomical correlations
5. Relevant negative findings`

    default:
      return "You are an experienced radiology assistant. Provide clear and professional responses."
  }
}

// Main API call function with retries and debouncing
export const generateClaudeResponse = async (content: string, action: string): Promise<string> => {
  const debouncedApiCall = debounce(async () => {
    try {
      const systemPrompt = getPromptForAction(action)
      const examType = extractExamType(content)

      const response = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1024,
        temperature: 0.7,
        messages: [
          {
            role: "user",
            content: `${systemPrompt}\n\nExam Type: ${examType}\n\nContent:\n${content}`
          }
        ]
      })

      return response.content[0].text

    } catch (error) {
      console.error('Claude API Error:', error)
      throw error
    }
  }, 1000)

  // Validate content length
  if (!content || content.length > MAX_CONTENT_LENGTH) {
    throw new Error('Invalid or too long content')
  }

  // Execute API call with retries
  let lastError: Error | null = null
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const result = await debouncedApiCall()
      if (result) return result
      throw new Error('Empty response from API')
    } catch (error) {
      lastError = error as Error
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, attempt)))
    }
  }

  throw lastError || new Error('Failed after multiple retries')
}

// Fallback responses if API fails
export function generateFallbackResponse(action: string): string {
  const fallbacks: Record<string, string> = {
    "Generate Report": "Não foi possível gerar o laudo no momento. Por favor, tente novamente.",
    "Follow-up Recommendations": "Não foi possível gerar recomendações. Consulte um radiologista.",
    "Generate Impressions": "Não foi possível gerar impressões. Revise o laudo original.",
    "Enhance Report": "Não foi possível aprimorar o laudo. Mantenha a versão atual."
  }
  
  return fallbacks[action] || "Serviço temporariamente indisponível."
}
