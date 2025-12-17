# ============================================
# Quick .env.local Setup Script
# ============================================

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  WOODPECKER ENV SETUP" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$envPath = "woodpecker\apps\web\.env.local"

# Check if .env.local exists
if (Test-Path $envPath) {
    Write-Host "📝 .env.local already exists" -ForegroundColor Yellow
    Write-Host ""
    $content = Get-Content $envPath -Raw
    if ($content -match "pk_test_your_publishable_key_here" -or $content -notmatch "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_[a-zA-Z0-9]+") {
        Write-Host "⚠️  Clerk keys need to be set!" -ForegroundColor Red
        Write-Host ""
        Write-Host "1. Get your keys from:" -ForegroundColor Yellow
        Write-Host "   https://dashboard.clerk.com/last-active?path=api-keys" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "2. Open this file and update:" -ForegroundColor Yellow
        Write-Host "   $((Get-Location).Path)\$envPath" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "3. Replace these lines:" -ForegroundColor Yellow
        Write-Host "   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here" -ForegroundColor Gray
        Write-Host "   CLERK_SECRET_KEY=sk_test_your_secret_key_here" -ForegroundColor Gray
        Write-Host ""
        Write-Host "   With your actual keys from Clerk dashboard" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Press Enter to open the file in Notepad..."
        Read-Host
        notepad $envPath
    } else {
        Write-Host "✅ Clerk keys appear to be configured!" -ForegroundColor Green
        Write-Host ""
        Write-Host "You can start the app with:" -ForegroundColor Yellow
        Write-Host "   cd woodpecker\apps\web" -ForegroundColor Cyan
        Write-Host "   npm run dev" -ForegroundColor Cyan
    }
} else {
    Write-Host "📝 Creating .env.local file..." -ForegroundColor Yellow
    @"
# Clerk Authentication
# Get your keys from: https://dashboard.clerk.com/last-active?path=api-keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Supabase (Optional - for database)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# PayFast (South Africa - Optional)
PAYFAST_MERCHANT_ID=
PAYFAST_MERCHANT_KEY=
PAYFAST_PASSPHRASE=
PAYFAST_SANDBOX=true

# Database (Optional)
DATABASE_URL=
"@ | Out-File -FilePath $envPath -Encoding UTF8
    
    Write-Host "✅ Created .env.local" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Add your Clerk keys!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Get your keys from:" -ForegroundColor Yellow
    Write-Host "   https://dashboard.clerk.com/last-active?path=api-keys" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "2. Opening .env.local in Notepad..." -ForegroundColor Yellow
    Write-Host ""
    Start-Sleep -Seconds 2
    notepad $envPath
}

Write-Host ""
Write-Host "Press Enter to exit..."
Read-Host

