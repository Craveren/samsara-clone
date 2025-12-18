# ⚠️ URGENT: Database Migration Required

## Problem
Your Prisma schema has `organizationId` columns, but your database doesn't have them yet. This is causing pages to fail silently.

## Error You're Seeing
```
The column `Client.organizationId` does not exist in the current database.
code: 'P2022'
```

## Quick Fix (Run This Now)

From `woodpecker/apps/web`:

```bash
cd woodpecker/apps/web
npx prisma migrate dev --name add_organization_columns
```

This will:
1. ✅ Add `organizationId` columns to all tables
2. ✅ Create the `Activity` table
3. ✅ Sync your database with your schema
4. ✅ Fix all the page loading errors

## What I've Done (Temporary Fix)

I've added error handling so pages won't crash, but **you still need to run the migration** for everything to work properly.

The code will now:
- ✅ Gracefully handle missing columns
- ✅ Continue working with Clerk metadata
- ✅ Show warnings instead of crashing

But database operations will fail until you run the migration.

## After Migration

Once you run `npx prisma migrate dev`, everything will work perfectly:
- ✅ Pages will load
- ✅ Database queries will work
- ✅ Multi-tenancy will function
- ✅ No more errors

## Next Steps

1. **Run the migration** (see command above)
2. **Restart your dev server**: `npm run dev`
3. **Test your pages** - they should all work now!

---

**Note:** The migration is safe - it only adds new columns, doesn't delete anything.

