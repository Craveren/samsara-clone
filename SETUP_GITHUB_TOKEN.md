# 🔑 Setup GitHub Token for Plura Access

## Why You Need This

To read Plura files from GitHub, you need a GitHub Personal Access Token.

## Step 1: Create GitHub Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `Woodpecker Plura Reader`
4. Select scope: **`repo`** (Full control of private repositories)
5. Click **"Generate token"**
6. **Copy the token** (starts with `ghp_`)

⚠️ **Important:** Copy it now - you won't see it again!

## Step 2: Add to .env.local

Create or edit `.env.local` in your project root:

```bash
GITHUB_TOKEN=ghp_your_token_here
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
```

## Step 3: Test

### Option A: Test with Fetch Script
```powershell
$env:GITHUB_TOKEN="ghp_your_token"
node fetch-plura.js structure
```

### Option B: Test with MCP
```powershell
# Start MCP server
cd mcp-servers
$env:GITHUB_TOKEN="ghp_your_token"
node plura-reader.js
```

Then in Cursor:
```
@cursor Get Plura repository structure
```

## Troubleshooting

### "Bad credentials"
- Token might be expired
- Check token has `repo` scope
- Regenerate if needed

### "Not found"
- Check repository name: `denvudd/plura`
- Verify token has access
- Try public access first

### "Rate limit exceeded"
- GitHub has rate limits
- Wait a bit and try again
- Or clone Plura locally: `git clone https://github.com/denvudd/plura.git ../plura`

## Alternative: Clone Plura Locally

If you don't want to use GitHub API:

```powershell
cd ..
git clone https://github.com/denvudd/plura.git
cd Samsara_Clone-master
```

Then MCP will read from local `../plura` directory automatically!

