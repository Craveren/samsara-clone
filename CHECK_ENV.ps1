# ============================================
# Check Environment Variables
# ============================================

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  CHECKING ENVIRONMENT VARIABLES" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$envPath = Join-Path $scriptRoot "woodpecker\apps\web\.env.local"

# Check if file exists
if (-not (Test-Path $envPath)) {
    Write-Host "❌ .env.local NOT FOUND!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Location should be:" -ForegroundColor Yellow
    Write-Host "   $envPath" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Run this to create it:" -ForegroundColor Yellow
    Write-Host "   .\CREATE_ENV_LOCAL.ps1" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

Write-Host "✅ .env.local found at:" -ForegroundColor Green
Write-Host "   $envPath" -ForegroundColor Gray
Write-Host ""

# Read and check variables
$envContent = Get-Content $envPath -Raw
$lines = Get-Content $envPath

Write-Host "Checking variables..." -ForegroundColor Yellow
Write-Host ""

$errors = @()
$warnings = @()
$found = @{}

foreach ($line in $lines) {
    # Skip comments and empty lines
    if ($line -match '^\s*#' -or $line -match '^\s*$') {
        continue
    }

    # Parse key=value
    if ($line -match '^([^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        $found[$key] = $value
    }
}

# Check required variables
$required = @(
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY'
)

foreach ($key in $required) {
    if (-not $found.ContainsKey($key)) {
        $errors += "Missing: $key"
    } elseif ($found[$key] -match 'YOUR_KEY_HERE|xxxxxxxxxxxx|YOUR_') {
        $errors += "Not set: $key (still has placeholder)"
    } elseif ($found[$key] -eq '') {
        $errors += "Empty: $key"
    } else {
        Write-Host "✅ $key" -ForegroundColor Green
        if ($key -eq 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY') {
            if ($found[$key] -notmatch '^pk_test_|^pk_live_') {
                $warnings += "$key doesn't start with pk_test_ or pk_live_"
            }
        }
        if ($key -eq 'CLERK_SECRET_KEY') {
            if ($found[$key] -notmatch '^sk_test_|^sk_live_') {
                $warnings += "$key doesn't start with sk_test_ or sk_live_"
            }
        }
    }
}

# Check optional variables
$optional = @(
    'NEXT_PUBLIC_SENTRY_DSN',
    'GITHUB_TOKEN',
    'NEXT_PUBLIC_SUPABASE_URL'
)

Write-Host ""
Write-Host "Optional variables:" -ForegroundColor Gray
foreach ($key in $optional) {
    if ($found.ContainsKey($key) -and $found[$key] -ne '' -and $found[$key] -notmatch 'YOUR_|xxxxxxxxxxxx') {
        Write-Host "✅ $key" -ForegroundColor Green
    } else {
        Write-Host "⚪ $key (not set)" -ForegroundColor DarkGray
    }
}

# Show errors
if ($errors.Count -gt 0) {
    Write-Host ""
    Write-Host "❌ ERRORS FOUND:" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "   • $error" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Fix these before starting the app!" -ForegroundColor Yellow
    exit 1
}

# Show warnings
if ($warnings.Count -gt 0) {
    Write-Host ""
    Write-Host "⚠️  WARNINGS:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "   • $warning" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ All required variables are set!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Note: Restart your dev server after changing .env.local" -ForegroundColor Cyan
Write-Host ""

