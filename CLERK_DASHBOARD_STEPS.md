# 🎯 Clerk Dashboard Configuration - Step by Step

## 🚀 Quick Start

Run this script to open Clerk dashboard with instructions:
```powershell
.\AUTO_CONFIGURE_CLERK.ps1
```

## 📋 Manual Steps (If Script Doesn't Work)

### Step 1: Open Clerk Dashboard
Go to: **https://dashboard.clerk.com/last-active?path=paths**

Or navigate manually:
1. Go to https://dashboard.clerk.com
2. Select your application
3. Click **"Paths"** in the left sidebar

### Step 2: Configure Allowed Redirect URLs

1. Scroll down to **"Allowed redirect URLs"** section
2. Click **"Add URL"** button
3. Add this URL (one at a time):
   ```
   http://localhost:3000/dashboard
   ```
4. Click **"Add URL"** again and add:
   ```
   http://localhost:3000
   ```

### Step 3: Configure After Sign-In/Up URLs

1. Find **"After sign-in URL"** field
2. Enter:
   ```
   /dashboard
   ```

3. Find **"After sign-up URL"** field
4. Enter:
   ```
   /dashboard
   ```

### Step 4: Save Settings

1. Scroll to bottom of page
2. Click **"Save"** button
3. Wait for **"Settings saved"** confirmation message

## ✅ Verification Checklist

After configuration, verify:

- [ ] `http://localhost:3000/dashboard` is in allowed redirect URLs
- [ ] `http://localhost:3000` is in allowed redirect URLs
- [ ] After sign-in URL is set to `/dashboard`
- [ ] After sign-up URL is set to `/dashboard`
- [ ] Settings are saved (green confirmation message)

## 🧪 Test It

1. **Start dev server:**
   ```powershell
   cd woodpecker\apps\web
   npm run dev
   ```

2. **Test sign-in:**
   - Go to: http://localhost:3000/sign-in
   - Sign in with your account
   - Should automatically redirect to: http://localhost:3000/dashboard

3. **Test sign-up:**
   - Go to: http://localhost:3000/sign-up
   - Create new account
   - Should automatically redirect to: http://localhost:3000/dashboard

## 🚨 Troubleshooting

### Issue: "Redirect URL not allowed"
**Fix:** Make sure `http://localhost:3000/dashboard` is in allowed redirect URLs list

### Issue: Still on sign-in page after signing in
**Fix:** 
1. Clear browser cookies for localhost
2. Verify After sign-in URL is `/dashboard` (not `/dashboard/`)
3. Restart dev server

### Issue: Goes to home page instead of dashboard
**Fix:** Check that After sign-in URL is exactly `/dashboard` (with leading slash, no trailing slash)

## 📸 Visual Guide

### Clerk Dashboard Paths Page Should Look Like:

```
┌─────────────────────────────────────────┐
│ Paths Configuration                     │
├─────────────────────────────────────────┤
│                                         │
│ Sign-in path: /sign-in                  │
│ Sign-up path: /sign-up                  │
│                                         │
│ Allowed redirect URLs:                  │
│ ┌───────────────────────────────────┐ │
│ │ http://localhost:3000/dashboard   │ │
│ │ http://localhost:3000              │ │
│ └───────────────────────────────────┘ │
│                                         │
│ After sign-in URL: /dashboard          │
│ After sign-up URL: /dashboard          │
│                                         │
│                    [Save]               │
└─────────────────────────────────────────┘
```

## 🔗 Direct Links

- **Paths Settings:** https://dashboard.clerk.com/last-active?path=paths
- **API Keys:** https://dashboard.clerk.com/last-active?path=api-keys
- **Users:** https://dashboard.clerk.com/last-active?path=users

