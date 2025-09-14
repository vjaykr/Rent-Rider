# Firebase + MongoDB Atlas Authentication Setup

This document provides complete setup instructions for the unified Firebase + MongoDB Atlas authentication system in RentRider.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Root directory
npm install

# Server dependencies
cd server
npm install firebase-admin

# Client dependencies  
cd ../client
npm install firebase react-hot-toast
```

### 2. Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create new project: "rent-rider"
   - Enable Google Analytics (optional)

2. **Enable Authentication**
   - Go to Authentication → Sign-in method
   - Enable: Email/Password, Google
   - Add authorized domains: `localhost`, your production domain

3. **Get Web Configuration**
   - Project Settings → General → Your apps
   - Add web app → Copy config object
   - Update `client/.env` with Firebase config

4. **Generate Service Account**
   - Project Settings → Service accounts
   - Generate new private key → Download JSON
   - Extract values for `server/.env`

### 3. MongoDB Atlas Setup

1. **Create Cluster**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create free cluster
   - Name: "rentrider-cluster"

2. **Configure Access**
   - Database Access → Add user with read/write permissions
   - Network Access → Add IP (0.0.0.0/0 for development)
   - Get connection string → Update `server/.env`

### 4. Environment Configuration

#### Server (.env)
```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/rentrider

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Firebase Admin SDK
FIREBASE_PROJECT_ID=rent-rider
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@rent-rider.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=rent-rider.firebasestorage.app
```

#### Client (.env)
```env
# Firebase Web SDK
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=rent-rider.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=rent-rider
REACT_APP_FIREBASE_STORAGE_BUCKET=rent-rider.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id

# API Configuration
REACT_APP_API_URL=http://localhost:5001/api
```

### 5. Start the Application

```bash
# Start all services
npm run dev

# Or start individually
npm run server:dev  # Server on :5001
npm run client:dev  # Client on :3000
npm run admin:dev   # Admin on :3001
```

## 🏗️ Architecture Overview

### Authentication Flow

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client App    │    │   Server API     │    │  MongoDB Atlas  │
│                 │    │                  │    │                 │
│ Firebase Auth   │───▶│ Verify Token     │───▶│ User Profile    │
│ (Google/Email)  │    │ JWT Generation   │    │ App Data        │
│                 │    │ Unified Response │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Key Components

1. **Firebase Authentication**
   - Handles user authentication (Google, Email/Password)
   - Provides secure ID tokens
   - Manages session state

2. **MongoDB Atlas**
   - Stores complete user profiles
   - Application-specific data
   - Booking history, preferences, etc.

3. **Unified API Layer**
   - Accepts both Firebase tokens and JWT
   - Syncs user data between systems
   - Provides consistent user experience

## 🔧 Implementation Details

### Server-Side Components

1. **`unifiedAuthController.js`** - Main authentication logic
2. **`unifiedAuth.js`** - Authentication middleware
3. **`unifiedAuthRoutes.js`** - API endpoints
4. **Updated `User.js`** - Enhanced user model

### Client-Side Components

1. **`firebase.js`** - Firebase configuration
2. **`AuthContext.js`** - Global auth state management
3. **`useAuth.js`** - Authentication hook
4. **`authService.js`** - API communication
5. **`LoginForm.js`** - Professional login UI
6. **`RegisterForm.js`** - Registration form
7. **`ProtectedRoute.js`** - Route protection

### API Endpoints

```
POST /api/auth/firebase-auth     # Firebase token authentication
POST /api/auth/register          # Email/password registration  
POST /api/auth/login            # Email/password login
GET  /api/auth/profile          # Get user profile
PUT  /api/auth/profile          # Update user profile
POST /api/auth/logout           # Logout
```

## 🎯 User Experience Features

### Seamless Login Options
- **Primary**: Google Sign-In (one-click)
- **Fallback**: Email/Password
- **Progressive**: Complete profile over time

### Professional UI/UX
- Clean, modern design
- Loading states and error handling
- Toast notifications
- Responsive layout
- Accessibility compliant

### Smart Routing
- Protected routes with role-based access
- Automatic redirects after login
- Dashboard based on user role
- Profile completion prompts

## 🔒 Security Features

### Authentication Security
- Firebase ID token verification
- JWT with secure secrets
- Rate limiting on auth endpoints
- Password hashing with bcrypt

### Data Protection
- MongoDB Atlas encryption at rest
- Secure environment variables
- CORS configuration
- Helmet security headers

### User Privacy
- Minimal data collection
- Secure token storage
- Automatic session management
- Privacy-compliant design

## 🧪 Testing

### Test Authentication Flow

1. **Google Sign-In**
   ```bash
   # Visit http://localhost:3000/login
   # Click "Continue with Google"
   # Complete Google OAuth flow
   # Verify user created in MongoDB
   ```

2. **Email Registration**
   ```bash
   # Visit http://localhost:3000/register
   # Fill form and submit
   # Verify user created in both systems
   ```

3. **API Testing**
   ```bash
   # Test server connection
   npm run test:connection
   
   # Check auth health
   curl http://localhost:5001/api/auth/health
   ```

## 🚀 Production Deployment

### Security Checklist
- [ ] Update JWT_SECRET to strong random value
- [ ] Restrict MongoDB Atlas IP access
- [ ] Configure Firebase security rules
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure backup strategies

### Environment Variables
- [ ] All secrets in secure environment
- [ ] No hardcoded credentials
- [ ] Separate configs for staging/production
- [ ] Regular key rotation

## 🛠️ Troubleshooting

### Common Issues

1. **Firebase Connection Failed**
   - Check API keys in client `.env`
   - Verify authorized domains in Firebase Console
   - Ensure authentication methods are enabled

2. **MongoDB Connection Failed**
   - Verify connection string format
   - Check IP whitelist in Atlas
   - Confirm user permissions

3. **Token Verification Failed**
   - Check Firebase service account credentials
   - Verify JWT_SECRET is set
   - Ensure proper token format

### Debug Commands

```bash
# Test MongoDB connection
npm run test:connection

# Check Firebase config
node -e "console.log(process.env.FIREBASE_PROJECT_ID)"

# Verify API health
curl http://localhost:5001/api/auth/health
```

## 📚 Additional Resources

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [React Context API](https://reactjs.org/docs/context.html)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

## 🤝 Support

For issues or questions:
1. Check this documentation
2. Review error logs
3. Test with provided debug commands
4. Create issue in project repository

---

**Note**: This implementation provides enterprise-grade authentication suitable for production use while maintaining developer-friendly setup and maintenance.