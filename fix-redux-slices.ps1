# PowerShell script to convert Redux Toolkit extraReducers from object notation to builder callback
# This script fixes Redux Toolkit v2 compatibility issues

$files = @(
    "src\app\main\apps\academy\store\categoriesSlice.js",
    "src\app\main\apps\academy\store\courseSlice.js",
    "src\app\main\apps\academy\store\coursesSlice.js",
    "src\app\main\apps\chat\store\chatSlice.js",
    "src\app\main\apps\chat\store\chatsSlice.js",
    "src\app\main\apps\chat\store\contactsSlice.js",
    "src\app\main\apps\chat\store\userSlice.js",
    "src\app\main\apps\contacts\store\contactsSlice.js",
    "src\app\main\apps\contacts\store\countriesSlice.js",
    "src\app\main\apps\contacts\store\tagsSlice.js",
    "src\app\main\apps\e-commerce\store\orderSlice.js",
    "src\app\main\apps\e-commerce\store\ordersSlice.js",
    "src\app\main\apps\e-commerce\store\productsSlice.js",
    "src\app\main\apps\file-manager\store\itemsSlice.js",
    "src\app\main\apps\help-center\store\faqCategoriesSlice.js",
    "src\app\main\apps\help-center\store\faqsMostSlice.js",
    "src\app\main\apps\help-center\store\faqsSlice.js",
    "src\app\main\apps\help-center\store\guideCategoriesSlice.js",
    "src\app\main\apps\help-center\store\guideSlice.js",
    "src\app\main\apps\help-center\store\guidesSlice.js",
    "src\app\main\apps\mailbox\store\filtersSlice.js",
    "src\app\main\apps\mailbox\store\foldersSlice.js",
    "src\app\main\apps\mailbox\store\labelsSlice.js",
    "src\app\main\apps\mailbox\store\mailSlice.js",
    "src\app\main\apps\mailbox\store\mailsSlice.js",
    "src\app\main\apps\notes\store\labelsSlice.js",
    "src\app\main\apps\notes\store\notesSlice.js",
    "src\app\main\apps\scrumboard\store\boardSlice.js",
    "src\app\main\apps\scrumboard\store\boardsSlice.js",
    "src\app\main\apps\scrumboard\store\cardSlice.js",
    "src\app\main\apps\scrumboard\store\cardsSlice.js",
    "src\app\main\apps\scrumboard\store\labelsSlice.js",
    "src\app\main\apps\scrumboard\store\listsSlice.js",
    "src\app\main\apps\scrumboard\store\membersSlice.js",
    "src\app\main\apps\tasks\store\tagsSlice.js",
    "src\app\main\apps\tasks\store\tasksSlice.js",
    "src\app\main\dashboards\analytics\store\widgetsSlice.js",
    "src\app\main\dashboards\crypto\store\widgetsSlice.js",
    "src\app\main\dashboards\finance\store\widgetsSlice.js",
    "src\app\main\dashboards\project\store\projectsSlice.js",
    "src\app\main\dashboards\project\store\widgetsSlice.js",
    "src\app\theme-layouts\shared-components\notificationPanel\store\dataSlice.js"
)

Write-Host "`n=== Converting Redux Toolkit extraReducers ===" -ForegroundColor Cyan
Write-Host "Processing $($files.Count) files..." -ForegroundColor Yellow

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Pattern: extraReducers: { [action.fulfilled]: handler, ... }
        # Convert to: extraReducers: (builder) => { builder.addCase(action.fulfilled, handler); ... }
        
        if ($content -match 'extraReducers:\s*\{') {
            Write-Host "Processing: $file" -ForegroundColor Gray
            
            # This is complex - we'll need to manually fix each file
            # The script will just identify them for now
        }
    }
}

Write-Host "`n⚠️  Manual conversion required for complex patterns" -ForegroundColor Yellow
Write-Host "Use the search_replace tool to fix each file individually" -ForegroundColor Gray

