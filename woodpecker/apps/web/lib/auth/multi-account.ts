/**
 * Multi-Account Support
 * Allows same email to have multiple account types (client, lawyer, executor, agency)
 * Each account type is a separate Clerk user identity
 * Also supports sub-accounts for professionals
 */

import { prisma } from '@/lib/db/client'
import { UserRole } from '@/lib/middleware/access-control'
import { getSubAccounts, getParentTeams } from './sub-accounts'

export interface AccountIdentity {
  clerkUserId: string
  email: string
  role: UserRole
  accountId: string // Database ID (client.id, professional.id, executor.id)
  createdAt: Date
  isSubAccount?: boolean // Whether this is a sub-account of another professional
  parentAccountId?: string // Parent professional ID if sub-account
}

/**
 * Get all account identities for an email address
 * Allows users to see all their accounts across different types
 */
export async function getAccountsForEmail(email: string): Promise<AccountIdentity[]> {
  const accounts: AccountIdentity[] = []

  // Find all clients with this email
  const clients = await prisma.client.findMany({
    where: { email },
    select: { id: true, clerkUserId: true, email: true, createdAt: true },
  })
  accounts.push(
    ...clients.map((c) => ({
      clerkUserId: c.clerkUserId,
      email: c.email,
      role: 'client' as UserRole,
      accountId: c.id,
      createdAt: c.createdAt,
    }))
  )

  // Find all professionals with this email
  const professionals = await prisma.professional.findMany({
    where: { email },
    select: { id: true, clerkUserId: true, email: true, role: true, createdAt: true },
  })
  
  for (const p of professionals) {
    // Check if this is a sub-account
    const teamMember = await prisma.teamMember.findFirst({
      where: { subAccountId: p.id },
      select: { professionalId: true },
    })
    
    accounts.push({
      clerkUserId: p.clerkUserId,
      email: p.email,
      role: (p.role === 'agency' ? 'agency' : p.role === 'financial-advisor' ? 'financial-advisor' : 'lawyer') as UserRole,
      accountId: p.id,
      createdAt: p.createdAt,
      isSubAccount: !!teamMember,
      parentAccountId: teamMember?.professionalId,
    })
  }

  // Find all executors with this email
  const executors = await prisma.executor.findMany({
    where: { email },
    select: { id: true, clerkUserId: true, email: true, createdAt: true },
  })
  accounts.push(
    ...executors.map((e) => ({
      clerkUserId: e.clerkUserId,
      email: e.email,
      role: 'executor' as UserRole,
      accountId: e.id,
      createdAt: e.createdAt,
    }))
  )

  return accounts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

/**
 * Check if an email already has an account of a specific type
 */
export async function hasAccountType(email: string, role: UserRole): Promise<boolean> {
  if (role === 'client') {
    const client = await prisma.client.findFirst({ where: { email } })
    return !!client
  }
  if (role === 'lawyer' || role === 'agency') {
    const professional = await prisma.professional.findFirst({
      where: { email, role: role === 'agency' ? 'agency' : 'lawyer' },
    })
    return !!professional
  }
  if (role === 'executor') {
    const executor = await prisma.executor.findFirst({ where: { email } })
    return !!executor
  }
  return false
}

/**
 * Get invitation link for accepting invitation as a specific account type
 * If user already has that account type, they can accept directly
 * If not, they need to sign up first with that account type
 */
export function getInvitationAcceptUrl(token: string, recipientEmail: string, recipientType: UserRole): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  // If user needs to sign up, redirect to signup with account type
  // If user already has account, redirect to accept page
  return `${baseUrl}/invitations/accept/${token}?email=${encodeURIComponent(recipientEmail)}&type=${recipientType}`
}







