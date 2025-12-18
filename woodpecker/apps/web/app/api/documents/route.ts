/**
 * Documents API
 * Handle document CRUD operations
 */

import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db/client'
import { z } from 'zod'

const documentSchema = z.object({
  name: z.string().min(1),
  category: z.enum(['legal', 'financial', 'personal', 'medical', 'other']),
  description: z.string().optional(),
  size: z.number().positive(),
  url: z.string().url().optional(),
})

/**
 * GET /api/documents - Get all documents
 */
export async function GET(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if database is available
    if (!prisma.document || typeof prisma.document.findMany !== 'function') {
      console.log('Database not configured, returning empty documents')
      return NextResponse.json({ data: [] })
    }

    const documents = await prisma.document.findMany({
      where: { userId: user.id },
      orderBy: { uploadedAt: 'desc' },
    })

    return NextResponse.json({
      data: documents.map((doc) => ({
        id: doc.id,
        name: doc.name,
        category: doc.category,
        size: doc.size,
        uploadedAt: doc.uploadedAt.toISOString(),
        status: doc.status || 'pending',
        url: doc.url,
        description: doc.description,
      })),
    })
  } catch (error: any) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/documents - Create new document
 */
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validated = documentSchema.parse(body)

    // Check if database is available
    if (!prisma.document || typeof prisma.document.create !== 'function') {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const document = await prisma.document.create({
      data: {
        userId: user.id,
        name: validated.name,
        category: validated.category,
        description: validated.description,
        size: validated.size,
        url: validated.url,
        status: 'pending',
        uploadedAt: new Date(),
      },
    })

    return NextResponse.json(
      {
        data: {
          id: document.id,
          name: document.name,
          category: document.category,
          size: document.size,
          uploadedAt: document.uploadedAt.toISOString(),
          status: document.status,
          url: document.url,
          description: document.description,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating document:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create document' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/documents - Update document
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 })
    }

    // Verify document belongs to user
    const existingDocument = await prisma.document.findFirst({
      where: { id, userId: user.id },
    })

    if (!existingDocument) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    const updateData: any = {}
    if (updates.name) updateData.name = updates.name
    if (updates.category) updateData.category = updates.category
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.status) updateData.status = updates.status

    const document = await prisma.document.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      data: {
        id: document.id,
        name: document.name,
        category: document.category,
        size: document.size,
        uploadedAt: document.uploadedAt.toISOString(),
        status: document.status,
        url: document.url,
        description: document.description,
      },
    })
  } catch (error: any) {
    console.error('Error updating document:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update document' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/documents - Delete document
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 })
    }

    // Verify document belongs to user
    const existingDocument = await prisma.document.findFirst({
      where: { id, userId: user.id },
    })

    if (!existingDocument) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    await prisma.document.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete document' },
      { status: 500 }
    )
  }
}

