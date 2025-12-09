# Next Steps Checklist

## ✅ Immediate Actions (Do These Now)

### 1. Install Dependencies
```bash
cd /Users/steliv/Development/hobby-farm
npm install
```

**Expected packages to install:**
- react-router-dom (routing)
- @types/react, @types/react-dom (TypeScript types)
- typescript (TypeScript compiler)
- And other updated versions

### 2. Test the Build
```bash
npm run lint
```

This will check for TypeScript errors. Don't worry about errors in existing components - they'll be fixed during migration.

### 3. Review the Architecture
Read these files in order:
1. [ ] `REFACTOR_SUMMARY.md` - Overview of changes
2. [ ] `ARCHITECTURE.md` - Detailed architecture guide
3. [ ] `ARCHITECTURE_VISUAL.md` - Visual diagrams
4. [ ] `MIGRATION.md` - How to update components
5. [ ] `QUICK_REFERENCE.md` - Adding new features

---

## 🔄 Component Migration (Do These Next)

### Phase 1: Auth Components (Highest Priority)

These need updating to work with the new routing system:

- [ ] **WelcomeScreen.tsx**
  - Remove: `onSignIn`, `onCreateAccount` props
  - Add: `useNavigate()` hook
  - Navigate to: `ROUTES.AUTH.SIGNIN`, `ROUTES.AUTH.SIGNUP`

- [ ] **SignUpScreen.tsx**
  - Remove: `onSignUp`, `onSignInClick` props
  - Add: `useAuth()` hook for `register()`
  - Add: `useNavigate()` for routing
  - Navigate to: `ROUTES.PROJECTS` after signup

- [ ] **SignInScreen.tsx**
  - Remove: `onSignIn`, `onCreateAccountClick`, `onForgotPasswordClick` props
  - Add: `useAuth()` hook for `login()`
  - Add: `useNavigate()` for routing
  - Navigate to: `ROUTES.PROJECTS` after login

- [ ] **ForgotPasswordScreen.tsx**
  - Remove: `onSendResetLink`, `onBackToSignIn` props
  - Add: `useAuth()` hook for `requestPasswordReset()`
  - Add: `useNavigate()` for routing

- [ ] **PasswordResetConfirmation.tsx**
  - Remove: `onReturnToSignIn` prop
  - Add: `useNavigate()` for routing

### Phase 2: Project Components

- [ ] **ProjectsDashboard.tsx**
  - Remove: All props (`projects`, `onCreateNew`, `onOpenProject`, etc.)
  - Add: `useProjects()` for data
  - Add: `useProjectOperations()` for operations
  - Add: `useAuth()` for logout
  - Add: `useNavigate()` for routing

### Phase 3: Layout Components

- [ ] **MainAppLayout.tsx**
  - Remove: Props-based approach
  - Add: `useLocation()` to get current route
  - Add: `useNavigate()` for tab changes
  - Add: `useProjects()` for current project
  - Add: `<Outlet />` for child routes

### Phase 4: Dashboard Components

- [ ] **FarmDashboard.tsx**
  - Remove: `farm` prop
  - Add: `useProjects()` to get `currentProject`
  - Add: `useNavigate()` for module navigation

### Phase 5: Onboarding

- [ ] **OnboardingFlow.tsx**
  - Remove: `onComplete`, `onCancel` props
  - Add: `useProjectOperations()` for `handleCreateProject`
  - Add: `useNavigate()` for routing

### Phase 6: Other Components

- [ ] **MapScreen.tsx**
- [ ] **CalendarScreen.tsx**
- [ ] **ModulesScreen.tsx**
- [ ] **SettingsScreen.tsx**

---

## 🎨 Example Migration (Reference)

### Before (Old Way)
```tsx
interface SignInScreenProps {
  onSignIn: (data: { email: string; password: string }) => void;
  onCreateAccountClick: () => void;
  onForgotPasswordClick: () => void;
}

export function SignInScreen({
  onSignIn,
  onCreateAccountClick,
  onForgotPasswordClick
}: SignInScreenProps) {
  const handleSubmit = (data) => {
    onSignIn(data);
  };
  // ...
}
```

