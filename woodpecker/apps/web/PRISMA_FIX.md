# Prisma Fix Guide - PATH A (Recommended)

## Current Issues
1. ✅ Prisma CLI is v7.1.0 (too new - breaks with current schema)
2. ✅ Prisma Client is v5.18.0 (needs to match CLI)
3. ✅ Activity table doesn't exist in database
4. ✅ Prisma Client is out of sync with schema

## Solution: Downgrade to Prisma 5.22.0

### Step 1: Install Correct Prisma Versions

From `woodpecker/apps/web` directory:

```bash
cd woodpecker/apps/web
npm install prisma@5.22.0 @prisma/client@5.22.0
```

This will:
- Install Prisma CLI 5.22.0 (compatible with your schema)
- Install Prisma Client 5.22.0 (matches runtime version)

### Step 2: Generate Prisma Client

```bash
npx prisma generate
```

This regenerates the Prisma Client with:
- ✅ `organizationId` field in Activity model
- ✅ All other schema fields properly typed

### Step 3: Create Missing Tables (IMPORTANT)

```bash
npx prisma migrate dev --name add_activity_table
```

This will:
- Create the `Activity` table in your database
- Sync all other schema changes
- Create a migration file

**Note:** If you get prompted about existing migrations, choose:
- `Create a new migration` (recommended)

### Step 4: Verify Everything Works

```bash
npx prisma studio
```

This opens Prisma Studio where you can:
- See all your tables
- Verify `Activity` table exists
- Check that `organizationId` field is present

### Step 5: Restart Dev Server

```bash
npm run dev
```

Your `/api/activities` endpoint should now work without errors!

---

## What This Fixes

✅ Prisma Client will include `organizationId` field  
✅ Activity table will exist in database  
✅ No more "Unknown argument" errors  
✅ No more "table does not exist" errors  
✅ Multi-tenancy support will work properly  

---

## If You Get Errors

### Error: "Migration already exists"
```bash
npx prisma migrate reset
npx prisma migrate dev
```

### Error: "Database connection failed"
Check your `.env.local` file has correct `DATABASE_URL`

### Error: "Schema validation failed"
Make sure you're in `woodpecker/apps/web` directory when running commands

---

## Next Steps (After This Works)

Once Prisma is stable, we can:
1. Verify Activity model is correct
2. Add proper `accountId` scoping (per your multi-tenant PRD)
3. Align Prisma with Clerk Organizations
4. Prevent this class of bug forever

