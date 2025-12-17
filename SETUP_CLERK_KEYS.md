# 🔑 Setting Up Clerk Authentication Keys

## Quick Setup

1. **Create a free Clerk account:**
   - Go to: https://dashboard.clerk.com/sign-up
   - Sign up with email or GitHub

2. **Create a new application:**
   - Click "Create Application"
   - Name it "Woodpecker" (or anything you like)
   - Choose authentication methods (Email, Google, etc.)

3. **Get your API keys:**
   - Go to: https://dashboard.clerk.com/last-active?path=api-keys
   - Or navigate: **API Keys** in the sidebar
   - You'll see:
     - **Publishable Key** (starts with `pk_test_...`)
     - **Secret Key** (starts with `sk_test_...`)

4. **Add keys to .env.local:**
   - Open: `woodpecker/apps/web/.env.local`
   - Replace the placeholder values:
     ```env
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
     CLERK_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE
     ```

5. **Save and restart:**
   - Save the `.env.local` file
   - Restart your dev server (`npm run dev`)

## Testing Without Clerk (Development Only)

If you want to test the app without Clerk first, you can temporarily comment out the ClerkProvider in `app/layout.tsx`, but authentication features won't work.

## Need Help?

- Clerk Docs: https://clerk.com/docs
- Clerk Dashboard: https://dashboard.clerk.com
- Support: https://clerk.com/support

