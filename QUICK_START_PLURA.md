# 🚀 QUICK START: Transform Plura to Woodpecker

## ✅ What's Been Set Up

1. **Plura Reader MCP Server** (`mcp-servers/plura-reader.js`)
   - Reads from Plura GitHub repo: `denvudd/plura`
   - Also reads from local `../plura` if cloned
   - Provides tools to read files, list directories, find patterns, and get transformation guides

2. **Cursor Configuration** (`cursor-mcp-config.json`)
   - Ready to add to Cursor settings
   - Includes Plura reader, Clerk, and file-system MCPs

3. **Project Rules** (`.cursor/rules.mdc`)
   - Tells Cursor how to transform Plura to Woodpecker

## 🎯 Your First Steps

### Step 1: Get GitHub Token
1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Select `repo` scope
4. Copy token

### Step 2: Set Environment Variables
Create `.env.local` in project root:
```bash
GITHUB_TOKEN=ghp_your_token_here
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
```

### Step 3: Configure Cursor
1. Open Cursor Settings (Ctrl+,)
2. Search for "Model Context Protocol" or "MCP"
3. Click "Edit Config" or "Add Server"
4. Copy contents from `cursor-mcp-config.json`
5. Restart Cursor

### Step 4: Test Connection
In Cursor chat, type:
```
@cursor Use plura-reader to get Plura repository structure
```

## 📖 How to Use

### Read Plura Files
```
@cursor Read Plura file: package.json
@cursor Read Plura file: src/app/layout.tsx
@cursor Read Plura file: src/components/kanban/Board.tsx
@cursor Read Plura file: prisma/schema.prisma
```

### Get Transformation Guides
```
@cursor Transform Plura kanban to Woodpecker
@cursor Transform Plura auth to Woodpecker
@cursor Transform Plura database to Woodpecker
@cursor Transform Plura payment to Woodpecker
@cursor Transform Plura sidebar to Woodpecker
```

### Find Patterns
```
@cursor Find kanban pattern in Plura
@cursor Find sidebar pattern in Plura
@cursor Find table pattern in Plura
```

### Get Config Files
```
@cursor Get Plura config: package
@cursor Get Plura config: all
```

## 🔄 Transformation Workflow

### Example: Transform Kanban to Tasks

1. **Read Plura kanban:**
   ```
   @cursor Read Plura file: src/components/kanban/Board.tsx
   ```

2. **Get transformation guide:**
   ```
   @cursor Transform Plura kanban to Woodpecker
   ```

3. **Create Woodpecker version:**
   ```
   @cursor Create Woodpecker tasks component:
   - Based on Plura kanban structure
   - Update columns: Backlog → Estate Planning, Todo → Documents Needed, In Progress → In Review, Done → Completed
   - Add fields: beneficiary, document link, deadline type
   - Place in apps/web/components/tasks/Board.tsx
   ```

## 🎨 Complete Transformation Plan

### Phase 1: Structure & Config
- [ ] Get Plura structure
- [ ] Copy package.json and adapt
- [ ] Copy tsconfig.json
- [ ] Copy tailwind.config.ts (update colors)
- [ ] Copy turbo.json (update apps)

### Phase 2: Core Components
- [ ] Transform sidebar (navigation items)
- [ ] Transform layout (branding)
- [ ] Transform dashboard (legacy overview)

### Phase 3: Features
- [ ] Transform kanban → tasks
- [ ] Transform projects → legacies
- [ ] Transform auth (add roles)
- [ ] Transform database (rename models, add new)

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

1. **Always read first** - Understand Plura before transforming
2. **One feature at a time** - Don't try to do everything at once
3. **Test frequently** - Verify each transformation works
4. **Keep patterns** - Maintain Plura's code style
5. **Document changes** - Note what changed

## 🐛 Troubleshooting

### "MCP server not found"
- Check Cursor settings have MCP config
- Verify file paths in config are correct
- Restart Cursor

### "Can't read Plura"
- Verify GitHub token is set
- Check token has `repo` scope
- Try cloning Plura locally: `cd .. && git clone https://github.com/denvudd/plura.git`

### "Transformation unclear"
- Read the original Plura file first
- Use `transform_plura_to_woodpecker` tool
- Ask Cursor to explain step by step

## 📚 Next Steps

1. **Start now:**
   ```
   @cursor Get Plura structure
   ```

2. **Read key files:**
   ```
   @cursor Read Plura file: package.json
   @cursor Read Plura file: src/app/layout.tsx
   ```

3. **Begin transformation:**
   ```
   @cursor Transform Plura sidebar to Woodpecker
   ```

4. **Build:**
   ```
   @cursor Create Woodpecker sidebar based on Plura sidebar
   ```

---

**Ready?** Open Cursor and start with:
```
@cursor Get Plura repository structure
```

