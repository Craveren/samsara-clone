# 🔧 Environment Variables Guide - Next.js 14

## ✅ **CONFIRMED: This is Next.js 14**

Your project uses **Next.js 14** (not Create-React-App or Vite).

## 📋 **Next.js Environment Variable Rules**

### 1. **File Name MUST Be Exact**
Next.js only reads these files (in order of priority):
- `.env.local` ← **USE THIS ONE** (highest priority, not committed to git)
- `.env.development.local` (for dev only)
- `.env.production.local` (for production only)
- `.env.development` (for dev)
- `.env.production` (for production)
- `.env` (lowest priority)

**❌ WRONG:**
- `.envm_local`
- `.envmlocal`
- `.env-local`
- `.env.dev.local`
- `.env.txt`

**✅ CORRECT:**
- `.env.local` ← **This is what you need**

### 2. **File Location**
```
woodpecker/apps/web/.env.local
```

**NOT** in the root directory!

### 3. **Variable Prefixes**

#### Client-Side Variables (Browser)
**MUST start with `NEXT_PUBLIC_`**

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_SENTRY_DSN=https://...
NEXT_PUBLIC_SUPABASE_URL=https://...
```

#### Server-Side Variables (API Routes, Middleware)
**NO prefix needed**

```env
CLERK_SECRET_KEY=sk_test_...
GITHUB_TOKEN=ghp_...
DATABASE_URL=postgresql://...
PAYFAST_MERCHANT_ID=...
```

### 4. **Accessing Variables**

#### Client-Side (Components)
```typescript
const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
```

#### Server-Side (API Routes, Middleware)
```typescript
const secret = process.env.CLERK_SECRET_KEY
```

## 🔍 **Your Current Setup**

### Required Variables (Must Have)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY
CLERK_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY
```

### Optional Variables
```env
NEXT_PUBLIC_SENTRY_DSN=https://YOUR_DSN@sentry.io/PROJECT_ID
GITHUB_TOKEN=ghp_YOUR_TOKEN
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
PAYFAST_MERCHANT_ID=YOUR_MERCHANT_ID
PAYFAST_MERCHANT_KEY=YOUR_MERCHANT_KEY
PAYFAST_PASSPHRASE=YOUR_PASSPHRASE
PAYFAST_SANDBOX=true
DATABASE_URL=postgresql://user:password@localhost:5432/woodpecker
```

## 🚨 **Common Issues & Fixes**

### Issue 1: Variables Not Loading
**Symptom:** `process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is `undefined`

**Fixes:**
1. ✅ File is named `.env.local` (not `.envm_local` or anything else)
2. ✅ File is in `woodpecker/apps/web/` directory
3. ✅ Variable starts with `NEXT_PUBLIC_` (for client-side)
4. ✅ **RESTART dev server** after changing `.env.local`
5. ✅ No spaces around `=` sign
6. ✅ No quotes around values (unless needed)

### Issue 2: Wrong Prefix
**Symptom:** Using `VITE_` or `REACT_APP_` prefix

**Fix:**
- Next.js uses `NEXT_PUBLIC_` (not `VITE_` or `REACT_APP_`)

### Issue 3: Server Restart Needed
**Symptom:** Changed `.env.local` but variables still old

**Fix:**
1. Stop dev server: `Ctrl + C`
2. Start again: `npm run dev`

Next.js **NEVER** picks up new env variables without restart!

## 🛠️ **Helper Scripts**

### Check Your Environment
```powershell
.\CHECK_ENV.ps1
```

This will:
- ✅ Verify `.env.local` exists
- ✅ Check all required variables
- ✅ Validate variable formats
- ✅ Show missing/incorrect values

### Fix Environment Setup
```powershell
.\FIX_ENV_VARS.ps1
```

This will:
- ✅ Check for common issues
- ✅ Validate your setup
- ✅ Show reminders

### Create/Update .env.local
```powershell
.\CREATE_ENV_LOCAL.ps1
```

This will:
- ✅ Create `.env.local` with correct format
- ✅ Open it in Notepad for editing

## 📝 **Step-by-Step Fix**

1. **Run the check:**
   ```powershell
   .\CHECK_ENV.ps1
   ```

2. **If .env.local is missing or wrong:**
   ```powershell
   .\CREATE_ENV_LOCAL.ps1
   ```

3. **Edit `.env.local` and add your actual keys:**
   - Get Clerk keys: https://dashboard.clerk.com/last-active?path=api-keys
   - Replace `YOUR_KEY_HERE` with actual values

4. **Verify again:**
   ```powershell
   .\CHECK_ENV.ps1
   ```

5. **Restart dev server:**
   ```powershell
   cd woodpecker\apps\web
   npm run dev
   ```

## ✅ **Verification**

After setup, you should see:
- ✅ No Clerk errors in console
- ✅ Login/signup works
- ✅ No "Missing publishableKey" errors

## 🆘 **Still Not Working?**

1. **Check file location:**
   ```powershell
   Test-Path woodpecker\apps\web\.env.local
   ```
   Should return `True`

2. **Check file name:**
   ```powershell
   Get-ChildItem woodpecker\apps\web\.env*
   ```
   Should show `.env.local` (not `.envm_local` or anything else)

3. **Check variable names:**
   ```powershell
   Get-Content woodpecker\apps\web\.env.local | Select-String "NEXT_PUBLIC_CLERK"
   ```
   Should show your key

4. **Restart dev server** (most common fix!)

## 📚 **Reference**

- Next.js Env Docs: https://nextjs.org/docs/basic-features/environment-variables
- Clerk Setup: https://clerk.com/docs/quickstarts/nextjs

