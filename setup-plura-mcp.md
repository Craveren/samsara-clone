# SETUP PLURA MCP FOR CURSOR

## Quick Setup

### Step 1: Install Dependencies
```bash
npm install -D @modelcontextprotocol/sdk octokit
```

### Step 2: Set Environment Variables
Create `.env.local` in your project root:
```bash
GITHUB_TOKEN=ghp_your_github_token_here
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
```

### Step 3: Configure Cursor MCP

**Option A: Global Cursor Config (Recommended)**
1. Open Cursor Settings
2. Go to "Features" → "Model Context Protocol"
3. Add the configuration from `cursor-mcp-config.json`

**Option B: Project Config**
1. Create `.cursor/mcp.json` in your project root
2. Copy contents from `cursor-mcp-config.json`

### Step 4: Clone Plura (Optional - for faster local access)
```bash
# From your project root
cd ..
git clone https://github.com/denvudd/plura.git
cd Samsara_Clone-master
```

### Step 5: Test MCP Connection
In Cursor, try:
```
@cursor Use plura-reader to get Plura structure
```

## Using Plura MCP in Cursor

### Read Plura Files
```
@cursor Read Plura file: package.json
@cursor Read Plura file: src/app/layout.tsx
@cursor Read Plura file: src/components/kanban/Board.tsx
```

### List Plura Directories
```
@cursor List Plura directory: src/components
@cursor List Plura directory: src/app
```

### Get Plura Structure
```
@cursor Get complete Plura repository structure
```

### Find Patterns
```
@cursor Find kanban pattern in Plura
@cursor Find sidebar pattern in Plura
@cursor Find auth pattern in Plura
```

### Get Config Files
```
@cursor Get Plura config: package
@cursor Get Plura config: typescript
@cursor Get Plura config: all
```

### Transform to Woodpecker
```
@cursor Transform Plura kanban to Woodpecker
@cursor Transform Plura auth to Woodpecker
@cursor Transform Plura database to Woodpecker
@cursor Transform Plura payment to Woodpecker
```

## Example Workflow: Transform Kanban

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
   @cursor Create Woodpecker tasks component based on Plura kanban:
   - Copy the structure from Plura
   - Update columns: Backlog → Estate Planning, Todo → Documents Needed, etc.
   - Add Woodpecker-specific fields (beneficiary, document link, deadline type)
   - Place in apps/web/components/tasks/Board.tsx
   ```

## Troubleshooting

### MCP Not Working?
1. Check Cursor is restarted after config change
2. Verify environment variables are set
3. Check file paths in config are correct
4. Ensure Node.js is in PATH

### Can't Read Plura?
1. Verify GitHub token has `repo` scope
2. Check Plura repo path: `denvudd/plura`
3. Try local path: Clone Plura to `../plura`
4. Check network connection

### Transformation Unclear?
1. Read the original Plura file first
2. Use `transform_plura_to_woodpecker` tool
3. Ask Cursor to explain the pattern step by step

## Next Steps

1. **Start with structure:**
   ```
   @cursor Get Plura structure
   ```

2. **Read key files:**
   ```
   @cursor Read Plura file: package.json
   @cursor Read Plura file: src/app/layout.tsx
   @cursor Read Plura file: prisma/schema.prisma
   ```

3. **Transform one feature at a time:**
   - Start with sidebar
   - Then kanban → tasks
   - Then auth
   - Then database
   - Finally payments

4. **Test each transformation:**
   - Verify it works
   - Check for errors
   - Refine as needed

