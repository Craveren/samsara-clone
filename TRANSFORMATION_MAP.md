# 🗺️ Plura → Woodpecker Transformation Map

## File Mapping Guide

This document maps every Plura file to its Woodpecker equivalent.

---

## 📦 Step 1: Package.json Transformation

### Source
- `plura-files/package.json` → `woodpecker/package.json`

### Changes
```json
{
  "name": "woodpecker",  // was "plura"
  "description": "Legacy preservation platform",
  "dependencies": {
    // Keep: React, Next.js, TypeScript, Tailwind
    // Remove: Plura-specific packages
    // Add: @clerk/nextjs, @supabase/supabase-js, three, @react-three/fiber
  }
}
```

---

## 🎨 Step 2: Sidebar Transformation

### Source Files
- `plura-files/src/components/sidebar/Sidebar.tsx`
- `plura-files/src/components/layout/Sidebar.tsx`
- `plura-files/src/app/components/Sidebar.tsx`

### Destination
- `woodpecker/packages/ui/src/sidebar/Sidebar.tsx`

### Changes
```tsx
// OLD (Plura)
const navItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Projects', href: '/projects' },
  { name: 'Kanban', href: '/kanban' },
  { name: 'Users', href: '/users' },
]

// NEW (Woodpecker)
const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'My Legacy Journey', href: '/legacy', icon: BookOpen },
  { name: 'Document Vault', href: '/documents', icon: Folder },
  { name: 'People & Family', href: '/people', icon: Users },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Interview', href: '/interview', icon: Mic },
  { name: 'Services', href: '/services', icon: Sparkles },
]
```

---

## 📋 Step 3: Kanban → Tasks Transformation

### Source Files
- `plura-files/src/components/kanban/Board.tsx`
- `plura-files/src/app/kanban/page.tsx`
- `plura-files/src/components/kanban/Column.tsx`
- `plura-files/src/components/kanban/TaskCard.tsx`

### Destination
- `woodpecker/apps/web/components/tasks/Board.tsx`
- `woodpecker/apps/web/components/tasks/Column.tsx`
- `woodpecker/apps/web/components/tasks/TaskCard.tsx`
- `woodpecker/apps/web/app/tasks/page.tsx`

### Column Changes
```tsx
// OLD (Plura)
const columns = ['Backlog', 'Todo', 'In Progress', 'Done']

// NEW (Woodpecker)
const columns = [
  { id: 'backlog', name: 'Estate Planning Tasks', color: 'bg-gray-100' },
  { id: 'todo', name: 'Documents Needed', color: 'bg-blue-50' },
  { id: 'in-progress', name: 'In Review', color: 'bg-amber-50' },
  { id: 'done', name: 'Completed', color: 'bg-green-50' },
]
```

### Task Model Changes
```tsx
// OLD (Plura)
interface Task {
  id: string
  title: string
  description: string
  assignee: string
  dueDate: Date
}

// NEW (Woodpecker)
interface EstateTask {
  id: string
  title: string
  description: string
  assignee: string
  beneficiary?: string  // NEW
  documentId?: string   // NEW
  deadlineType?: 'legal' | 'personal' | 'financial'  // NEW
  dueDate: Date
  legacyId: string      // Links to Legacy (was Project)
}
```

---

## 🔐 Step 4: Auth Transformation

### Source Files
- `plura-files/src/lib/auth/`
- `plura-files/src/middleware.ts`
- `plura-files/src/app/api/auth/`

### Destination
- `woodpecker/packages/auth/src/clerk.ts`
- `woodpecker/apps/web/middleware.ts`
- `woodpecker/apps/web/app/api/auth/`

### Role Changes
```tsx
// OLD (Plura)
type Role = 'admin' | 'user' | 'viewer'

// NEW (Woodpecker)
type Role = 'client' | 'professional' | 'executor' | 'family' | 'admin'
```

### Route Protection
```tsx
// OLD (Plura)
protectedRoutes: ['/dashboard', '/projects', '/kanban']

// NEW (Woodpecker)
protectedRoutes: {
  client: ['/dashboard', '/legacy', '/documents', '/tasks'],
  professional: ['/pro/dashboard', '/pro/clients'],
  executor: ['/executor/dashboard'],
  family: ['/family/memories'],
}
```

---

## 💾 Step 5: Database Transformation

### Source
- `plura-files/prisma/schema.prisma`

### Destination
- `woodpecker/packages/database/schema.prisma`

### Model Transformations

#### Projects → Legacies
```prisma
// OLD (Plura)
model Project {
  id        String   @id @default(cuid())
  name      String
  tasks     Task[]
  users     User[]
}

// NEW (Woodpecker)
model Legacy {
  id          String       @id @default(cuid())
  name        String
  clientId    String
  client      Client       @relation(fields: [clientId], references: [id])
  tasks       EstateTask[]
  memories    Memory[]
  documents   Document[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}
```

