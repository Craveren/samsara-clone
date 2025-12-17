# 🚀 START HERE - Woodpecker Quick Start

## ✅ All Fixes Applied

- ✅ Middleware fixed (Clerk v5)
- ✅ Dependencies installed
- ✅ Turborepo configured
- ✅ Scripts fixed

## 🎯 Two Ways to Start

### Option 1: Use Helper Script (Easiest)

**From the root directory** (`C:\Users\Mahlatse\Desktop\Samsara_Clone-master`):

```powershell
# Step 1: Create .env.local (if not done)
.\CREATE_ENV_LOCAL.ps1

# Step 2: Add your Clerk keys in Notepad (that opens)

# Step 3: Start the app
.\START_WOODPECKER.ps1
```

### Option 2: Direct Commands

```powershell
# Navigate to web app
cd woodpecker\apps\web

# Make sure .env.local exists with Clerk keys
# (Edit it if needed)

# Start dev server
npm run dev
```

## ⚠️ IMPORTANT: Add Clerk Keys

**Location:** `woodpecker\apps\web\.env.local`

**Required keys:**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY
CLERK_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY
```

**Get keys from:** https://dashboard.clerk.com/last-active?path=api-keys

## 🐛 Common Issues Fixed

### Issue: "Missing packageManager field"
✅ **Fixed** - Added to root `package.json`

### Issue: "Cannot find path woodpecker\apps\web"
✅ **Fixed** - Scripts now use correct paths

### Issue: "Module not found: tailwind-merge"
✅ **Fixed** - Added to `apps/web/package.json`

### Issue: "authMiddleware is not exported"
✅ **Fixed** - Updated to `clerkMiddleware` from `@clerk/nextjs/server`

## 📍 Current Status

- ✅ All dependencies installed
- ✅ Middleware configured correctly
- ✅ Scripts working
- ⚠️ **YOU NEED TO:** Add Clerk keys to `.env.local`

## 🎉 Once Keys Are Added

The app will start at: **http://localhost:3000**

You'll see:
- Landing page with sign-in/sign-up
- Dashboard after authentication
- Tasks board with drag & drop
- All pages working

