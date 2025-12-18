import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent, clerkClient } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db/client'
import { syncUserToDatabase } from '@/lib/auth/user-sync'
import { setAccountType } from '@/lib/auth/account-type-handler'

/**
 * Clerk Webhook Handler
 * Handles subscription events from Clerk
 */
export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env.local')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occurred', {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url, public_metadata } = evt.data

    // Get role from metadata (set during signup with account type)
    const role = (public_metadata as any)?.role || 'client'

    // Ensure role is set in Clerk metadata if not already set
    if (!public_metadata || !(public_metadata as any)?.role) {
      try {
        await setAccountType(id, role as any)
      } catch (error) {
        console.error('Error setting account type in metadata:', error)
      }
    }

    // Sync user to database with role detection
    try {
      const result = await syncUserToDatabase({
        id,
        email: email_addresses?.[0]?.email_address || '',
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
        publicMetadata: { ...(public_metadata as Record<string, any> || {}), role },
      })

      if (!result.success) {
        console.error('Error syncing user to database:', result.error)
      }
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url, public_metadata } = evt.data

    // Sync user to database (will update if exists, create if not)
    try {
      const result = await syncUserToDatabase({
        id,
        email: email_addresses?.[0]?.email_address || '',
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
        publicMetadata: public_metadata as Record<string, any> | undefined,
      })

      if (!result.success) {
        console.error('Error syncing user update:', result.error)
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  // Handle subscription events (when Clerk payment integration is set up)
  if (eventType === 'subscription.created' || eventType === 'subscription.updated') {
    const { id, user_id, status, price_id } = evt.data as any

    // Get user's actual type from Clerk metadata
    const clerkUser = await clerkClient.users.getUser(user_id)
    const userType = (clerkUser.publicMetadata?.role as string) || 'client'

    // Find user in appropriate table
    let user
    if (userType === 'client' || userType === 'family') {
      user = await prisma.client.findUnique({
        where: { clerkUserId: user_id },
      })
    } else {
      user = await prisma.professional.findUnique({
        where: { clerkUserId: user_id },
      })
    }

    if (user) {
      // Map userType to subscription userType
      const subscriptionUserType = userType === 'financial_advisor' ? 'financial_advisor' : 
                                   userType === 'executor' ? 'executor' :
                                   userType === 'agency' ? 'agency' :
                                   userType === 'lawyer' ? 'lawyer' : 'client'

      // Update or create subscription
      await prisma.subscription.upsert({
        where: {
          userId_userType: {
            userId: user.id,
            userType: subscriptionUserType,
          },
        },
        create: {
          userId: user.id,
          userType: subscriptionUserType,
          clerkSubscriptionId: id,
          clerkPriceId: price_id,
          status: status === 'active' ? 'active' : 'pending',
          tier: 'builder', // Map from price_id
          amount: 0, // Will be updated from Clerk
          currency: 'ZAR',
          interval: 'monthly',
        },
        update: {
          clerkSubscriptionId: id,
          clerkPriceId: price_id,
          status: status === 'active' ? 'active' : status,
        },
      })
    } else {
      console.warn('Subscription event for non-existent user; consider retry or backfill from Clerk API:', { userId: user_id, eventType })
    }
  }

  return new Response('', { status: 200 })
}