### After (New Way)
```tsx
import { useAuth } from '@/contexts';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { toast } from 'sonner';

export function SignInScreen() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success('Signed in successfully!');
      navigate(ROUTES.PROJECTS);
    } catch (error) {
      toast.error('Invalid credentials');
    }
  };

  const handleCreateAccountClick = () => {
    navigate(ROUTES.AUTH.SIGNUP);
  };

  const handleForgotPasswordClick = () => {
    navigate(ROUTES.AUTH.FORGOT_PASSWORD);
  };
  
  // ... rest of component
}
```

---

## 🧪 Testing Steps (After Migration)

### 1. Auth Flow
- [ ] Go to `/welcome`
- [ ] Click "Create Account"
- [ ] Fill form and submit
- [ ] Should redirect to `/projects`
- [ ] Logout
- [ ] Sign in again
- [ ] Should redirect to `/projects`

### 2. Projects Flow
- [ ] Create a new project
- [ ] Should appear in list
- [ ] Open the project
- [ ] Should navigate to `/app/dashboard`
- [ ] See project details

### 3. Navigation
- [ ] Click different tabs
- [ ] URL should update
- [ ] Browser back button should work
- [ ] Refresh page - should stay on same page

### 4. State Persistence
- [ ] Login
- [ ] Refresh page
- [ ] Should still be logged in
- [ ] Select a project
- [ ] Refresh page
- [ ] Project should still be selected

---

## 🚀 Switch to New App

### When All Components Are Updated

1. **Backup old App**
```bash
mv src/App.tsx src/App.old.tsx
```

2. **Activate new App**
```bash
mv src/App.new.tsx src/App.tsx
```

3. **Update main.tsx** (if needed)
```tsx
import App from "./App.tsx";  // Should now point to new version
```

4. **Test everything**
```bash
npm run dev
```

---

## 🎯 Future Enhancements (Optional)

### Add More Services

- [ ] Create `poultry.service.ts`
  - getFlocks()
  - createFlock()
  - logEggs()
  - logFeed()

- [ ] Create `maple.service.ts`
  - getTrees()
  - createTree()
  - logCollection()
  - logBoilSession()

- [ ] Create `task.service.ts`
  - getTasks()
  - createTask()
  - updateTask()
  - deleteTask()

### Add More Contexts

- [ ] `PoultryContext.tsx` - Poultry module state
- [ ] `MapleContext.tsx` - Maple module state
- [ ] `TaskContext.tsx` - Task management state

### Add More Hooks

- [ ] `usePoultryOperations.ts`
- [ ] `useMapleOperations.ts`
- [ ] `useTaskOperations.ts`

---

## 📊 Progress Tracking

### Overall Progress: 0% Complete

- [ ] Dependencies installed
- [ ] Architecture reviewed
- [ ] Auth components migrated (0/5)
- [ ] Project components migrated (0/1)
- [ ] Layout components migrated (0/1)
- [ ] Dashboard components migrated (0/1)
- [ ] Onboarding migrated (0/1)
- [ ] Other components migrated (0/4)
- [ ] All components tested
- [ ] Switched to new App
- [ ] Full app tested

---

## 🆘 If You Get Stuck

### Common Issues

**TypeScript errors about missing modules**
- Run `npm install`
- Restart VS Code

**Components don't have the right props**
- See `MIGRATION.md` for examples
- Use hooks instead of props

**Routing not working**
- Check `BrowserRouter` is in `App.tsx`
- Check routes are defined in `ROUTES`

**Context not working**
- Check providers are in `App.tsx`
- Check you're using hooks inside provider tree

### Resources

1. `MIGRATION.md` - Step-by-step migration guide
2. `QUICK_REFERENCE.md` - Code patterns and examples
3. `ARCHITECTURE.md` - Full architectural docs
4. `ARCHITECTURE_VISUAL.md` - Visual diagrams

---

## ✨ You're Ready!

The architecture is in place. Now it's just a matter of updating the components to use the new patterns. Take it one component at a time, and you'll have a professional, scalable application in no time!

**Start with the auth components** - they're the most critical and will teach you the patterns you'll use everywhere else.

Good luck! 🚀
