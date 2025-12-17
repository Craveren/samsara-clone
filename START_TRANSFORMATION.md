# 🚀 START TRANSFORMATION: Plura → Woodpecker

## ✅ You've Completed Steps 1-4
- GitHub token configured
- Environment variables set
- Cursor MCP configured
- Connection tested

## 🎯 Step 5: Use Cursor to Read Plura

### First, Test the Connection

In Cursor chat, type:

```
@cursor Use plura-reader MCP to get the complete structure of Plura repository
```

This will show you Plura's file structure.

### Step 6: Read Key Plura Files

Run these commands in Cursor one by one:

#### 6.1 Get All Config Files
```
@cursor Get Plura config: all
```

This reads:
- package.json
- tsconfig.json
- tailwind.config.ts
- next.config.js
- turbo.json (if exists)

#### 6.2 Read Plura Structure
```
@cursor Get Plura repository structure
```

#### 6.3 Read Key Files
```
@cursor Read Plura file: package.json
@cursor Read Plura file: src/app/layout.tsx
@cursor Read Plura file: src/app/page.tsx
```

## 🔄 Step 7: Start Transformation

### 7.1 Transform Sidebar (First Priority)

1. **Get transformation guide:**
   ```
   @cursor Transform Plura sidebar to Woodpecker
   ```

2. **Read Plura sidebar:**
   ```
   @cursor Read Plura file: src/components/sidebar/Sidebar.tsx
   ```
   (Or find the actual path if different)

3. **Create Woodpecker sidebar:**
   ```
   @cursor Create Woodpecker sidebar based on Plura sidebar:
   - Copy the structure and patterns
   - Update navigation items:
     * Dashboard
     * My Legacy Journey (instead of Projects)
     * Document Vault
     * People & Family
     * Tasks (from Kanban)
     * Interview
     * Services
   - Add legacy completion percentage
   - Keep the same styling and behavior
   - Place in: packages/ui/sidebar.tsx
   ```

### 7.2 Transform Kanban → Tasks

1. **Get transformation guide:**
   ```
   @cursor Transform Plura kanban to Woodpecker
   ```

2. **Find kanban files:**
   ```
   @cursor Find kanban pattern in Plura
   ```

3. **Read kanban component:**
   ```
   @cursor Read Plura file: src/components/kanban/Board.tsx
   ```
   (Adjust path based on what you find)

4. **Create Woodpecker tasks:**
   ```
   @cursor Create Woodpecker tasks component based on Plura kanban:
   - Copy drag & drop structure
   - Update columns:
     * Backlog → Estate Planning Tasks
     * Todo → Documents Needed
     * In Progress → In Review
     * Done → Completed
   - Add Woodpecker fields: beneficiary, document link, deadline type
   - Place in: apps/web/components/tasks/Board.tsx
   ```

### 7.3 Transform Database Schema

1. **Get transformation guide:**
   ```
   @cursor Transform Plura database to Woodpecker
   ```

2. **Read Prisma schema:**
   ```
   @cursor Read Plura file: prisma/schema.prisma
   ```

3. **Create Woodpecker schema:**
   ```
   @cursor Create Woodpecker Prisma schema based on Plura:
   - Transform models:
     * Project → Legacy
     * Task → EstateTask
     * User → Client/Professional/Executor
   - Add new models:
     * Memory (voice stories)
     * Document (wills, trusts)
     * Beneficiary
     * Execution (post-death workflow)
     * Transmission (scheduled releases)
   - Keep relationships and patterns
   - Place in: packages/database/schema.prisma
   ```

## 📋 Transformation Checklist

### Phase 1: Foundation ✅
- [x] MCP setup complete
- [ ] Read Plura structure
- [ ] Copy and adapt package.json
- [ ] Copy and adapt tsconfig.json
- [ ] Copy and adapt tailwind.config.ts

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
- [ ] Transform Stripe → PayFast
- [ ] Update subscription plans
- [ ] Add SA-specific features

### Phase 5: New Features
- [ ] Add Memory Galaxy (3D)
- [ ] Add Midnight Interview
- [ ] Add Document Vault
- [ ] Add Execution Service

## 💡 Pro Tips

1. **One feature at a time** - Don't try to do everything at once
2. **Read first, then transform** - Always understand Plura's implementation
3. **Test frequently** - Verify each transformation works
4. **Keep patterns** - Maintain Plura's code style and structure
5. **Ask Cursor** - If something is unclear, ask Cursor to explain

## 🐛 Troubleshooting

### "Can't read Plura file"
- Check GitHub token is set correctly
- Verify the file path exists in Plura
- Try listing the directory first: `@cursor List Plura directory: src/components`

### "Transformation unclear"
- Read the original Plura file first
- Use the transformation guide tool
- Ask Cursor to explain step by step

### "MCP not working"
- Restart Cursor
- Check MCP config in Cursor settings
- Verify environment variables

## 🎬 Next Action

**Right now, in Cursor, type:**

```
@cursor Get Plura repository structure
```

Then share what you see, and we'll continue from there!

