# Secure Authentication System Setup

This guide will help you set up the industry-grade authentication system with Google-first signup and MongoDB Atlas integration.

## Quick Start

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies  
cd ../client
npm install
```

### 2. Environment Configuration

#### Server (.env)
```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/rentrider?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-change-in-production
JWT_EXPIRE=7d

# Firebase Admin SDK
FIREBASE_PROJECT_ID=rent-rider
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@rent-rider.iam.gserviceaccount.com

# Server Configuration
NODE_ENV=development
PORT=5001
CLIENT_URL=http://localhost:3000
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

### 3. Start the Application

```bash
# Start server (from server directory)
npm run dev

# Start client (from client directory)  
npm start
```

## Authentication Flow

### 1. Google-First Signup
- New users MUST sign up with Google first
- No direct email/password registration allowed
- User data synced to MongoDB on first Google login

### 2. Profile Completion
- After Google signup, users redirected to profile completion
- Must set password for email/password login capability
- Optional: phone number and bio

### 3. Login Options
- **Google Login**: Always available for any user
- **Email/Password Login**: Only available after profile completion

### 4. Dashboard
- Shows user information and profile issues
- Detects incomplete fields (phone, bio, password)
- Allows profile editing and updates

## Security Features

### ✅ Implemented Security Measures

1. **HTTP-Only Cookies**: Secure token storage
2. **Rate Limiting**: Prevents brute force attacks
3. **Input Validation**: Joi schema validation
4. **Password Requirements**: Strong password enforcement
5. **CORS Configuration**: Secure cross-origin requests
6. **Error Handling**: Secure error messages
7. **Logging**: Winston logger for audit trails

### 🔒 Authentication Security

- Firebase ID token verification
- JWT with secure secrets
- Automatic token expiration
- Secure logout with cookie clearing
- Profile completion enforcement

## API Endpoints

```
POST /api/auth/google-signup     # Google authentication (signup/login)
POST /api/auth/complete-profile  # Complete profile after Google signup
POST /api/auth/email-login      # Email/password login
GET  /api/auth/me               # Get current user
PUT  /api/auth/profile          # Update user profile
POST /api/auth/logout           # Logout user
GET  /api/auth/health           # Health check
```

## User Experience Flow

### New User Journey
1. Visit `/login` → Click "Continue with Google"
2. Google OAuth → Account created in MongoDB
3. Redirect to `/profile-completion` → Set password & optional info
4. Redirect to `/dashboard` → Full access

### Returning User Journey
1. Visit `/login` → Choose Google or Email login
2. Authentication → Direct to `/dashboard`
3. Dashboard shows profile issues if any

## Troubleshooting

### Common Issues

1. **Firebase Configuration**
   - Ensure all Firebase environment variables are set
   - Check Firebase Console for enabled authentication methods
   - Verify authorized domains include localhost

2. **MongoDB Connection**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist in Atlas
   - Ensure database user has proper permissions

3. **CORS Issues**
   - Server runs on port 5001, client on 3000
   - CORS configured for localhost:3000
   - Check CLIENT_URL environment variable

### Debug Commands

```bash
# Test MongoDB connection
cd server && npm run test:connection

# Check server health
curl http://localhost:5001/api/auth/health

# View server logs
cd server && tail -f logs/auth.log
```

## Production Deployment

### Security Checklist
- [ ] Change JWT_SECRET to strong random value
- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS origins
- [ ] Set up HTTPS
- [ ] Restrict MongoDB Atlas IP access
- [ ] Enable Firebase security rules
- [ ] Set up monitoring and alerts

### Environment Variables
- [ ] All secrets in secure environment
- [ ] No hardcoded credentials
- [ ] Separate configs for staging/production

## Features

### ✅ Implemented
- Google-first signup enforcement
- Profile completion flow
- Secure HTTP-only cookie authentication
- Input validation and sanitization
- Rate limiting and security headers
- Comprehensive error handling
- User-friendly UI with loading states
- Profile issues detection
- Real-time form validation

### 🎯 User Experience
- Clean, professional UI design
- Toast notifications for feedback
- Loading spinners and states
- Responsive design
- Accessibility compliant
- Progressive profile completion
- Smart redirects and navigation

This system provides enterprise-grade security while maintaining an excellent user experience. The Google-first approach ensures verified email addresses and reduces friction for new users.