#### Tasks → EstateTasks
```prisma
// OLD (Plura)
model Task {
  id          String   @id @default(cuid())
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id])
  title       String
  description String?
}

// NEW (Woodpecker)
model EstateTask {
  id          String   @id @default(cuid())
  legacyId    String
  legacy      Legacy   @relation(fields: [legacyId], references: [id])
  title       String
  description String?
  beneficiary String?
  documentId  String?
  deadlineType String?  // 'legal' | 'personal' | 'financial'
  status      String   @default("backlog")
  dueDate     DateTime?
}
```

#### New Models for Woodpecker
```prisma
model Memory {
  id          String   @id @default(cuid())
  legacyId    String
  legacy      Legacy   @relation(fields: [legacyId], references: [id])
  title       String
  audioUrl    String?
  transcript  String?
  photos      String[]  // Array of URLs
  scheduledRelease DateTime?
  createdAt   DateTime @default(now())
}

model Document {
  id          String   @id @default(cuid())
  legacyId    String
  legacy      Legacy   @relation(fields: [legacyId], references: [id])
  name        String
  fileUrl     String
  category    String   // 'will' | 'trust' | 'healthcare' | 'financial'
  status      String   @default("draft")  // 'draft' | 'signed' | 'expired'
  createdAt   DateTime @default(now())
}

model Beneficiary {
  id          String   @id @default(cuid())
  legacyId    String
  legacy      Legacy   @relation(fields: [legacyId], references: [id])
  name        String
  email       String?
  relationship String
  allocation  Float?   // Percentage or amount
  contactInfo Json?
}

model Execution {
  id          String   @id @default(cuid())
  legacyId    String
  legacy      Legacy   @relation(fields: [legacyId], references: [id])
  executorId  String
  status      String   @default("pending")
  verifiedAt  DateTime?
  startedAt   DateTime?
  completedAt DateTime?
}
```

---

## 💳 Step 6: Payments Transformation

### Source Files (Remove)
- `plura-files/src/lib/stripe/`
- `plura-files/src/app/api/stripe/`

### Destination (Create New)
- `woodpecker/packages/payments/src/payfast.ts`
- `woodpecker/apps/web/app/api/payfast/route.ts`

### Stripe → PayFast Changes
```tsx
// OLD (Plura - Stripe)
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// NEW (Woodpecker - PayFast)
import crypto from 'crypto'
class PayFastService {
  private merchantId: string
  private merchantKey: string
  private passphrase: string
  // ... PayFast implementation
}
```

---

## 📁 Complete File Structure Map

```
plura-files/                          →  woodpecker/
├── package.json                     →  package.json (root)
├── tsconfig.json                    →  tsconfig.json (root)
├── tailwind.config.ts               →  apps/web/tailwind.config.ts
├── next.config.js                   →  apps/web/next.config.js
│
├── src/
│   ├── app/
│   │   ├── layout.tsx               →  apps/web/app/layout.tsx
│   │   ├── page.tsx                 →  apps/web/app/page.tsx
│   │   └── api/                     →  apps/web/app/api/
│   │
│   ├── components/
│   │   ├── sidebar/                 →  packages/ui/src/sidebar/
│   │   ├── kanban/                  →  apps/web/components/tasks/
│   │   ├── table/                   →  packages/ui/src/table/
│   │   └── ui/                      →  packages/ui/src/components/
│   │
│   └── lib/
│       ├── auth/                    →  packages/auth/src/
│       ├── db/                      →  packages/database/src/
│       └── utils/                   →  packages/utils/src/
│
└── prisma/
    └── schema.prisma                →  packages/database/schema.prisma
```

---

## 🎯 Transformation Checklist

### Phase 1: Foundation
- [ ] Transform package.json
- [ ] Transform tsconfig.json
- [ ] Transform tailwind.config.ts
- [ ] Transform next.config.js
- [ ] Set up turbo.json

### Phase 2: Core Components
- [ ] Transform sidebar
- [ ] Transform layout
- [ ] Transform dashboard

### Phase 3: Features
- [ ] Transform kanban → tasks
- [ ] Transform projects → legacies
- [ ] Transform auth (add roles)
- [ ] Transform database schema

### Phase 4: Payments
- [ ] Remove Stripe
- [ ] Add PayFast
- [ ] Update subscription logic

### Phase 5: New Features
- [ ] Add Memory model
- [ ] Add Document model
- [ ] Add Beneficiary model
- [ ] Add Execution model

---

## 🚀 Ready to Transform?

Run this to start:
```powershell
# Check what we have
cd woodpecker/plura-files
dir

# Then I'll transform each file
```

