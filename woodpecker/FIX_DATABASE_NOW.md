# 🚨 FIX DATABASE NOW - Quick Commands

## The Problem
- ❌ `Client` table doesn't exist (P2021 error)
- ❌ `DATABASE_URL` not found when running Prisma (P1012 error)
- ❌ Running Prisma from wrong directory

## ✅ THE FIX - EASIEST METHOD (Just Double-Click!)

**Simply double-click this file:**
```
woodpecker/setup-database.bat
```

That's it! It will automatically:
- ✅ Set DATABASE_URL
- ✅ Generate Prisma Client
- ✅ Create all database tables
- ✅ Verify everything works

## ✅ ALTERNATIVE METHODS

### Option 1: Using npm script (Recommended)

```powershell
cd C:\Users\Mahlatse\Desktop\Samsara_Clone-master\woodpecker
npm run db:setup
```

### Option 2: Using Node.js directly

```powershell
cd C:\Users\Mahlatse\Desktop\Samsara_Clone-master\woodpecker
node scripts/setup-database.js
```

### Option 3: PowerShell script

**If your dev server is NOT running:**
```powershell
cd C:\Users\Mahlatse\Desktop\Samsara_Clone-master\woodpecker
.\scripts\fix-prisma.ps1
```

**If you see "EPERM: operation not permitted" error:**
```powershell
# 1. Stop your dev server first (Ctrl+C in the terminal running npm run dev)
# 2. Wait 5 seconds
# 3. Then run:
cd C:\Users\Mahlatse\Desktop\Samsara_Clone-master\woodpecker
.\scripts\fix-prisma.ps1
```

**OR use the simpler script (skips generate, just creates tables):**
```powershell
cd C:\Users\Mahlatse\Desktop\Samsara_Clone-master\woodpecker
.\scripts\db-push-only.ps1
```

### Option 1: Automated Script (Easiest)

**If your dev server is NOT running:**
```powershell
# Navigate to woodpecker root
cd C:\Users\Mahlatse\Desktop\Samsara_Clone-master\woodpecker

# Run the fix script
.\scripts\fix-prisma.ps1
```

**If you see "EPERM: operation not permitted" error:**
```powershell
# 1. Stop your dev server first (Ctrl+C in the terminal running npm run dev)
# 2. Wait 5 seconds
# 3. Then run:
cd C:\Users\Mahlatse\Desktop\Samsara_Clone-master\woodpecker
.\scripts\fix-prisma.ps1
```

**OR use the simpler script (skips generate, just creates tables):**
```powershell
cd C:\Users\Mahlatse\Desktop\Samsara_Clone-master\woodpecker
.\scripts\db-push-only.ps1
```

### Option 4: Manual Commands (If scripts don't work)

```powershell
# 1. Navigate to woodpecker root (NOT apps/web)
cd C:\Users\Mahlatse\Desktop\Samsara_Clone-master\woodpecker

# 2. Set DATABASE_URL for this session
$env:DATABASE_URL="postgresql://neondb_owner:npg_U83wSIBRroZl@ep-calm-truth-ahoiliae-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"

# 3. Generate Prisma Client
npx prisma generate

# 4. Create all tables in database
npx prisma db push --accept-data-loss
```

## ✅ After Running

1. **Restart your dev server:**
   ```powershell
   npm run dev
   ```

2. **Log in through Clerk** - The `Client` table will be created automatically

3. **Verify it worked:**
   ```powershell
   npx prisma studio
   ```
   This opens a browser where you can see all your tables.

## 🔍 What This Does

- ✅ Creates `Client` table (fixes P2021 error)
- ✅ Creates `BankAccount` table
- ✅ Creates `Transaction` table
- ✅ Creates all other tables from your schema
- ✅ Generates Prisma Client so your app can connect

## ⚠️ Important Notes

1. **Always run from `woodpecker/` root**, not `apps/web/`
2. **DATABASE_URL is set for this PowerShell session only**
3. **To make it permanent**, add to `woodpecker/.env` file (see PRISMA_ENV_SETUP.md)

## 🎯 Expected Result

After running, you should see:
```
✅ Prisma Client generated successfully
✅ Database schema pushed successfully
✅ All tables created
```

Then when you restart your app and log in, the P2021 errors will be gone!

