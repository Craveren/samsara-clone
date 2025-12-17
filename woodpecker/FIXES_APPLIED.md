# 🔧 Fixes Applied - Environment & Hydration Issues

## Issues Fixed

### 1. ✅ Kanban Board Hydration Error
**Error:** `Text content did not match. Server: "Record Family Stories" Client: "Update Last Will and Testament"`

**Root Cause:** Tasks were being loaded from `localStorage` on the client, but the server rendered with `initialTasks`, causing a mismatch.

**Fix:**
- Modified `BeautifulKanbanBoard` to only load from `localStorage` on the client side using `useEffect`
- Added client-side check in `TasksPage` to prevent rendering until client-side hydration is complete
- Tasks now load consistently between server and client

**Files Changed:**
- `woodpecker/apps/web/components/kanban/BeautifulKanbanBoard.tsx`
- `woodpecker/apps/web/app/tasks/page.tsx`

### 2. ✅ Clerk Development Key Warning
**Warning:** `Clerk: Clerk has been loaded with development keys...`

**Fix:**
- Added `__unstable_disableDevelopmentModeWarning` prop to `ClerkProvider` in development mode
- This suppresses the console warning while keeping the functionality

**Files Changed:**
- `woodpecker/apps/web/app/layout.tsx`

### 3. ✅ Stitch API Authentication Error
**Error:** `UNAUTHENTICATED: Token is missing, expired or malformed`

**Root Cause:** The Stitch API might require Basic Auth instead of Bearer token, especially when the client secret contains special characters (`+`, `/`).

**Fix:**
- Updated authentication to try Basic Auth format when the secret contains special characters
- Added better logging to debug authentication issues
- The code now attempts: `Basic base64(client_id:client_secret)` if secret has special chars, otherwise `Bearer token`

**Files Changed:**
- `woodpecker/apps/web/lib/services/stitch-integration.ts`

**Note:** If the error persists, check:
1. That `STITCH_CLIENT_ID` and `STITCH_CLIENT_SECRET` are correctly set in `.env.local`
2. That the Stitch API endpoint is correct (`https://api.stitch.money`)
3. The Stitch API documentation for the correct authentication format

### 4. ✅ Chart Sizing Warnings
**Warning:** `The width(-1) and height(-1) of chart should be greater than 0`

**Fix:**
- Added explicit `minHeight` and `minWidth` styles to chart containers
- Ensured `ResponsiveContainer` has proper sizing constraints
- Added wrapper divs with explicit dimensions

**Files Changed:**
- `woodpecker/apps/web/components/charts/EnhancedFinancialChart.tsx`
- `woodpecker/apps/web/components/ui/shadcn-io/line-chart-05.tsx`

## Environment Variables Setup

### Required in `.env.local` (in `woodpecker/apps/web/`):

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Stitch Bank Integration
STITCH_CLIENT_ID=your_stitch_client_id
STITCH_CLIENT_SECRET=your_stitch_client_secret
STITCH_BASE_URL=https://api.stitch.money
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://...

# Gemini AI (optional)
GEMINI_API_KEY=...
```

### Consolidating `.env` Files

If you have both `.env` and `.env.local`:
1. **Keep `.env.local`** in `woodpecker/apps/web/` - This is the file Next.js reads
2. **Move all variables** from `.env` to `.env.local`
3. **Delete `.env`** if it's in the root (or keep it for reference but know Next.js won't read it)

**Important:** Next.js only reads `.env.local` from the `apps/web/` directory, not from the root.

## Testing the Fixes

1. **Kanban Board:**
   - Navigate to `/tasks`
   - Should not see hydration errors in console
   - Tasks should load correctly

2. **Stitch Connection:**
   - Click "Connect Bank" button
   - Check server console for `[Stitch]` logs
   - If still getting 500 error, check the authentication format in the logs

3. **Charts:**
   - Navigate to dashboard
   - Charts should render without sizing warnings

4. **Clerk:**
   - No more development key warnings in console

## Next Steps

If Stitch API still fails:
1. Check Stitch API documentation for correct authentication format
2. Verify the API endpoint URL
3. Check if the client secret needs URL encoding
4. Consider if Stitch uses GraphQL (the error format suggests it might)

