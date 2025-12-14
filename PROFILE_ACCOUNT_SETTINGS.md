# Profile & Account Settings Integration

Complete backend and frontend implementation for user profile management and account settings.

## ✅ What Was Implemented

### Backend API Endpoints

#### User Profile Management
```
GET    /api/users/me           - Get current user profile
PATCH  /api/users/me           - Update user profile
PATCH  /api/users/me/password  - Change password
DELETE /api/users/me           - Delete account
```

### Backend Features

1. **User Schema Extended**
   - Added optional fields: `phoneNumber`, `timezone`, `preferredUnits`
   - All fields properly validated with class-validator

2. **Profile Update** (`PATCH /api/users/me`)
   - Update: firstName, lastName, email, phoneNumber, timezone, preferredUnits
   - Email uniqueness validation (can't use another user's email)
   - Returns updated user profile

3. **Password Change** (`PATCH /api/users/me/password`)
   - Requires current password verification
   - New password validation (min 8 characters)
   - Securely hashes new password with bcrypt
   - Returns success/error

4. **Account Deletion** (`DELETE /api/users/me`)
   - Permanently deletes user account
   - Should cascade delete related data (projects, etc.)
   - Cannot be undone

### Frontend Components

#### ProfileSettings Component
**Location:** `code/frontend/src/components/settings/ProfileSettings.tsx`

**Features:**
- ✅ Loads current user data from AuthContext
- ✅ First Name & Last Name fields (separate)
- ✅ Email address field
- ✅ Phone number (optional)
- ✅ Timezone selector (6 US timezones)
- ✅ Preferred units (US/Imperial or Metric)
- ✅ Save changes with loading state
- ✅ Account deletion with confirmation dialog
- ✅ Toast notifications for success/error

**API Integration:**
```typescript
import { usersApi } from "@/services/api/users";

// Update profile
await usersApi.updateProfile({
  firstName, lastName, email,
  phoneNumber, timezone, preferredUnits
});

// Delete account
await usersApi.deleteAccount();
```

#### AccountSettings Component
**Location:** `code/frontend/src/components/settings/AccountSettings.tsx`

**Features:**
- ✅ Password change form
  - Current password validation
  - New password (min 8 chars)
  - Confirm password matching
- ✅ Loading states
- ✅ Form validation
- ✅ Clear form after successful password change
- ✅ Toast notifications
- ⚠️ Active sessions (mock data - not implemented yet)
- ⚠️ Two-factor authentication (placeholder - not implemented yet)

**API Integration:**
```typescript
// Change password
await usersApi.changePassword({
  currentPassword,
  newPassword
});
```

### Frontend API Service
**Location:** `code/frontend/src/services/api/users.ts`

```typescript
export const usersApi = {
  getProfile: async (): Promise<User>
  updateProfile: async (data: UpdateProfileData): Promise<User>
  changePassword: async (data: ChangePasswordData): Promise<void>
  deleteAccount: async (): Promise<void>
}
```

## How to Test

### Backend Testing

