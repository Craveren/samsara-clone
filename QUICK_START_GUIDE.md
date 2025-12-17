# 🚀 Quick Start Guide - Woodpecker Lifebook

## Getting Started

### Step 1: Navigate to Project Directory
```powershell
cd "C:\Users\Mahlatse\Desktop\Samsara_Clone-master"
```

### Step 2: Start the App

**Option A: Use Startup Script (Easiest)**
```powershell
.\START_APP.ps1
```

**Option B: Manual Start**
```powershell
# Install dependencies (first time only)
npm install

# Start the app
npm start
```

### Step 3: Open Browser
The app will automatically open at: **http://localhost:3000**

---

## 🔧 Troubleshooting

### "package.json not found" Error

**Solution 1: Check Your Directory**
```powershell
# Verify you're in the right place
Get-Location
# Should show: C:\Users\Mahlatse\Desktop\Samsara_Clone-master

# List files to confirm
dir package.json
```

**Solution 2: Use Full Path**
```powershell
cd "C:\Users\Mahlatse\Desktop\Samsara_Clone-master"
npm start
```

### "node_modules not found" Error

**Solution:**
```powershell
npm install
```

### Port Already in Use

**Solution:**
```powershell
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Or use a different port
set PORT=3001
npm start
```

### Module Not Found Errors

**Solution:**
```powershell
# Clear cache and reinstall
rm -r node_modules
rm package-lock.json
npm install
```

---

## 📋 Prerequisites Check

Run these commands to verify your environment:

```powershell
# Check Node.js version (should be >= 18.0.0)
node --version

# Check npm version (should be >= 8.0.0)
npm --version

# Verify package.json exists
Test-Path package.json
```

---

## 🎯 Default Login Credentials

For development/testing:
- **Email**: `shaheryar11shaheryar@gmail.com`
- **Password**: `admin`

---

## 📝 Available Commands

```powershell
# Development
npm start              # Start dev server
npm run build          # Build for production
npm test               # Run tests

# Analysis
npm run analyze        # Analyze bundle size
npm run lint           # Run linter
```

---

## 🆘 Still Having Issues?

1. **Check Node.js version**: Must be >= 18.0.0
2. **Clear npm cache**: `npm cache clean --force`
3. **Delete node_modules and reinstall**: `rm -r node_modules && npm install`
4. **Check for conflicting processes**: Make sure port 3000 is free
5. **Verify file permissions**: Ensure you have read/write access

---

## ✅ Success Indicators

When the app starts successfully, you should see:
- ✅ "Compiled successfully!" message
- ✅ Browser opens automatically to http://localhost:3000
- ✅ No red errors in the terminal
- ✅ App loads with login page

---

**Need Help?** Check `APP_DIAGNOSIS_AND_FIXES.md` for detailed information about fixes and improvements.

