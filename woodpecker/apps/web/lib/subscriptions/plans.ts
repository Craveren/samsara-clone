/**
 * Subscription Plans Configuration
 * Defines available subscription tiers and pricing
 */

export interface Plan {
  id: string
  name: string
  description: string
  tier: 'free' | 'builder' | 'professional' | 'enterprise'
  price: number
  currency: string
  interval: 'monthly' | 'yearly'
  features: string[]
  maxLegacies?: number
  maxDocuments?: number
  maxStorageGB?: number
  supportLevel: 'community' | 'email' | 'priority' | 'dedicated'
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    tier: 'free',
    price: 0,
    currency: 'ZAR',
    interval: 'monthly',
    features: [
      '1 Legacy',
      '10 Documents',
      'Basic estate planning tools',
      'Community support',
      'Basic financial tracking',
    ],
    maxLegacies: 1,
    maxDocuments: 10,
    maxStorageGB: 1,
    supportLevel: 'community',
  },
  {
    id: 'builder',
    name: 'Builder',
    description: 'For individuals and families',
    tier: 'builder',
    price: 299,
    currency: 'ZAR',
    interval: 'monthly',
    features: [
      'Unlimited Legacies',
      'Unlimited Documents',
      'Advanced estate planning tools',
      'Email support',
      'Full financial tracking',
      'AI-powered insights',
      'Document templates',
    ],
    maxLegacies: -1, // Unlimited
    maxDocuments: -1, // Unlimited
    maxStorageGB: 10,
    supportLevel: 'email',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For legal and financial professionals',
    tier: 'professional',
    price: 799,
    currency: 'ZAR',
    interval: 'monthly',
    features: [
      'Everything in Builder',
      'Client management',
      'Team collaboration',
      'Priority support',
      'Custom templates',
      'Advanced reporting',
      'API access',
    ],
    maxLegacies: -1,
    maxDocuments: -1,
    maxStorageGB: 50,
    supportLevel: 'priority',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For agencies and large organizations',
    tier: 'enterprise',
    price: 2499,
    currency: 'ZAR',
    interval: 'monthly',
    features: [
      'Everything in Professional',
      'Unlimited team members',
      'Dedicated support',
      'Custom integrations',
      'White-label options',
      'Advanced security',
      'SLA guarantee',
    ],
    maxLegacies: -1,
    maxDocuments: -1,
    maxStorageGB: 200,
    supportLevel: 'dedicated',
  },
]

/**
 * Get plan by ID
 */
export function getPlanById(planId: string): Plan | null {
  return PLANS.find(plan => plan.id === planId) || null
}

/**
 * Get plan by tier
 */
export function getPlanByTier(tier: Plan['tier']): Plan | null {
  return PLANS.find(plan => plan.tier === tier) || null
}

/**
 * Get all plans
 */
export function getAllPlans(): Plan[] {
  return PLANS
}

/**
 * Get plans for a specific user type
 */
export function getPlansForUserType(userType: 'client' | 'lawyer' | 'agency' | 'financial-advisor'): Plan[] {
  // All plans are available to all user types
  // In the future, we might want to restrict certain plans to certain user types
  return PLANS
}

/**
 * Calculate yearly price from monthly price
 */
export function getYearlyPrice(monthlyPrice: number): number {
  // Typically 2 months free when paying yearly
  return monthlyPrice * 10
}

/**
 * Get plan features as a formatted list
 */
export function getPlanFeatures(planId: string): string[] {
  const plan = getPlanById(planId)
  return plan?.features || []
}


