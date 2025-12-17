# 🚀 Quick Start - Database Setup

## ⚡ FASTEST WAY (Just Run This!)

**Double-click this file:**
```
woodpecker/setup-database.bat
```

OR run this command:
```powershell
cd C:\Users\Mahlatse\Desktop\Samsara_Clone-master\woodpecker
npm run db:setup
```

That's it! The script will automatically:
1. ✅ Set DATABASE_URL environment variable
2. ✅ Generate Prisma Client
3. ✅ Create all database tables (Client, BankAccount, Transaction, etc.)
4. ✅ Verify everything works

## 📋 What Gets Created

The script creates all these tables in your Neon database:
- `Client` - User accounts
- `BankAccount` - Connected bank accounts
- `Transaction` - Financial transactions
- `FinancialProfile` - User financial data
- `FinancialInsight` - AI-generated insights
- `Legacy` - Estate planning projects
- `EstateTask` - Tasks for legacies
- `Document` - Estate documents
- `Beneficiary` - Legacy beneficiaries
- `Professional` - Lawyers/advisors
- `Executor` - Estate executors
- `Invitation` - Invitation system
- And more...

## 🔧 Troubleshooting

### Error: "EPERM: operation not permitted"
**Solution:** Stop your dev server first (Ctrl+C), wait 5 seconds, then run the script again.

### Error: "Environment variable not found: DATABASE_URL"
**Solution:** The script sets this automatically. If you see this, make sure you're running from `woodpecker/` directory.

### Error: "The table `public.Client` does not exist"
**Solution:** Run the setup script - it will create all tables.

## ✅ After Setup

1. **Restart your dev server:**
   ```powershell
   npm run dev
   ```

2. **Log in through Clerk** - The `Client` table will be populated automatically

3. **Verify it worked:**
   ```powershell
   npm run db:studio
   ```
   This opens Prisma Studio where you can see all your tables.

## 📝 Making DATABASE_URL Permanent

To avoid setting it every time, create `woodpecker/.env`:
```env
DATABASE_URL="postgresql://<USER>:<PASSWORD>@<HOST>/<DB>?sslmode=require&pgbouncer=true"
STITCH_CLIENT_ID="your_stitch_client_id"
STITCH_CLIENT_SECRET="your_stitch_client_secret"
STITCH_BASE_URL="https://api.stitch.money"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🎯 Success Indicators

After running the script, you should see:
```
[OK] Database schema pushed successfully
[OK] All tables created (Client, BankAccount, Transaction, etc.)
[OK] Client table exists with 0 records
[OK] Setup Complete!
```

Then when you restart your app and log in, all P2021 errors will be gone! 🎉

