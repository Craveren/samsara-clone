# TRANSFORM PLURA TO WOODPECKER - COMPLETE GUIDE

## Overview
This guide shows how to transform the Plura repository into Woodpecker using Cursor with MCP.

## Step 1: Set Up MCP to Read Plura

### 1.1 Install Dependencies
```bash
npm install -D @modelcontextprotocol/sdk octokit
```

### 1.2 Set Environment Variables
Create `.env.local`:
```bash
GITHUB_TOKEN=ghp_your_token_here
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
```

### 1.3 Clone Plura (Optional - for local access)
```bash
# Clone Plura to parent directory
cd ..
git clone https://github.com/denvudd/plura.git
cd Samsara_Clone-master
```

## Step 2: Use Cursor to Read Plura

### 2.1 Read Plura Structure
In Cursor, use:
```
@cursor Use plura-reader MCP to get the complete structure of Plura repository
```

### 2.2 Read Specific Files
```
@cursor Read Plura file: package.json
@cursor Read Plura file: src/app/layout.tsx
@cursor Read Plura file: src/components/kanban/Board.tsx
```

### 2.3 Find Patterns
```
@cursor Find kanban pattern in Plura
@cursor Find sidebar pattern in Plura
@cursor Find auth pattern in Plura
```

## Step 3: Transform Features

### 3.1 Transform Kanban → Tasks
```
@cursor Transform Plura kanban to Woodpecker tasks:
1. Read Plura kanban components
2. Adapt for estate planning tasks
3. Update columns and data model
4. Create in apps/web/components/tasks/
```

### 3.2 Transform Auth → Woodpecker Auth
```
@cursor Transform Plura auth to Woodpecker:
1. Read Plura auth setup
2. Add Woodpecker roles (Client, Professional, Executor, Family)
3. Update middleware for role-based routes
4. Create in packages/auth/
```

### 3.3 Transform Database → Woodpecker Schema
```
@cursor Transform Plura database to Woodpecker:
1. Read Plura Prisma schema
2. Transform models:
   - Projects → Legacies
   - Tasks → Estate Tasks
   - Users → Clients/Professionals
3. Add new models: Memories, Documents, Beneficiaries, Executions
4. Create in packages/database/schema.prisma
```

### 3.4 Transform Payments → PayFast
```
@cursor Transform Plura Stripe to Woodpecker PayFast:
1. Read Plura payment integration
2. Replace Stripe with PayFast
3. Update for South Africa (RAND, SA banks)
4. Create in packages/payments/payfast.ts
```

## Step 4: Copy and Adapt Components

### 4.1 Sidebar
```
@cursor Read Plura sidebar and create Woodpecker sidebar:
1. Read: src/components/sidebar/Sidebar.tsx
2. Update navigation items for Woodpecker
3. Add legacy completion percentage
4. Create: packages/ui/sidebar.tsx
```

### 4.2 Layout
```
@cursor Read Plura layout and adapt for Woodpecker:
1. Read: src/app/layout.tsx
2. Keep structure, update branding
3. Add Woodpecker providers
4. Create: apps/web/app/layout.tsx
```

### 4.3 Pages
```
@cursor Read Plura pages and transform:
1. Dashboard → Legacy Dashboard
2. Projects → My Legacy Journey
3. Tasks → Estate Planning Tasks
4. Settings → Woodpecker Settings
```

## Step 5: Add Woodpecker-Specific Features

### 5.1 Memory Galaxy
```
@cursor Create 3D Memory Galaxy component:
- Use Three.js (install if needed)
- Display memories as floating orbs
- Click to play voice stories
- Create: apps/web/components/galaxy/GalaxyScene.tsx
```

### 5.2 Midnight Interview
```
@cursor Create Midnight Interview feature:
- Voice recording component
- Real-time transcription
- AI follow-up questions
- Create: apps/web/app/interview/page.tsx
```

### 5.3 Document Vault
```
@cursor Create Document Vault:
- Category grid (Wills, Healthcare, etc.)
- File upload to Supabase Storage
- Preview modal
- Create: apps/web/app/documents/page.tsx
```

## Step 6: Configuration Files

### 6.1 Copy Plura Configs
```
@cursor Get all Plura config files and adapt:
1. package.json → Update dependencies
2. tsconfig.json → Keep structure
3. tailwind.config.ts → Update colors for Woodpecker
4. next.config.js → Keep settings
5. turbo.json → Update for Woodpecker apps
```

## Step 7: Database Migration

### 7.1 Transform Schema
```
@cursor Transform Plura Prisma schema:
1. Read: prisma/schema.prisma
2. Rename models (Project → Legacy, etc.)
3. Add Woodpecker models
4. Update relationships
5. Create: packages/database/schema.prisma
```

## Step 8: Testing

### 8.1 Test Transformations
```
@cursor Test transformed features:
1. Verify kanban → tasks works
2. Test auth with Woodpecker roles
3. Check PayFast integration
4. Validate database schema
```

## Quick Reference: Cursor Commands

### Reading Plura
- `@cursor Read Plura file: [path]`
- `@cursor List Plura directory: [path]`
- `@cursor Get Plura structure`
- `@cursor Find [pattern] in Plura`

### Transforming
- `@cursor Transform Plura [feature] to Woodpecker`
- `@cursor Copy Plura [component] and adapt for Woodpecker`
- `@cursor Get Plura config: [type]`

### Building
- `@cursor Create Woodpecker [feature] based on Plura [feature]`
- `@cursor Adapt Plura [component] for Woodpecker use case`

## Example Workflow

1. **Start with structure:**
   ```
   @cursor Get Plura structure
   ```

2. **Read a feature:**
   ```
   @cursor Read Plura file: src/components/kanban/Board.tsx
   ```

3. **Get transformation guide:**
   ```
   @cursor Transform Plura kanban to Woodpecker
   ```

4. **Create adapted version:**
   ```
   @cursor Create Woodpecker tasks component based on Plura kanban:
   - Copy structure
   - Update columns for estate planning
   - Add Woodpecker-specific fields
   - Place in apps/web/components/tasks/
   ```

5. **Test:**
   ```
   @cursor Review the created component and suggest improvements
   ```

## Tips

1. **Always read Plura first** - Understand the original before transforming
2. **Keep patterns** - Maintain Plura's code style and patterns
3. **Adapt gradually** - Transform one feature at a time
4. **Test frequently** - Verify each transformation works
5. **Document changes** - Note what changed from Plura

## Troubleshooting

### MCP not connecting?
- Check `.cursor/mcp.json` exists
- Verify environment variables
- Check file paths are correct

### Can't read Plura?
- Verify GitHub token is set
- Check Plura repo path is correct
- Try local path if GitHub fails

### Transformation unclear?
- Read the original Plura file first
- Use `transform_plura_to_woodpecker` tool
- Ask Cursor to explain the pattern

