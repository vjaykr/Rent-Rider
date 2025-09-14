# MongoDB Atlas & Firebase Setup Guide

This guide will help you set up MongoDB Atlas and Firebase for the RentRider application.

## MongoDB Atlas Setup

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project named "RentRider"

### 2. Create a Cluster
1. Click "Build a Database"
2. Choose "Shared" (Free tier)
3. Select your preferred cloud provider and region
4. Name your cluster (e.g., "rentrider-cluster")
5. Click "Create Cluster"

### 3. Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and strong password
5. Set user privileges to "Read and write to any database"
6. Click "Add User"

### 4. Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development, click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production, add your specific IP addresses
5. Click "Confirm"

### 5. Get Connection String
1. Go to "Databases" and click "Connect" on your cluster
2. Choose "Connect your application"
3. Select "Node.js" and version "4.1 or later"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with "rentrider"

### 6. Update Environment Variables
Update your `server/.env` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/rentrider?retryWrites=true&w=majority
```

## Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: "rentrider" (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable the following providers:
   - Email/Password
   - Google
   - Phone (optional)

### 3. Create Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location close to your users
5. Click "Done"

### 4. Enable Storage
1. Go to "Storage"
2. Click "Get started"
3. Choose "Start in test mode"
4. Select the same location as Firestore
5. Click "Done"

### 5. Get Firebase Configuration
1. Go to "Project Settings" (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" and select "Web"
4. Register your app with nickname "rentrider-web"
5. Copy the Firebase configuration object

### 6. Create Service Account (for Server)
1. Go to "Project Settings" > "Service accounts"
2. Click "Generate new private key"
3. Download the JSON file
4. Extract the following values for your server `.env`:
   - `project_id`
   - `private_key`
   - `client_email`

### 7. Update Environment Variables

#### Server (.env)
```env
# Firebase Configuration - Server
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
```

#### Client (.env)
```env
# Firebase Configuration - Client
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

#### Admin Panel (.env)
```env
# Same as client configuration
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## Testing the Setup

### 1. Test MongoDB Atlas Connection
```bash
npm run test:connection
```

### 2. Seed the Database
```bash
npm run seed:atlas
```

### 3. Start the Application
```bash
npm run dev
```

## Security Best Practices

### MongoDB Atlas
1. Use strong passwords for database users
2. Restrict IP access to known addresses in production
3. Enable database auditing
4. Regular backup your data

### Firebase
1. Configure Firestore security rules for production
2. Set up Storage security rules
3. Enable App Check for additional security
4. Monitor usage and set up billing alerts

## Firestore Security Rules (Production)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin access (implement based on your admin logic)
    match /{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Storage Security Rules (Production)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /vehicles/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (resource == null || resource.metadata.owner == request.auth.uid);
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **Connection String Issues**
   - Ensure password doesn't contain special characters that need URL encoding
   - Verify the database name is correct
   - Check if IP is whitelisted

2. **Firebase Authentication Issues**
   - Verify API keys are correct
   - Check if authentication methods are enabled
   - Ensure domains are authorized in Firebase Console

3. **Environment Variables**
   - Restart the server after updating .env files
   - Ensure no extra spaces in environment variables
   - Use quotes for values containing special characters

### Getting Help

- MongoDB Atlas: [Documentation](https://docs.atlas.mongodb.com/)
- Firebase: [Documentation](https://firebase.google.com/docs)
- RentRider Issues: Create an issue in the project repository