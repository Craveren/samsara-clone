# ============================================
# Fix Environment Variables Setup
# ============================================

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  FIXING ENVIRONMENT VARIABLES" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$envPath = Join-Path $scriptRoot "woodpecker\apps\web\.env.local"

# Step 1: Check if .env.local exists
Write-Host "Step 1: Checking .env.local..." -ForegroundColor Yellow

if (-not (Test-Path $envPath)) {
    Write-Host "❌ .env.local not found!" -ForegroundColor Red
    Write-Host "Creating it now..." -ForegroundColor Yellow
    & "$scriptRoot\CREATE_ENV_LOCAL.ps1"
    exit 0
}

Write-Host "✅ .env.local exists" -ForegroundColor Green
Write-Host ""

# Step 2: Check for common issues
Write-Host "Step 2: Checking for common issues..." -ForegroundColor Yellow

$envContent = Get-Content $envPath -Raw
$needsFix = $false

# Check for wrong prefixes (VITE_ instead of NEXT_PUBLIC_)
if ($envContent -match 'VITE_') {
    Write-Host "⚠️  Found VITE_ prefix (wrong for Next.js)" -ForegroundColor Yellow
    Write-Host "   Next.js uses NEXT_PUBLIC_ for client-side variables" -ForegroundColor Gray
    $needsFix = $true
}

# Check for wrong file names mentioned
$wrongFiles = @('.envm_local', '.envmlocal', '.env-local', '.env.dev.local')
foreach ($wrongFile in $wrongFiles) {
    $wrongPath = Join-Path $scriptRoot "woodpecker\apps\web\$wrongFile"
    if (Test-Path $wrongPath) {
        Write-Host "⚠️  Found incorrectly named file: $wrongFile" -ForegroundColor Yellow
        Write-Host "   Next.js only reads .env.local (not $wrongFile)" -ForegroundColor Gray
        $needsFix = $true
    }
}

# Check for placeholder values
if ($envContent -match 'YOUR_KEY_HERE|xxxxxxxxxxxx|YOUR_') {
    Write-Host "⚠️  Found placeholder values" -ForegroundColor Yellow
    Write-Host "   Replace placeholders with your actual keys" -ForegroundColor Gray
    $needsFix = $true
}

if (-not $needsFix) {
    Write-Host "✅ No obvious issues found" -ForegroundColor Green
    Write-Host ""
}

# Step 3: Validate variables
Write-Host "Step 3: Validating variables..." -ForegroundColor Yellow
& "$scriptRoot\CHECK_ENV.ps1"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  IMPORTANT REMINDERS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ For Next.js 14:" -ForegroundColor Green
Write-Host "   • File MUST be named: .env.local" -ForegroundColor White
Write-Host "   • Client-side vars MUST start with: NEXT_PUBLIC_" -ForegroundColor White
Write-Host "   • Server-side vars: No prefix needed" -ForegroundColor White
Write-Host "   • Location: woodpecker\apps\web\.env.local" -ForegroundColor White
Write-Host ""
Write-Host "✅ After changing .env.local:" -ForegroundColor Green
Write-Host "   1. Stop dev server (Ctrl+C)" -ForegroundColor White
Write-Host "   2. Restart: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "✅ Required variables:" -ForegroundColor Green
Write-Host "   • NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" -ForegroundColor White
Write-Host "   • CLERK_SECRET_KEY" -ForegroundColor White
Write-Host ""