```bash
# 1. Get user profile
curl http://localhost:3001/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 2. Update profile
curl -X PATCH http://localhost:3001/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1-555-123-4567",
    "timezone": "America/New_York",
    "preferredUnits": "metric"
  }'

# 3. Change password
curl -X PATCH http://localhost:3001/api/users/me/password \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "oldpassword123",
    "newPassword": "newpassword123"
  }'

# 4. Delete account
curl -X DELETE http://localhost:3001/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Frontend Testing

1. **Restart Frontend Container:**
   ```bash
   docker compose restart frontend
   ```

2. **Navigate to Settings:**
   - Login to the app
   - Click UserDropdown → Manage Account → Settings
   - Click "Profile" tab

3. **Test Profile Update:**
   - Update first name, last name, phone, timezone, or units
   - Click "Save Changes"
   - Should see success toast
   - Page refreshes with new data

4. **Test Password Change:**
   - Click "Account" tab
   - Fill in current password, new password, confirm password
   - Click "Update Password"
   - Should see success toast
   - Form clears
   - Try logging in with new password

5. **Test Account Deletion:**
   - Click "Profile" tab
   - Scroll to "Delete Account" section
   - Click "Delete My Account"
   - Confirm in dialog
   - Account deleted, logged out, redirected to welcome screen

## Security Features

1. **Authentication Required:** All endpoints use `JwtAuthGuard`
2. **Password Hashing:** Bcrypt with 10 salt rounds
3. **Email Uniqueness:** Cannot change to another user's email
4. **Password Verification:** Must provide current password to change
5. **Confirmation Dialog:** Account deletion requires explicit confirmation

## Data Flow

### Profile Update Flow
```
User edits form → Click "Save Changes" →
Frontend validation → usersApi.updateProfile() →
PATCH /api/users/me → UsersService.updateProfile() →
MongoDB update → Return updated user →
Success toast → Page refresh
```

### Password Change Flow
```
User fills password form → Click "Update Password" →
Frontend validation (matching, length) →
usersApi.changePassword() →
PATCH /api/users/me/password →
Verify current password → Hash new password →
Update MongoDB → Success → Clear form
```

### Account Deletion Flow
```
Click "Delete My Account" → Confirmation dialog →
User confirms → usersApi.deleteAccount() →
DELETE /api/users/me → Delete from MongoDB →
Logout user → Redirect to welcome screen
```

## Database Schema

### User Collection (Updated)
```javascript
{
  _id: ObjectId,
  firstName: string,
  lastName: string,
  email: string (unique, lowercase),
  password: string (bcrypt hashed),
  isActive: boolean (default: true),
  lastLoginAt: Date,
  phoneNumber: string (optional),
  timezone: string (optional),
  preferredUnits: string (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## Known Limitations / Future Enhancements

### Not Yet Implemented

1. **Session Management**
   - Active sessions list is mock data
   - No JWT refresh token rotation
   - No ability to revoke specific sessions
   - No device/browser fingerprinting

2. **Two-Factor Authentication**
   - Placeholder button only
   - No TOTP/SMS implementation
   - No backup codes

3. **Email Verification**
   - Email changes don't require verification
   - No verification emails sent
   - Could implement with email service

4. **Profile Photo Upload**
   - Button is disabled
   - Would need file upload endpoint
   - Image storage (S3, local, etc.)

5. **Cascade Deletion**
   - Account deletion should delete:
     - User's projects
     - User's flocks
     - User's logs and records
   - Currently only deletes user document

## Implementation Notes

### Why Page Refresh After Profile Update?

The ProfileSettings component calls `window.location.reload()` after a successful profile update. This is a simple approach to ensure:
- UserDropdown shows updated name
- All components reflect new user data
- AuthContext reloads from server

**Better Alternative:**
Update AuthContext directly without page refresh:
```typescript
// In AuthContext, add updateUser method
const updateUser = (updatedUser: User) => {
  setUser(updatedUser);
  localStorage.setItem('hobby-farm-user', JSON.stringify(updatedUser));
};

// In ProfileSettings
const updatedUser = await usersApi.updateProfile(data);
updateUser(updatedUser); // No page refresh needed!
```

### Password Hashing Performance

Bcrypt with 10 rounds is secure but slow (~100ms). For better UX:
- Show loading state immediately
- Don't block UI while hashing
- Consider using 12 rounds for higher security (production)

### Email Change Verification

Currently, users can change their email without verification. For production:
1. Send verification email to new address
2. User clicks link to confirm
3. Only then update email in database
4. Optionally notify old email of change

## File Reference

### Backend Files
```
code/backend/src/users/
├── dto/
│   ├── update-user.dto.ts (new)
│   └── change-password.dto.ts (new)
├── schemas/
│   └── user.schema.ts (updated)
├── users.controller.ts (new)
├── users.service.ts (updated)
└── users.module.ts (updated)
```

### Frontend Files
```
code/frontend/src/
├── services/api/
│   └── users.ts (new)
├── components/settings/
│   ├── ProfileSettings.tsx (updated)
│   └── AccountSettings.tsx (updated)
└── types/index.ts (User interface updated)
```

## Summary

✅ **Backend:** Fully implemented with validation, security, and error handling
✅ **Frontend:** Complete UI with forms, validation, loading states, and error handling
✅ **Integration:** API calls working, data persisting to MongoDB
⚠️ **Production Ready:** Add email verification, cascade deletion, and session management

Your Profile and Account settings are now fully functional and connected to the backend API! 🎉
