# Auto-Configure Clerk Redirects
# Opens Clerk dashboard with exact instructions

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  CLERK DASHBOARD CONFIGURATION" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$envPath = "woodpecker\apps\web\.env.local"
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath -Raw
    
    if ($envContent -match 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_') {
        Write-Host "Found Clerk keys in .env.local" -ForegroundColor Green
        Write-Host ""
        Write-Host "Opening Clerk Dashboard..." -ForegroundColor Yellow
        Write-Host ""
        
        Start-Process "https://dashboard.clerk.com/last-active?path=paths"
        
        Write-Host "EXACT STEPS TO FOLLOW:" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "1. In Clerk dashboard, find Paths settings" -ForegroundColor White
        Write-Host ""
        Write-Host "2. Scroll to Allowed redirect URLs section" -ForegroundColor White
        Write-Host ""
        Write-Host "3. Click Add URL and add these URLs one at a time:" -ForegroundColor Yellow
        Write-Host "   http://localhost:3000/dashboard" -ForegroundColor Cyan
        Write-Host "   http://localhost:3000" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "4. In After sign-in URL field, enter:" -ForegroundColor Yellow
        Write-Host "   /dashboard" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "5. In After sign-up URL field, enter:" -ForegroundColor Yellow
        Write-Host "   /dashboard" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "6. Click Save button" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "7. Wait for Settings saved confirmation" -ForegroundColor White
        Write-Host ""
        
        Write-Host "Waiting for you to complete configuration..." -ForegroundColor Yellow
        Write-Host ""
        Read-Host "Press Enter when you have saved the settings"
        
        Write-Host ""
        Write-Host "Testing Configuration..." -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor White
        Write-Host "1. Start dev server: cd woodpecker\apps\web && npm run dev" -ForegroundColor Cyan
        Write-Host "2. Open: http://localhost:3000/sign-in" -ForegroundColor Cyan
        Write-Host "3. Sign in and verify redirect to /dashboard" -ForegroundColor White
        Write-Host ""
        
    } else {
        Write-Host "Clerk keys not found in .env.local" -ForegroundColor Red
        Write-Host "Run: .\CREATE_ENV_LOCAL.ps1" -ForegroundColor Yellow
    }
} else {
    Write-Host ".env.local not found!" -ForegroundColor Red
    Write-Host "Run: .\CREATE_ENV_LOCAL.ps1" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "QUICK REFERENCE:" -ForegroundColor Cyan
Write-Host "Clerk Dashboard: https://dashboard.clerk.com/last-active?path=paths" -ForegroundColor Cyan
Write-Host "Allowed redirect URLs: http://localhost:3000/dashboard" -ForegroundColor Gray
Write-Host "After sign-in URL: /dashboard" -ForegroundColor Gray
Write-Host "After sign-up URL: /dashboard" -ForegroundColor Gray
Write-Host ""
