# ✅ Clean Multi-Role System for Woodpecker

## 🎯 **What This System Does**

**One Gmail account → Multiple account types → Instant switching → No forced logins → Auto DB creation**

This is the clean, modern architecture used by apps like Uber, Fiverr, and Stripe.

---

## 🧱 **Three-Layer Architecture**

### **Layer 1: Auth Layer (Clerk)**
Clerk stores:
```typescript
publicMetadata: {
  activeRole: "client",  // Currently active role
  roles: ["client", "lawyer"]  // All roles user has
}
```

### **Layer 2: Database Layer (Prisma)**
- Separate tables: `Client`, `Professional`
- Auto-creates records when switching roles
- No manual account creation needed

### **Layer 3: UI Modal System**
Three clean modals:
1. **ChooseRoleModal** - First-time role selection
2. **SwitchRoleModal** - Switch between existing roles
3. **CompleteProfileModal** - Optional profile completion

---

## 📁 **File Structure**

```
lib/
  roles/
    role-system.ts          # Core role utilities
  hooks/
    use-role.ts            # Clean role management hook
components/
  modals/
    ChooseRoleModal.tsx    # Modal 1: Choose role
    SwitchRoleModal.tsx    # Modal 2: Switch role
    CompleteProfileModal.tsx # Modal 3: Complete profile
  account/
    AccountSwitcher.tsx    # Updated to use modals
app/
  api/
    roles/
      me/route.ts          # GET user's roles
      activate/route.ts     # POST activate role
```

---

## 🔄 **How It Works**

### **1. User Signs Up**
- No onboarding forced
- Show `ChooseRoleModal`
- User clicks role → DB record created → `activeRole` set → Redirect to dashboard

### **2. User Wants to Switch**
- Click "Switch Account Type"
- Show `SwitchRoleModal`
- User clicks role → DB record created (if missing) → `activeRole` updated → Redirect

### **3. Optional Profile Completion**
- If role requires extra info, show `CompleteProfileModal` after switching
- Only shown if `roleInfo.requiresProfile === true`

---

## 🚀 **Key Features**

✅ **Instant Switching** - No sign-in required for same user
✅ **Auto DB Creation** - Records created automatically
✅ **Clean Modals** - No confusing onboarding flows
✅ **Separate Billing** - Each role has separate billing
✅ **Scalable** - Easy to add new roles
✅ **Predictable** - Clear separation of concerns

---

## 📝 **Usage**

### **In Components:**
```typescript
import { useRole } from '@/lib/hooks'

function MyComponent() {
  const { activeRole, availableRoles, switchRole, isLoading } = useRole()
  
  return (
    <button onClick={() => switchRole('lawyer')}>
      Switch to Lawyer
    </button>
  )
}
```

### **In API Routes:**
```typescript
import { activateRole, getRoleMetadata } from '@/lib/roles/role-system'

// Activate a role
const result = await activateRole(userId, 'lawyer', { email, name })

// Get role metadata
const metadata = await getRoleMetadata(userId)
```

---

## 🔧 **Migration Notes**

- Old system used `role` in metadata → New system uses `activeRole`
- Middleware supports both for backward compatibility
- Old API routes (`/api/auth/set-account-type`) now use new system internally
- All account switching now goes through `/api/roles/activate`

---

## ✅ **What's Fixed**

- ❌ No more signup madness
- ❌ No more role deletion bugs
- ❌ No more forced sign-in
- ❌ No more role not found errors
- ❌ No more dashboards failing
- ❌ No more metadata corruption
- ❌ No more onboarding loops

Instead:
- ✅ Instant role-switching
- ✅ One user, many accounts
- ✅ Auto DB creation
- ✅ Clean UI modals
- ✅ Scalable architecture
- ✅ Consistent dashboards
- ✅ Predictable logic

