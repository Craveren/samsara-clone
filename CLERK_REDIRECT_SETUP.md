# 🔄 Clerk Redirect Setup Guide

## ✅ **What Was Fixed**

1. ✅ Added explicit redirect URLs to SignIn/SignUp components
2. ✅ Updated middleware to protect routes properly
3. ✅ Configured afterSignInUrl and afterSignUpUrl to `/dashboard`

## ⚙️ **Clerk Dashboard Configuration (REQUIRED)**

You **MUST** configure redirect URLs in your Clerk dashboard for redirects to work!

### Step 1: Go to Clerk Dashboard

1. Visit: https://dashboard.clerk.com
2. Select your application
3. Go to **"Paths"** in the sidebar (or **"Configure"** → **"Paths"**)

### Step 2: Configure Allowed Redirect URLs

Add these URLs to **"Allowed redirect URLs"**:

```
http://localhost:3000/dashboard
http://localhost:3000
```

For production, also add:
```
https://yourdomain.com/dashboard
https://yourdomain.com
```

### Step 3: Configure Sign-In/Sign-Up Paths

In **"Paths"** settings:

- **Sign-in path:** `/sign-in`
- **Sign-up path:** `/sign-up`
- **After sign-in URL:** `/dashboard`
- **After sign-up URL:** `/dashboard`

### Step 4: Save Changes

Click **"Save"** in the Clerk dashboard.

## 🔍 **How It Works Now**

### Sign In Flow:
1. User visits `/sign-in`
2. User signs in with Clerk
3. Clerk redirects to `/dashboard` (afterSignInUrl)
4. Middleware protects `/dashboard` route

### Sign Up Flow:
1. User visits `/sign-up`
2. User creates account with Clerk
3. Clerk redirects to `/dashboard` (afterSignUpUrl)
4. Middleware protects `/dashboard` route

## 🚨 **Common Issues**

### Issue 1: "Redirect URL not allowed"
**Symptom:** Error after sign-in/sign-up

**Fix:**
- Go to Clerk Dashboard → Paths
- Add `http://localhost:3000/dashboard` to allowed redirect URLs
- Save and try again

### Issue 2: Stuck on sign-in page
**Symptom:** After signing in, still on sign-in page

**Fix:**
1. Check Clerk dashboard redirect URLs
2. Clear browser cache/cookies
3. Check browser console for errors
4. Verify `afterSignInUrl="/dashboard"` in code

### Issue 3: Redirects to wrong page
**Symptom:** Goes to `/` instead of `/dashboard`

**Fix:**
- Check that `afterSignInUrl` and `afterSignUpUrl` are set to `/dashboard`
- Verify Clerk dashboard settings match

## ✅ **Verification Checklist**

- [ ] Clerk dashboard has redirect URLs configured
- [ ] `afterSignInUrl="/dashboard"` in SignIn component
- [ ] `afterSignUpUrl="/dashboard"` in SignUp component
- [ ] Middleware protects `/dashboard` route
- [ ] `/dashboard` page exists and works
- [ ] Test sign-in flow end-to-end
- [ ] Test sign-up flow end-to-end

## 🧪 **Testing**

1. **Start dev server:**
   ```powershell
   cd woodpecker\apps\web
   npm run dev
   ```

2. **Test sign-in:**
   - Go to http://localhost:3000/sign-in
   - Sign in
   - Should redirect to http://localhost:3000/dashboard

3. **Test sign-up:**
   - Go to http://localhost:3000/sign-up
   - Create account
   - Should redirect to http://localhost:3000/dashboard

## 📝 **Code Changes Made**

### SignIn Component (`app/sign-in/[[...sign-in]]/page.tsx`)
```tsx
<SignIn 
  routing="path"
  path="/sign-in"
  signUpUrl="/sign-up"
  afterSignInUrl="/dashboard"
  afterSignUpUrl="/dashboard"
/>
```

### SignUp Component (`app/sign-up/[[...sign-up]]/page.tsx`)
```tsx
<SignUp 
  routing="path"
  path="/sign-up"
  signInUrl="/sign-in"
  afterSignInUrl="/dashboard"
  afterSignUpUrl="/dashboard"
/>
```

### Middleware (`middleware.ts`)
- Now properly protects routes
- Allows public routes (/, /sign-in, /sign-up)
- Requires auth for /dashboard and other protected routes

## 🆘 **Still Not Working?**

1. **Check Clerk dashboard:**
   - Go to https://dashboard.clerk.com
   - Verify redirect URLs are set
   - Check for any error messages

2. **Check browser console:**
   - Open DevTools (F12)
   - Look for Clerk errors
   - Check Network tab for failed requests

3. **Verify environment variables:**
   ```powershell
   .\CHECK_ENV.ps1
   ```

4. **Clear browser data:**
   - Clear cookies for localhost
   - Clear cache
   - Try incognito mode

5. **Check middleware:**
   - Verify middleware.ts is in `woodpecker/apps/web/`
   - Check that it exports correctly

## 📚 **Reference**

- Clerk Next.js Docs: https://clerk.com/docs/quickstarts/nextjs
- Clerk Redirects: https://clerk.com/docs/authentication/custom-flows/redirects
- Clerk Paths: https://clerk.com/docs/authentication/paths

