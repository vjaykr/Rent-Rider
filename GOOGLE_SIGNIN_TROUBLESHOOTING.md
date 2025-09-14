# Google Sign-In Troubleshooting Guide

## Common Issues and Solutions

### 1. **Redirecting Back to /register Page**

**Possible Causes:**
- User doesn't exist in MongoDB (404 error)
- Firebase configuration issues
- Backend API not responding
- Network connectivity issues

**Debug Steps:**

1. **Check Browser Console:**
   ```javascript
   // Open browser console and look for errors
   // Check Network tab for failed API calls
   ```

2. **Test Firebase Configuration:**
   ```bash
   # Check if environment variables are set
   echo $REACT_APP_FIREBASE_API_KEY
   echo $REACT_APP_FIREBASE_PROJECT_ID
   ```

3. **Test Backend API:**
   ```bash
   # Test if backend is running
   curl http://localhost:5000/api/auth/profile
   ```

### 2. **Firebase Authentication Errors**

**Common Error Codes:**
- `auth/popup-blocked` - Browser blocked popup
- `auth/popup-closed-by-user` - User closed popup
- `auth/network-request-failed` - Network issues
- `auth/invalid-api-key` - Wrong Firebase config

**Solutions:**
```javascript
// Check Firebase config in browser console
console.log('Firebase Config:', {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
});
```

### 3. **Backend API Issues**

**Check Server Logs:**
```bash
# Look for these errors in server console
- "Firebase token verification failed"
- "User not found"
- "Database connection error"
```

**Test API Endpoints:**
```bash
# Test Firebase login endpoint
curl -X POST http://localhost:5000/api/auth/firebase-login \
  -H "Content-Type: application/json" \
  -d '{"firebaseToken": "test-token"}'
```

### 4. **Environment Variables**

**Required Client Variables (.env):**
```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

**Required Server Variables (.env):**
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
```

### 5. **Firebase Console Settings**

**Check Authentication Settings:**
1. Go to Firebase Console > Authentication
2. Verify Google provider is enabled
3. Check authorized domains include:
   - `localhost` (for development)
   - Your production domain

**Check OAuth Settings:**
1. Go to Google Cloud Console
2. Navigate to APIs & Services > Credentials
3. Find your OAuth 2.0 client ID
4. Add authorized origins:
   - `http://localhost:3000` (development)
   - Your production URL

### 6. **Debug Using Console**

**Add to Login Component:**
```javascript
// Temporary debug code
useEffect(() => {
  console.log('Auth State:', { isAuthenticated, loading, user });
}, [isAuthenticated, loading, user]);
```

**Check Network Requests:**
1. Open Browser DevTools
2. Go to Network tab
3. Try Google login
4. Look for failed requests (red entries)
5. Check response status and error messages

### 7. **Step-by-Step Debug Process**

1. **Test Firebase Direct:**
   ```javascript
   import firebaseAuthService from './services/firebaseAuthService';
   
   // Test in browser console
   firebaseAuthService.signInWithGoogle()
     .then(result => console.log('Firebase Success:', result))
     .catch(error => console.error('Firebase Error:', error));
   ```

2. **Test Backend API:**
   ```javascript
   // Test with a valid Firebase token
   fetch('/api/auth/firebase-login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ firebaseToken: 'your-token' })
   })
   .then(res => res.json())
   .then(data => console.log('Backend Response:', data));
   ```

3. **Check User Flow:**
   - Login page loads ✓
   - Click Google button ✓
   - Google popup opens ✓
   - User selects account ✓
   - Popup closes ✓
   - **Check what happens next**

### 8. **Common Solutions**

**Solution 1: Clear Browser Data**
```bash
# Clear localStorage and cookies
localStorage.clear();
# Or use browser settings to clear site data
```

**Solution 2: Restart Development Server**
```bash
# Stop and restart both client and server
npm run dev
```

**Solution 3: Check CORS Settings**
```javascript
// In server.js, ensure CORS is configured
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
```

**Solution 4: Verify MongoDB Connection**
```bash
# Check if MongoDB is accessible
mongosh "your-connection-string"
```

### 9. **Production Deployment Issues**

**Domain Authorization:**
1. Add production domain to Firebase authorized domains
2. Update OAuth settings in Google Cloud Console
3. Set correct environment variables

**HTTPS Requirements:**
- Google OAuth requires HTTPS in production
- Ensure SSL certificate is valid

### 10. **Testing Checklist**

- [ ] Firebase config variables are set
- [ ] Google provider enabled in Firebase Console
- [ ] Backend server is running
- [ ] MongoDB is accessible
- [ ] No console errors
- [ ] Network requests succeed
- [ ] User can complete Google auth popup
- [ ] Backend receives Firebase token
- [ ] User is created/found in MongoDB
- [ ] JWT token is returned
- [ ] User is redirected correctly

### 11. **Debug Component Usage**

The `GoogleAuthDebug` component has been added to the login page in development mode. Use it to:

1. Test Firebase authentication directly
2. Test Google login through AuthContext
3. Test Google signup through AuthContext
4. View detailed logs of the authentication process

**To use:**
1. Go to login page in development
2. Scroll down to see debug component
3. Click test buttons to see what's failing
4. Check console logs for detailed error information

### 12. **Quick Fix Commands**

```bash
# Restart everything
npm run dev

# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check environment variables
printenv | grep REACT_APP_FIREBASE
printenv | grep FIREBASE_

# Test API directly
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer your-jwt-token"
```

## Need More Help?

1. Check browser console for specific error messages
2. Use the debug component on the login page
3. Check server logs for backend errors
4. Verify all environment variables are set correctly
5. Test each component (Firebase, Backend, Database) individually