# Prisma & Stitch Environment Setup (Woodpecker)

## 🚀 Quick Fix (Recommended)

**Run the automated setup script:**

```powershell
# From woodpecker/ directory
.\scripts\fix-prisma.ps1
```

Or use the batch file:
```cmd
.\scripts\fix-prisma.bat
```

This script will:
1. ✅ Set DATABASE_URL environment variable
2. ✅ Generate Prisma Client
3. ✅ Create all database tables (Client, BankAccount, Transaction, etc.)
4. ✅ Verify the setup

## 📝 Manual Setup

### Step 1: Create `.env` file

Create `woodpecker/.env` with:
```env
DATABASE_URL="postgresql://<USER>:<PASSWORD>@<HOST>/<DB>?sslmode=require&pgbouncer=true"
STITCH_CLIENT_ID="your_stitch_client_id"
STITCH_CLIENT_SECRET="your_stitch_client_secret"
STITCH_BASE_URL="https://api.stitch.money"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 2: Run Prisma commands

**IMPORTANT:** Run from `woodpecker/` root directory (not `apps/web/`):

```powershell
# Set environment variable for this session
$env:DATABASE_URL="postgresql://neondb_owner:npg_U83wSIBRroZl@ep-calm-truth-ahoiliae-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"

# Generate Prisma Client
npx prisma generate

# Push schema to database (creates all tables)
npx prisma db push --accept-data-loss
```

### Step 3: Verify

```powershell
# Check database connection
node scripts/prisma-check.js

# Or open Prisma Studio to see tables
npx prisma studio
```

## 🔧 Troubleshooting

### Error: "Environment variable not found: DATABASE_URL"
- **Solution:** Run the setup script OR set `$env:DATABASE_URL` in PowerShell before running Prisma commands

### Error: "The table `public.Client` does not exist"
- **Solution:** Run `npx prisma db push --accept-data-loss` from `woodpecker/` directory

### Error: "Prisma schema validation"
- **Solution:** Ensure you're running commands from `woodpecker/` root, not `apps/web/`

## ✅ After Setup

1. Restart your Next.js dev server: `npm run dev`
2. Log in through Clerk
3. The `Client` table will be automatically populated on first login
4. Stitch integration will work once you add `STITCH_CLIENT_SECRET` to `.env`

