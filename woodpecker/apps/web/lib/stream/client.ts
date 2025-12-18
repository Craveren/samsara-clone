'use client'

import { StreamChat } from 'stream-chat'

// Initialize Stream client (frontend only)
const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY

if (!apiKey) {
  console.warn('NEXT_PUBLIC_STREAM_API_KEY is not defined')
}

export const streamClient = apiKey ? StreamChat.getInstance(apiKey) : null

// Types for Stream user
export interface StreamUser {
  id: string
  name: string
  email?: string
  role?: string
  image?: string
}

// Types for messages
export interface Message {
  id: string
  text: string
  user: StreamUser
  attachments?: Array<{
    type: string
    url: string
    name: string
  }>
  createdAt: Date
  updatedAt?: Date
}

// Helper to generate token
export async function generateToken(userId: string): Promise<string> {
  try {
    const response = await fetch('/api/stream/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })

    if (!response.ok) {
      throw new Error('Failed to generate token')
    }

    const data = await response.json()
    return data.token
  } catch (error) {
    console.error('Error generating token:', error)
    throw error
  }
}

// Helper to connect user
export async function connectUser(userId: string, userData: StreamUser) {
  if (!streamClient) {
    throw new Error('Stream client not initialized')
  }

  try {
    const token = await generateToken(userId)
    
    await streamClient.connectUser(
      {
        id: userId,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        image: userData.image
      },
      token
    )

    return streamClient
  } catch (error) {
    console.error('Error connecting user to Stream:', error)
    throw error
  }
}

// Helper to disconnect user
export function disconnectUser() {
  if (!streamClient) {
    return Promise.resolve()
  }

  try {
    return streamClient.disconnectUser()
  } catch (error) {
    console.error('Error disconnecting user:', error)
    return Promise.resolve()
  }
}

// Export the client instance
export default streamClient

