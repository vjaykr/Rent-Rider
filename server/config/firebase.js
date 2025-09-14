const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with new API
const initializeFirebase = () => {
  try {
    if (!admin.apps.length) {
      // For development, use minimal config without service account
      if (process.env.NODE_ENV === 'development') {
        admin.initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID,
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET
        });
      } else {
        // Production: Use service account credentials
        if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
          const serviceAccount = {
            type: "service_account",
            project_id: process.env.FIREBASE_PROJECT_ID,
            private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            client_email: process.env.FIREBASE_CLIENT_EMAIL
          };

          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET
          });
        } else {
          throw new Error('Firebase service account credentials not found');
        }
      }
    }
    
    console.log('Firebase Admin initialized successfully');
    return admin;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    // Don't fail the server startup for Firebase issues in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Continuing without Firebase Admin SDK...');
      return null;
    }
    throw error;
  }
};

// Get Firebase Storage bucket
const getStorageBucket = () => {
  try {
    return admin.storage().bucket();
  } catch (error) {
    console.error('Error getting storage bucket:', error);
    return null;
  }
};

// Upload file to Firebase Storage
const uploadFile = async (file, destination) => {
  try {
    const bucket = getStorageBucket();
    if (!bucket) throw new Error('Storage bucket not available');

    const fileUpload = bucket.file(destination);
    
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', reject);
      stream.on('finish', async () => {
        try {
          await fileUpload.makePublic();
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
          resolve(publicUrl);
        } catch (error) {
          reject(error);
        }
      });
      stream.end(file.buffer);
    });
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};

// Delete file from Firebase Storage
const deleteFile = async (filePath) => {
  try {
    const bucket = getStorageBucket();
    if (!bucket) throw new Error('Storage bucket not available');

    await bucket.file(filePath).delete();
    console.log(`File ${filePath} deleted successfully`);
  } catch (error) {
    console.error('File deletion error:', error);
    throw error;
  }
};

// Verify Firebase ID token
const verifyIdToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return {
      success: true,
      decodedToken,
      uid: decodedToken.uid,
      email: decodedToken.email,
      phoneNumber: decodedToken.phone_number
    };
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get Firebase user by UID
const getFirebaseUser = async (uid) => {
  try {
    const userRecord = await admin.auth().getUser(uid);
    return {
      success: true,
      user: userRecord
    };
  } catch (error) {
    console.error('Error getting Firebase user:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Create Firebase user
const createFirebaseUser = async (userData) => {
  try {
    const userRecord = await admin.auth().createUser({
      email: userData.email,
      emailVerified: false,
      phoneNumber: userData.phoneNumber,
      displayName: userData.displayName,
      disabled: false
    });
    
    return {
      success: true,
      user: userRecord
    };
  } catch (error) {
    console.error('Error creating Firebase user:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Update Firebase user
const updateFirebaseUser = async (uid, updateData) => {
  try {
    const userRecord = await admin.auth().updateUser(uid, updateData);
    return {
      success: true,
      user: userRecord
    };
  } catch (error) {
    console.error('Error updating Firebase user:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete Firebase user
const deleteFirebaseUser = async (uid) => {
  try {
    await admin.auth().deleteUser(uid);
    return {
      success: true,
      message: 'User deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting Firebase user:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  initializeFirebase,
  getStorageBucket,
  uploadFile,
  deleteFile,
  verifyIdToken,
  getFirebaseUser,
  createFirebaseUser,
  updateFirebaseUser,
  deleteFirebaseUser
};
