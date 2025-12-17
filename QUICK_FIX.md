# 🚀 Quick Fix Guide

## The Error You're Seeing

```
Error: @clerk/nextjs: Missing publishableKey
```

This means your Clerk authentication keys are not set in `.env.local`.

## ✅ Solution (3 Steps)

### Step 1: Run the Auto-Fix Script

```powershell
.\FIX_WOODPECKER_V2.ps1
```

This will:
- ✅ Install all missing dependencies
- ✅ Fix middleware
- ✅ Create .env.local if missing
- ✅ Check everything

### Step 2: Get Your Clerk Keys

1. Go to: https://dashboard.clerk.com/sign-up
2. Create a free account
3. Create a new application
4. Go to: https://dashboard.clerk.com/last-active?path=api-keys
5. Copy your keys:
   - **Publishable Key** (starts with `pk_test_...`)
   - **Secret Key** (starts with `sk_test_...`)

### Step 3: Add Keys to .env.local

Open: `woodpecker\apps\web\.env.local`

Replace:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
```

With your actual keys:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_51AbC123...
CLERK_SECRET_KEY=sk_test_xyz789...
```

### Step 4: Start the App

```powershell
cd woodpecker\apps\web
npm run dev
```

Open: http://localhost:3000

## 🎯 Alternative: Use Setup Script

```powershell
.\SETUP_ENV.ps1
```

This will open `.env.local` in Notepad for you to edit.

## ✅ All Fixed Files

- ✅ `middleware.ts` - Updated to Clerk v5 API
- ✅ `use-confirm.ts` - Fixed JSX syntax
- ✅ `package.json` - Added tailwind-merge
- ✅ `.env.local.example` - Template created

## 🆘 Still Having Issues?

1. Make sure you're in the right directory:
   ```powershell
   cd C:\Users\Mahlatse\Desktop\Samsara_Clone-master
   ```

2. Check if .env.local exists:
   ```powershell
   Test-Path woodpecker\apps\web\.env.local
   ```

3. Verify keys are set:
   ```powershell
   Get-Content woodpecker\apps\web\.env.local | Select-String "CLERK"
   ```

You should see your actual keys (not the placeholder text).

