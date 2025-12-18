/**
 * Prisma Client Singleton
 * Ensures only one instance of Prisma Client is created
 * Prevents connection pool exhaustion in development
 * Gracefully handles missing database configuration
 */

let PrismaClient: any = null
try {
  PrismaClient = require('@prisma/client').PrismaClient
} catch (error) {
  console.warn('Prisma Client not found. Database features will be disabled.')
}

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

let prismaInstance: any = null

export const prisma = (() => {
  // If Prisma Client is not available, return a mock
  if (!PrismaClient) {
    return createMockPrisma()
  }

  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  if (prismaInstance) {
    return prismaInstance
  }

  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL not configured, using mock Prisma client')
      return createMockPrisma()
    }

    prismaInstance = new PrismaClient({
      log:
        process.env.NODE_ENV === 'development'
          ? ['error', 'warn']
          : ['error'],
    })

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prismaInstance
    }

    return prismaInstance
  } catch (error) {
    console.error('Failed to initialize Prisma Client:', error)
    return createMockPrisma()
  }
})()

function createMockPrisma() {
  const mockError = () => Promise.reject(new Error('Database not configured'))
  const mockEmptyArray = () => Promise.resolve([])
  const mockNull = () => Promise.resolve(null)
  
  // Mock transaction function for atomic operations
  const mockTransaction = async (callback: (tx: any) => Promise<any>) => {
    // Return a mock transaction object with all models
    const mockTx = {
      client: {
        findFirst: mockNull,
        findUnique: mockNull,
        findMany: mockEmptyArray,
        create: mockError,
        update: mockError,
        upsert: mockError,
      },
      professional: {
        findFirst: mockNull,
        findUnique: mockNull,
        findMany: mockEmptyArray,
        create: mockError,
        update: mockError,
      },
      activity: {
        findFirst: mockNull,
        findUnique: mockNull,
        findMany: mockEmptyArray,
        create: mockError,
        update: mockError,
      },
      bankAccount: {
        findFirst: mockNull,
        findUnique: mockNull,
        findMany: mockEmptyArray,
        create: mockError,
        update: mockError,
        delete: mockError,
      },
      transaction: {
        findFirst: mockNull,
        findUnique: mockNull,
        findMany: mockEmptyArray,
        create: mockError,
        update: mockError,
        delete: mockError,
      },
      legacy: {
        findFirst: mockNull,
        findUnique: mockNull,
        findMany: mockEmptyArray,
        create: mockError,
        update: mockError,
        delete: mockError,
      },
      conversation: {
        findFirst: mockNull,
        findUnique: mockNull,
        findMany: mockEmptyArray,
        create: mockError,
        update: mockError,
        delete: mockError,
      },
    }
    return callback(mockTx)
  }
  
  return {
    client: {
      findFirst: mockNull,
      findUnique: mockNull,
      findMany: mockEmptyArray,
      create: mockError,
      update: mockError,
      upsert: mockError,
    },
    professional: {
      findFirst: mockNull,
      findUnique: mockNull,
      findMany: mockEmptyArray,
      create: mockError,
      update: mockError,
    },
    activity: {
      findFirst: mockNull,
      findUnique: mockNull,
      findMany: mockEmptyArray,
      create: mockError,
      update: mockError,
    },
    bankAccount: {
      findFirst: mockNull,
      findUnique: mockNull,
      findMany: mockEmptyArray,
      create: mockError,
      update: mockError,
      delete: mockError,
    },
    transaction: {
      findFirst: mockNull,
      findUnique: mockNull,
      findMany: mockEmptyArray,
      create: mockError,
      update: mockError,
      delete: mockError,
    },
    legacy: {
      findFirst: mockNull,
      findUnique: mockNull,
      findMany: mockEmptyArray,
      create: mockError,
      update: mockError,
      delete: mockError,
    },
    conversation: {
      findFirst: mockNull,
      findUnique: mockNull,
      findMany: mockEmptyArray,
      create: mockError,
      update: mockError,
      delete: mockError,
    },
    message: {
      findFirst: mockNull,
      findUnique: mockNull,
      findMany: mockEmptyArray,
      create: mockError,
      update: mockError,
      delete: mockError,
    },
    $transaction: mockTransaction,
  } as any
}

