import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

// Extract financial context from user message
function extractFinancialContext(message: string): any {
  const context: any = {}
  
  // Extract numbers (could be amounts)
  const amounts = message.match(/R?\s*[\d,]+(?:\.\d{2})?/g) || []
  if (amounts.length > 0) {
    context.amounts = amounts.map(a => a.replace(/[R\s,]/g, ''))
  }
  
  // Detect financial keywords
  const keywords = {
    balance: /balance|total|net worth/i.test(message),
    savings: /savings|save|emergency fund/i.test(message),
    investment: /investment|invest|portfolio/i.test(message),
    expense: /expense|spending|cost/i.test(message),
    income: /income|earn|salary/i.test(message),
    budget: /budget|planning|plan/i.test(message),
  }
  
  context.keywords = keywords
  return context
}

// Generate intelligent fallback response
function generateFallbackResponse(message: string, context: any): string {
  const { keywords } = context
  
  if (keywords.balance || /balance|total|net worth/i.test(message)) {
    return `Based on your financial accounts, I can help you understand your total balance and net worth. Your accounts are tracked in real-time, and I can provide insights on how to optimize your financial position.

**Key Recommendations:**
• Review your account balances regularly
• Consider diversifying across different account types
• Maintain an emergency fund of 3-6 months expenses
• Consult with a financial advisor for personalized estate planning

Would you like me to analyze a specific aspect of your finances?`
  }
  
  if (keywords.savings || /savings|save/i.test(message)) {
    return `Great question about savings! Here are some strategies for South African investors:

**Savings Strategies:**
• **Emergency Fund**: Aim for 3-6 months of expenses in a high-yield savings account
• **Tax-Free Savings**: Consider a Tax-Free Savings Account (TFSA) - up to R36,000/year
• **Retirement Savings**: Maximize contributions to retirement annuities (RAs) for tax benefits
• **Goal-Based Savings**: Separate savings for different goals (emergency, retirement, major purchases)

**Estate Planning Tip**: Ensure your savings accounts are properly designated in your will to avoid delays in probate.

What specific savings goal would you like to focus on?`
  }
  
  if (keywords.investment || /investment|invest|portfolio/i.test(message)) {
    return `Investment planning is crucial for estate building. Here's what I recommend:

**Investment Considerations for Estate Planning:**
• **Diversification**: Spread investments across asset classes (equities, bonds, property)
• **Tax Efficiency**: Consider tax-free investments and retirement annuities
• **Long-term Focus**: Estate planning requires a long-term investment horizon
• **Professional Advice**: Consult a certified financial planner for personalized strategies

**South African Context:**
• Consider local unit trusts and ETFs
• Explore property investment for estate growth
• Review your investment portfolio annually
• Ensure investments are properly documented in your estate plan

Would you like guidance on a specific investment type?`
  }
  
  if (keywords.budget || /budget|planning|plan/i.test(message)) {
    return `Budgeting is the foundation of good financial planning. Here's a framework:

**Budget Planning Steps:**
1. **Track Income**: Document all sources of income
2. **Categorize Expenses**: Group expenses (housing, food, transport, etc.)
3. **Set Goals**: Define short-term and long-term financial goals
4. **Monitor & Adjust**: Review monthly and adjust as needed

**Estate Planning Budget:**
• Allocate funds for will creation and updates
• Budget for professional fees (lawyers, financial advisors)
• Plan for estate taxes and administration costs
• Consider life insurance premiums

**50/30/20 Rule (Adapted for SA):**
• 50% for needs (housing, utilities, food)
• 30% for wants (entertainment, dining)
• 20% for savings and debt repayment

I can help you create a detailed budget based on your account data. Would you like to start?`
  }
  
  // Default helpful response
  return `I'm your AI financial assistant for estate planning in South Africa. I can help you with:

**Financial Analysis:**
• Account balances and summaries
• Spending patterns and trends
• Savings recommendations
• Investment guidance

**Estate Planning:**
• Will preparation checklist
• Asset documentation
• Beneficiary planning
• Tax optimization strategies

**Next Steps:**
Try asking me:
• "What's my current financial position?"
• "How can I improve my savings?"
• "What should I know about estate planning?"
• "Analyze my spending patterns"

I'm here to help you make informed financial decisions!`
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { message, conversationHistory } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Validate conversationHistory structure
    if (conversationHistory !== undefined) {
      if (!Array.isArray(conversationHistory)) {
        return NextResponse.json(
          { error: 'conversationHistory must be an array' },
          { status: 400 }
        )
      }
      
      // Validate each message has correct structure and prevent system role injection
      for (const msg of conversationHistory) {
        if (!msg || typeof msg !== 'object' || !msg.role || !msg.content) {
          return NextResponse.json(
            { error: 'Invalid message format in conversationHistory' },
            { status: 400 }
          )
        }
        // Only allow 'user' and 'assistant' roles from client
        if (msg.role !== 'user' && msg.role !== 'assistant') {
          return NextResponse.json(
            { error: 'Invalid role in conversationHistory' },
            { status: 400 }
          )
        }
        if (typeof msg.content !== 'string') {
          return NextResponse.json(
            { error: 'Message content must be a string' },
            { status: 400 }
          )
        }
      }
    }

    // Check if OpenAI API key is configured from .env.local
    // Next.js automatically loads .env.local, .env.development, .env.production
    const openaiKey = process.env.OPENAI_API_KEY
    const hasOpenAIKey = openaiKey && openaiKey.trim() !== '' && openaiKey !== 'test' && openaiKey !== 'your-api-key-here'
    
    // Log for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('[AI Chat] OpenAI API Key configured:', hasOpenAIKey ? 'Yes' : 'No (using fallback)')
    }
    
    if (!hasOpenAIKey) {
      // Test/fallback AI response - intelligent financial assistant
      const lowerMessage = message.toLowerCase()
      
      // Extract financial context from message
      const financialContext = extractFinancialContext(message)
      
      // Generate intelligent response based on message content
      let response = generateFallbackResponse(lowerMessage, financialContext)
      
      return NextResponse.json({ response })
    }

    // Call OpenAI API
    try {
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are Woodpecker AI, a financial assistant for estate planning and personal finance in South Africa. Provide helpful, accurate, and empathetic financial advice. Always recommend consulting with professionals for important decisions.`
            },
            ...(conversationHistory || []),
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      })

      if (!openaiResponse.ok) {
        const error = await openaiResponse.json().catch(() => ({}))
        console.error('OpenAI API Error:', error)
        // Fallback to test response on API error
        const lowerMessage = message.toLowerCase()
        const financialContext = extractFinancialContext(message)
        const response = generateFallbackResponse(lowerMessage, financialContext)
        return NextResponse.json({ response })
      }

      const data = await openaiResponse.json()
      const response = data.choices[0]?.message?.content || 'I apologize, but I could not generate a response.'

      return NextResponse.json({ response })
    } catch (apiError) {
      console.error('OpenAI API Request Error:', apiError)
      // Fallback to test response on network error
      const lowerMessage = message.toLowerCase()
      const financialContext = extractFinancialContext(message)
      const response = generateFallbackResponse(lowerMessage, financialContext)
      return NextResponse.json({ response })
    }
    
  } catch (error) {
    console.error('AI Chat Error:', error)
    
    return NextResponse.json({
      response: "I apologize, but I'm experiencing technical difficulties. Please try again in a few moments or contact support if the issue persists."
    })
  }
}

