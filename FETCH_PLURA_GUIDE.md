# 🔍 Fetch Plura Files Guide

Since Cursor MCP might not be accessible directly, use this helper script to fetch Plura files.

## Quick Start

### Step 1: Set GitHub Token
```powershell
$env:GITHUB_TOKEN="ghp_your_token_here"
```

### Step 2: Fetch Files

#### Get Plura Structure
```bash
node fetch-plura.js structure
```

#### Read Specific Files
```bash
# Get package.json
node fetch-plura.js read package.json

# Get layout
node fetch-plura.js read src/app/layout.tsx

# Get sidebar (find path first)
node fetch-plura.js list src/components
node fetch-plura.js read src/components/sidebar/Sidebar.tsx

# Get kanban
node fetch-plura.js read src/components/kanban/Board.tsx

# Get Prisma schema
node fetch-plura.js read prisma/schema.prisma
```

#### List Directories
```bash
node fetch-plura.js list src
node fetch-plura.js list src/components
node fetch-plura.js list prisma
```

## Files Will Be Saved To

All fetched files are saved to: `woodpecker/plura-files/`

You can then:
1. Review the files
2. Transform them for Woodpecker
3. Place in appropriate Woodpecker directories

## Or Use Cursor MCP

If Cursor MCP is working, use these commands in Cursor:

```
@cursor Read Plura file: package.json
@cursor Read Plura file: src/app/layout.tsx
@cursor Find sidebar pattern in Plura
@cursor Find kanban pattern in Plura
```

Then share the output, and I'll help transform them!

