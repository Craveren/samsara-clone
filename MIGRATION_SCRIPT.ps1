# Woodpecker Lifebook - Migration Script
# Run this to clean up dependencies and prepare for migration

Write-Host "`n=== WOODPECKER LIFEBOOK MIGRATION ===" -ForegroundColor Green
Write-Host ""

# Step 1: Backup current package.json
Write-Host "📦 Step 1: Backing up package.json..." -ForegroundColor Cyan
Copy-Item package.json package.json.backup
Write-Host "   ✅ Backup created: package.json.backup" -ForegroundColor Green

# Step 2: Remove unused/redundant dependencies
Write-Host "`n🗑️  Step 2: Removing unused dependencies..." -ForegroundColor Cyan

$depsToRemove = @(
    "apexcharts",
    "react-apexcharts",
    "mobx",
    "google-map-react",
    "react-google-maps",
    "@mui/material-next",
    "@mui/styles",
    "draft-js",
    "draftjs-to-html",
    "react-draft-wysiwyg",
    "react-swipeable-views",
    "material-ui-popup-state",
    "@progress/kendo-react-animation",
    "@progress/kendo-react-buttons",
    "@progress/kendo-react-common",
    "@progress/kendo-react-intl",
    "@progress/kendo-react-layout",
    "@progress/kendo-react-popup",
    "@progress/kendo-react-progressbars",
    "@progress/kendo-theme-default",
    "@progress/kendo-intl",
    "@progress/kendo-licensing",
    "@progress/kendo-popup-common"
)

foreach ($dep in $depsToRemove) {
    Write-Host "   Removing $dep..." -ForegroundColor Gray
    npm uninstall $dep 2>$null
}

Write-Host "   ✅ Removed redundant dependencies" -ForegroundColor Green

# Step 3: Update critical dependencies
Write-Host "`n⬆️  Step 3: Updating critical dependencies..." -ForegroundColor Cyan
Write-Host "   Updating @mui/material, @reduxjs/toolkit, react-router-dom..." -ForegroundColor Gray
npm install @mui/material@latest @mui/icons-material@latest @reduxjs/toolkit@latest react-redux@latest react-router-dom@latest axios@latest framer-motion@latest
Write-Host "   ✅ Dependencies updated" -ForegroundColor Green

# Step 4: Add development tools
Write-Host "`n🛠️  Step 4: Adding development tools..." -ForegroundColor Cyan
npm install --save-dev webpack-bundle-analyzer depcheck
Write-Host "   ✅ Added bundle analyzer and depcheck" -ForegroundColor Green

# Step 5: Check for unused dependencies
Write-Host "`n🔍 Step 5: Checking for unused dependencies..." -ForegroundColor Cyan
Write-Host "   Running depcheck..." -ForegroundColor Gray
npx depcheck

# Step 6: Security audit
Write-Host "`n🔒 Step 6: Running security audit..." -ForegroundColor Cyan
npm audit

Write-Host "`n✅ Migration preparation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Review depcheck output and remove truly unused deps" -ForegroundColor Gray
Write-Host "   2. Fix security vulnerabilities: npm audit fix" -ForegroundColor Gray
Write-Host "   3. Analyze bundle: ANALYZE=true npm run build" -ForegroundColor Gray
Write-Host "   4. Test the app: npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Consider migrating to the modern Woodpecker Next.js project!" -ForegroundColor Cyan
Write-Host "   Location: woodpecker/apps/web" -ForegroundColor Gray
Write-Host ""

