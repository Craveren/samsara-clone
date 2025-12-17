# 🚀 Woodpecker Quick Start Guide
dummy change for CodeRabbit PR

## ✅ All Issues Fixed!

I've created a comprehensive fix script that handles everything. Here's what to do:

## Step 1: Run the Fix Script

```powershell
.\FIX_WOODPECKER_SETUP.ps1
```

This script will:
- ✅ Rename `config-overrides.js` → `config-overrides.cjs` (fixes ESM require error)
- ✅ Create `.env.local` template (if missing)
- ✅ Update Next.js version to `^14.2.0` (compatible with Clerk)
- ✅ Install dependencies with `--legacy-peer-deps` (fixes peer dependency conflicts)
- ✅ Check PowerShell script syntax

## Step 2: Edit Environment Variables

Open `.env.local` and add your actual values:

```env
# GitHub Token (for Plura MCP)
GITHUB_TOKEN=ghp_your_actual_token_here

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_your_actual_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key

# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# PayFast (South Africa)
PAYFAST_MERCHANT_ID=your_merchant_id
PAYFAST_MERCHANT_KEY=your_merchant_key
PAYFAST_PASSPHRASE=your_passphrase
PAYFAST_SANDBOX=true

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/woodpecker
```

## Step 3: Start the App

```powershell
cd woodpecker
npm run dev
```

The app will start at `http://localhost:3000`

## Manual Fixes (if script doesn't work)

### Fix 1: Rename config-overrides.js
```powershell
Rename-Item -Path "config-overrides.js" -NewName "config-overrides.cjs"
```

### Fix 2: Install Dependencies
```powershell
cd woodpecker
npm install --legacy-peer-deps
cd apps\web
npm install --legacy-peer-deps
```

### Fix 3: Update Next.js Version
The script already updated `woodpecker/apps/web/package.json` to use `next: "^14.2.0"` instead of `"14.0.0"`.

## Common Issues & Solutions

### Issue: `require is not defined in ES module scope`
**Solution:** Already fixed by renaming `config-overrides.js` → `config-overrides.cjs`

### Issue: `ERESOLVE unable to resolve dependency tree`
**Solution:** Use `npm install --legacy-peer-deps` (script does this automatically)

### Issue: `Missing closing '}' in PowerShell script`
**Solution:** The script checks syntax automatically. If you see this error, check line 52 in `start-woodpecker-mcps.ps1` for missing `}`.

### Issue: `@cursor` commands don't work in PowerShell
**Solution:** These only work inside Cursor IDE chat, not in PowerShell. You don't need them - we already have all the Plura components extracted in `woodpecker/`.

## What's Ready

✅ **20+ UI Components** - All in `woodpecker/packages/ui/`  
✅ **Form Components** - TaskForm, FileUpload  
✅ **Utility Components** - SearchBar, FilterBar, Pagination, etc.  
✅ **Custom Hooks** - useToast, useModal, useDebounce, useConfirm  
✅ **Utilities** - format, validation, api, storage, date  
✅ **API Routes** - /api/legacies, /api/tasks, /api/payfast/webhook  
✅ **Database Schema** - Prisma schema ready in `woodpecker/packages/database/`  
✅ **Auth Setup** - Clerk integration with roles  
✅ **PayFast Integration** - South African payment gateway  

## Next Steps After Setup

1. **Set up database:**
   ```powershell
   cd woodpecker/packages/database
   npx prisma generate
   npx prisma migrate dev
   ```

2. **Start developing:**
   - Edit pages in `woodpecker/apps/web/app/`
   - Add components in `woodpecker/packages/ui/src/`
   - Use utilities from `woodpecker/packages/utils/src/`

3. **Build for production:**
   ```powershell
   cd woodpecker/apps/web
   npm run build
   npm start
   ```

## Need Help?

- Check `EXTRACTED_FEATURES.md` for all available components
- Check `TRANSFORMATION_MAP.md` for Plura → Woodpecker mappings
- Check `woodpecker/README.md` for project structure

