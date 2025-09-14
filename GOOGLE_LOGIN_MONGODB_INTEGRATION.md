# Google Login with MongoDB Integration

This document explains how Google authentication is integrated with MongoDB to ensure seamless user data access and profile management.

## Overview

When a user logs in with Google, the system:
1. Authenticates with Firebase/Google
2. Extracts user data from Google profile
3. Saves/updates user data in MongoDB
4. Provides seamless access to user profile data

## Implementation Details

### Backend Integration

#### 1. Firebase Auth Controller (`server/controllers/firebaseAuthController.js`)

**Firebase Login Endpoint**: `POST /api/auth/firebase-login`
- Verifies Firebase token
- Extracts Google user data (name, email, picture, phone)
- Creates new user in MongoDB if doesn't exist
- Updates existing user with Google data
- Returns JWT token for session management

**Key Features**:
- Automatic user creation from Google data
- Profile picture sync from Google
- Name parsing (first/last name)
- Phone number integration
- Email verification status

#### 2. User Model Updates (`server/models/User.js`)

**Enhanced Fields**:
- `firebaseUid`: Links MongoDB user to Firebase/Google account
- `avatar`: Stores Google profile picture URL
- `password`: Made optional for Google auth users
- All standard profile fields supported

#### 3. Routes (`server/routes/authRoutes.js`)

**New Routes**:
- `POST /auth/firebase-login` - Google login with MongoDB sync
- `POST /auth/firebase-signup` - Google signup with MongoDB creation
- `GET /auth/profile` - Fetch complete user profile from MongoDB
- `PUT /auth/profile` - Update user profile in MongoDB

### Frontend Integration

#### 1. Auth Context (`client/src/context/AuthContext.js`)

**Google Login Flow**:
```javascript
const googleLogin = async () => {
  // 1. Authenticate with Google/Firebase
  const result = await firebaseAuthService.signInWithGoogle();
  
  // 2. Send Firebase token to backend
  const response = await authAPI.firebaseLogin(result.token);
  
  // 3. Store JWT token and user data
  localStorage.setItem('token', response.data.token);
  
  // 4. Update app state with MongoDB user data
  dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
};
```

#### 2. Profile Component (`client/src/pages/Profile/Profile.js`)

**Enhanced Features**:
- Fetches complete user data from MongoDB
- Displays Google profile picture
- Shows verification status (email/phone)
- Supports editing all profile fields
- Real-time data sync with database

**Profile Data Displayed**:
- Name (from Google or manual entry)
- Email (from Google, read-only)
- Phone number
- Profile picture (from Google)
- Date of birth
- Address details
- Driving license information
- Account verification status
- Member since date

#### 3. Firebase Auth Buttons (`client/src/components/FirebaseAuthButtons.js`)

**Google Login Button**:
- Handles Google authentication
- Integrates with MongoDB backend
- Provides error handling
- Shows loading states

## Data Flow

### First-Time Google Login
1. User clicks "Continue with Google"
2. Google authentication popup
3. Firebase returns user token with Google data
4. Backend verifies token and extracts:
   - `uid`: Firebase user ID
   - `email`: Google email
   - `name`: Full name from Google
   - `picture`: Profile picture URL
   - `phone_number`: Phone (if available)
5. New user created in MongoDB with Google data
6. JWT token returned for session management
7. User redirected to dashboard with complete profile

### Returning User Login
1. User clicks "Continue with Google"
2. Google authentication
3. Backend finds existing user by `email` (primary check)
4. **Resyncs all Google data** (name, picture, phone, verification status)
5. Updates `firebaseUid` if not set
6. Returns updated user profile from MongoDB
7. User logged in with refreshed Google data + saved profile data

### Profile Management
1. User visits profile page
2. Complete data fetched from MongoDB via `GET /auth/profile`
3. User can edit and update profile
4. Changes saved to MongoDB via `PUT /auth/profile`
5. Profile completion status tracked

## Key Benefits

### 1. Seamless User Experience
- Single sign-on with Google
- Automatic profile picture sync
- No need to re-enter basic information
- Persistent data across sessions
- **Automatic data resyncing on each login**

### 2. Complete Data Management
- All user data stored in MongoDB
- Full profile editing capabilities
- Address and license information
- Booking history and preferences
- **No duplicate users with same email**

### 3. Security & Verification
- Firebase handles Google authentication
- JWT tokens for API security
- Email verification from Google
- Phone verification when available
- **Database-level unique constraints**

### 4. Flexibility
- Users can complete profile after Google login
- Support for both Google and email/password login
- Profile data independent of authentication method
- **Handles existing users gracefully**

## Environment Variables Required

### Client (.env)
```
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
```

### Server (.env)
```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
JWT_SECRET=your_jwt_secret
```

## Testing the Integration

### 1. Google Login Test
1. Start the application
2. Go to login page
3. Click "Continue with Google"
4. Complete Google authentication
5. Verify user is created/updated in MongoDB
6. Check profile page shows complete data

### 2. Profile Update Test
1. Login with Google
2. Go to profile page
3. Edit profile information
4. Save changes
5. Verify data is updated in MongoDB
6. Logout and login again to confirm persistence

### 3. Data Sync Test
1. Login with Google account that has profile picture
2. Verify picture appears in profile
3. Update Google profile picture
4. Login again and verify picture is updated

## Troubleshooting

### Common Issues

1. **Firebase Token Verification Fails**
   - Check Firebase project configuration
   - Verify environment variables
   - Ensure Firebase Admin SDK is properly initialized

2. **User Not Created in MongoDB**
   - Check database connection
   - Verify User model schema
   - Check server logs for validation errors

3. **Profile Picture Not Loading**
   - Verify Google profile has public picture
   - Check CORS settings
   - Ensure image URL is accessible

4. **Profile Data Not Persisting**
   - Check JWT token validation
   - Verify API endpoints are working
   - Check MongoDB write permissions

5. **Duplicate User Error**
   - Check unique indexes on email and firebaseUid
   - Verify email-based user lookup is working
   - Check database constraints

6. **Google Data Not Syncing**
   - Verify Google profile permissions
   - Check token contains required fields
   - Monitor sync utility function logs

### Debug Steps
1. Check browser console for errors
2. Monitor network requests in DevTools
3. Check server logs for backend errors
4. Verify MongoDB documents are created/updated
5. Test API endpoints directly with tools like Postman
6. **Check MongoDB indexes**: `db.users.getIndexes()`
7. **Verify no duplicate emails**: `db.users.aggregate([{$group: {_id: "$email", count: {$sum: 1}}}, {$match: {count: {$gt: 1}}}])`
8. **Test Google data sync**: Login multiple times and verify profile updates

## Future Enhancements

1. **Profile Picture Upload**
   - Allow users to upload custom profile pictures
   - Store in Firebase Storage
   - Fallback to Google picture

2. **Social Profile Sync**
   - Sync additional data from Google
   - Support for other social providers
   - Automatic profile updates

3. **Enhanced Verification**
   - Phone number verification via SMS
   - Document verification for owners
   - Identity verification integration

4. **Data Analytics**
   - Track login methods
   - User engagement metrics
   - Profile completion rates