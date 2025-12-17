# ============================================
# Create .env.local in Correct Location
# ============================================

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  CREATING .env.local" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Get script root (where this script is located)
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$envPath = Join-Path $scriptRoot "woodpecker\apps\web\.env.local"

# Check if already exists
if (Test-Path $envPath) {
    Write-Host "⚠️  .env.local already exists at:" -ForegroundColor Yellow
    Write-Host "   $envPath" -ForegroundColor Gray
    Write-Host ""
    $overwrite = Read-Host "Overwrite? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Skipping..." -ForegroundColor Gray
        Write-Host ""
        Write-Host "Opening existing file..." -ForegroundColor Yellow
        notepad $envPath
        exit 0
    }
}

# Create directory if it doesn't exist
$dir = Split-Path $envPath -Parent
if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
    Write-Host "✅ Created directory: $dir" -ForegroundColor Green
}

# Create .env.local file with CORRECT Next.js prefixes
@"
# ============================================
# Woodpecker Environment Variables
# Next.js 14 - Fill in your actual values
# ============================================

# Clerk Authentication (REQUIRED)
# Get keys from: https://dashboard.clerk.com/last-active?path=api-keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE

# Sentry Error Tracking (Optional)
# Get DSN from: https://sentry.io/settings/YOUR_ORG/projects/YOUR_PROJECT/keys/
NEXT_PUBLIC_SENTRY_DSN=https://YOUR_SENTRY_DSN@sentry.io/PROJECT_ID

# GitHub Token (Optional - for MCP servers)
# Create token: https://github.com/settings/tokens
GITHUB_TOKEN=ghp_YOUR_TOKEN_HERE

# Supabase Database (Optional)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY

# PayFast Payment Gateway (Optional - South Africa)
PAYFAST_MERCHANT_ID=YOUR_MERCHANT_ID
PAYFAST_MERCHANT_KEY=YOUR_MERCHANT_KEY
PAYFAST_PASSPHRASE=YOUR_PASSPHRASE
PAYFAST_SANDBOX=true

# Database Connection (Optional)
DATABASE_URL=postgresql://user:password@localhost:5432/woodpecker

# Node Environment
NODE_ENV=development
"@ | Out-File -FilePath $envPath -Encoding UTF8

Write-Host "✅ Created .env.local at:" -ForegroundColor Green
Write-Host "   $envPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANT: Add your Clerk keys!" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Get your keys from:" -ForegroundColor White
Write-Host "   https://dashboard.clerk.com/last-active?path=api-keys" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Edit the file and replace:" -ForegroundColor White
Write-Host "   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx" -ForegroundColor Gray
Write-Host "   CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxx" -ForegroundColor Gray
Write-Host ""
Write-Host "   With your actual keys" -ForegroundColor Gray
Write-Host ""
Write-Host "Opening file in Notepad..." -ForegroundColor Yellow
Start-Sleep -Seconds 1
notepad $envPath

Write-Host ""
Write-Host "Press Enter when done editing..."
Read-Host
