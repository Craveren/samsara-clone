# 🎯 How to Use Cursor MCP to Read Plura

## ⚠️ Important: You Need to Run These in Cursor

I can't directly access Cursor's MCP interface, but **you can**! Here's exactly what to do:

## Step 1: Start MCP Servers

First, make sure MCP servers are running:

```powershell
.\start-woodpecker-mcps.ps1
```

Or manually:
```powershell
# Terminal 1
cd mcp-servers
$env:GITHUB_TOKEN="ghp_your_token"
node plura-reader.js

# Terminal 2  
cd mcp-servers
node file-system.js
```

## Step 2: Open Cursor and Use MCP

1. **Open Cursor IDE**
2. **Open this project** (`Samsara_Clone-master`)
3. **In Cursor chat**, type these commands:

### Get Plura Structure
```
@cursor Use plura-reader MCP to get the complete structure of Plura repository
```

**Expected Output:**
- Directory tree of Plura
- Main folders and files

### Get All Configs
```
@cursor Get Plura config: all
```

**Expected Output:**
- package.json
- tsconfig.json  
- tailwind.config.ts
- next.config.js

### Read Specific Files
```
@cursor Read Plura file: package.json
```

**Expected Output:**
- Full package.json content
- Dependencies
- Scripts

```
@cursor Read Plura file: src/app/layout.tsx
```

**Expected Output:**
- Root layout component
- Providers
- Global setup

### Find Patterns
```
@cursor Find sidebar pattern in Plura
```

**Expected Output:**
- Sidebar component locations
- File paths
- Pattern description

```
@cursor Find kanban pattern in Plura
```

**Expected Output:**
- Kanban component locations
- Implementation details

## Step 3: Share the Output

After running these commands in Cursor:

1. **Copy the outputs** Cursor shows you
2. **Paste them here** or share them
3. **I'll help transform** them into Woodpecker

## Alternative: Use Fetch Script

If Cursor MCP isn't working, use the fetch script:

```powershell
# Set token
$env:GITHUB_TOKEN="ghp_your_token"

# Get structure
node fetch-plura.js structure

# Read files
node fetch-plura.js read package.json
node fetch-plura.js read src/app/layout.tsx
node fetch-plura.js list src/components
```

Files will be saved to `woodpecker/plura-files/`

## What I've Created (Templates)

While you set up MCP, I've created template files based on common Plura patterns:

- `woodpecker/package.json` - Monorepo setup
- `woodpecker/turbo.json` - Build pipeline
- `woodpecker/tsconfig.json` - TypeScript config
- `woodpecker/PLURA_ANALYSIS.md` - Expected Plura structure

## Next Steps

1. **Set GitHub token** in `.env.local`:
   ```
   GITHUB_TOKEN=ghp_your_token_here
   ```

2. **Start MCP servers**:
   ```powershell
   .\start-woodpecker-mcps.ps1
   ```

3. **In Cursor, run**:
   ```
   @cursor Get Plura repository structure
   ```

4. **Share the output** and we'll continue!

