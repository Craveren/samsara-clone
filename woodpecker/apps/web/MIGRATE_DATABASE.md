# 🚀 Database Migration Guide

## Quick Fix for Missing `organizationId` Column

The error `The column BankAccount.organizationId does not exist` means your database schema is out of sync with your Prisma schema.

### Option 1: Quick Fix (Recommended)

Run this from the `woodpecker/apps/web` directory:

```powershell
# Navigate to the web app directory
cd C:\Users\Mahlatse\Desktop\Samsara_Clone-master\woodpecker\apps\web

# Set DATABASE_URL (if not in .env.local)
$env:DATABASE_URL="postgresql://neondb_owner:npg_U83wSIBRroZl@ep-calm-truth-ahoiliae-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"

# Push schema to database (creates missing columns)
npx prisma db push --accept-data-loss
```

### Option 2: From Root Directory

If you prefer to run from the `woodpecker` root:

```powershell
# Navigate to woodpecker root
cd C:\Users\Mahlatse\Desktop\Samsara_Clone-master\woodpecker

# Set DATABASE_URL
$env:DATABASE_URL="postgresql://neondb_owner:npg_U83wSIBRroZl@ep-calm-truth-ahoiliae-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"

# Push schema (from root, specify schema path)
npx prisma db push --schema=apps/web/prisma/schema.prisma --accept-data-loss
```

### Option 3: Create Migration (For Production)

For a more controlled approach:

```powershell
cd C:\Users\Mahlatse\Desktop\Samsara_Clone-master\woodpecker\apps\web

$env:DATABASE_URL="postgresql://neondb_owner:npg_U83wSIBRroZl@ep-calm-truth-ahoiliae-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"

# Create a migration
npx prisma migrate dev --name add_organization_columns
```

## What This Does

- ✅ Adds `organizationId` column to `BankAccount` table
- ✅ Adds `organizationId` column to `Client` table
- ✅ Adds `organizationId` column to all other tables that need it
- ✅ Creates the `Organization` table if it doesn't exist
- ✅ Adds all necessary indexes

## After Migration

1. **Restart your dev server** (if running)
2. **Try adding an account again** - it should work now!

## Troubleshooting

### Error: "Can't reach database server"

This means:
- Your Neon database might be paused (free tier auto-pauses after inactivity)
- Your DATABASE_URL might be incorrect
- Network/firewall issues

**Solution:**
1. Go to your Neon dashboard and wake up the database
2. Verify your DATABASE_URL is correct
3. Try the connection again

### Error: "Environment variable not found: DATABASE_URL"

**Solution:**
1. Create `.env.local` in `woodpecker/apps/web/`
2. Add: `DATABASE_URL="your-neon-connection-string"`
3. Restart your dev server

### Still Having Issues?

The API routes now gracefully handle missing `organizationId` columns, so your app should work even without running migrations. However, for full multi-tenancy support, you should run the migration.

