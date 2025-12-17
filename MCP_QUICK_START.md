# 🚀 MCP Quick Start Guide

## ✅ Setup Complete!

- ✅ `package.json` has `"type": "module"`
- ✅ MCP SDK installed
- ✅ `plura-reader.js` exists (20,541 bytes)
- ✅ Startup scripts created

## 🎯 Start MCP Servers

### Option 1: PowerShell (Recommended)
```powershell
.\start-woodpecker-mcps.ps1
```

### Option 2: Batch File
```cmd
start-woodpecker-mcps.bat
```

### Option 3: Manual Start
```powershell
# Terminal 1: Plura Reader
cd mcp-servers
$env:GITHUB_TOKEN="ghp_your_token"
node plura-reader.js

# Terminal 2: File System
cd mcp-servers
node file-system.js

# Terminal 3: Clerk (if configured)
npx -y @modelcontextprotocol/server-clerk
```

## 🧪 Test the Setup

### Test Plura Reader
```powershell
node test-plura-reader.js
```

### Test Direct Run
```powershell
cd mcp-servers
$env:GITHUB_TOKEN="ghp_your_token"
node plura-reader.js
```

If it starts without errors, it's working! (Press Ctrl+C to stop)

## 📋 Use in Cursor

Once MCP servers are running:

1. **Open Cursor IDE**
2. **Open this project**
3. **In Cursor chat, use:**

```
@cursor Get Plura repository structure
@cursor Read Plura file: package.json
@cursor Find sidebar pattern in Plura
@cursor Find kanban pattern in Plura
```

## 🔧 Troubleshooting

### "Cannot find module"
```powershell
npm install @modelcontextprotocol/sdk octokit
```

### "GITHUB_TOKEN not set"
Create `.env.local`:
```
GITHUB_TOKEN=ghp_your_token_here
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
```

### "Module not found" errors
Make sure `package.json` has:
```json
{
  "type": "module"
}
```

### MCP not connecting in Cursor
1. Restart Cursor
2. Check Cursor Settings → MCP
3. Verify config matches `cursor-mcp-config.json`
4. Check MCP servers are running

## ✅ Verification Checklist

- [ ] `package.json` has `"type": "module"`
- [ ] MCP SDK installed (`node_modules/@modelcontextprotocol`)
- [ ] `plura-reader.js` exists in `mcp-servers/`
- [ ] `.env.local` has `GITHUB_TOKEN`
- [ ] MCP servers start without errors
- [ ] Cursor MCP config is set up

## 🎬 Next Steps

1. **Start MCP servers:**
   ```powershell
   .\start-woodpecker-mcps.ps1
   ```

2. **Open Cursor and test:**
   ```
   @cursor Get Plura repository structure
   ```

3. **Share the output** and we'll continue transforming!

