# Environment Variables Setup

## Required: Create `.env.local` file

Create a file named `.env.local` in the `woodpecker/apps/web/` directory with the following content:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
```

## How to Get Your Clerk Keys

1. Go to https://dashboard.clerk.com
2. Sign in or create an account
3. Create a new application (or select existing one)
4. Go to **API Keys** section
5. Copy:
   - **Publishable key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret key** → `CLERK_SECRET_KEY`

## Optional Variables

```env
# Webhook Secret (for user sync)
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Stream Chat (for messaging features)
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# Custom Routes
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding/account-type
```

## Important Notes

- The file must be named exactly `.env.local` (with the dot at the beginning)
- No quotes around the values
- No spaces around the `=` sign
- Restart the dev server after creating/updating the file

## Quick Setup Command (PowerShell)

```powershell
cd woodpecker/apps/web
@"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
"@ | Out-File -FilePath .env.local -Encoding utf8
```

Then edit `.env.local` and replace the placeholder values with your actual Clerk keys.

