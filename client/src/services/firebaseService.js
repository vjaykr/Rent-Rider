import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';

import { auth, db, googleProvider, facebookProvider } from '../config/firebase';

class FirebaseService {
  constructor() {
    this.auth = auth;
    this.db = db;
  }

  // Authentication Methods
  async signInWithEmail(email, password) {
    try {
      // Try Firebase first
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      const firebaseToken = await result.user.getIdToken();

      // Authenticate with MongoDB
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/firebase-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firebaseToken })
      });

      const mongoResult = await response.json();
      
      if (!mongoResult.success) {
        throw new Error(mongoResult.message);
      }

      return {
        success: true,
        user: result.user,
        token: firebaseToken,
        mongoUser: mongoResult.data.user,
        mongoToken: mongoResult.data.token,
        needsProfileCompletion: mongoResult.data.needsProfileCompletion
      };
    } catch (error) {
      // Fallback to MongoDB-only login
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message);
        }

        return {
          success: true,
          user: null, // No Firebase user
          token: null,
          mongoUser: result.data.user,
          mongoToken: result.data.token,
          needsProfileCompletion: result.data.needsProfileCompletion
        };
      } catch (mongoError) {
        return {
          success: false,
          error: error.message
        };
      }
    }
  }

  async signUpWithEmail(email, password, userData) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      
      // Update profile
      await updateProfile(result.user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });

      // Get Firebase token
      const firebaseToken = await result.user.getIdToken();

      // Create user in MongoDB via API
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/firebase-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firebaseToken,
          userData
        })
      });

      const mongoResult = await response.json();
      
      if (!mongoResult.success) {
        throw new Error(mongoResult.message);
      }

      return {
        success: true,
        user: result.user,
        token: firebaseToken,
        mongoUser: mongoResult.data.user,
        needsProfileCompletion: mongoResult.data.needsProfileCompletion
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, googleProvider);
      
      // Check if user document exists, create if not
      const userDoc = await this.getUserDocument(result.user.uid);
      if (!userDoc.exists()) {
        await this.createUserDocument(result.user.uid, {
          firstName: result.user.displayName?.split(' ')[0] || '',
          lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
          email: result.user.email,
          phone: result.user.phoneNumber || '',
          role: 'customer',
          isEmailVerified: result.user.emailVerified,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
      } else {
        // Update last login
        await this.updateUserDocument(result.user.uid, {
          lastLogin: serverTimestamp()
        });
      }

      return {
        success: true,
        user: result.user,
        token: await result.user.getIdToken()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async signInWithFacebook() {
    try {
      const result = await signInWithPopup(this.auth, facebookProvider);
      
      // Similar logic as Google sign-in
      const userDoc = await this.getUserDocument(result.user.uid);
      if (!userDoc.exists()) {
        await this.createUserDocument(result.user.uid, {
          firstName: result.user.displayName?.split(' ')[0] || '',
          lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
          email: result.user.email,
          phone: result.user.phoneNumber || '',
          role: 'customer',
          isEmailVerified: result.user.emailVerified,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
      } else {
        await this.updateUserDocument(result.user.uid, {
          lastLogin: serverTimestamp()
        });
      }

      return {
        success: true,
        user: result.user,
        token: await result.user.getIdToken()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async signInWithPhone(phoneNumber, appVerifier) {
    try {
      const confirmationResult = await signInWithPhoneNumber(this.auth, phoneNumber, appVerifier);
      return {
        success: true,
        confirmationResult
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async verifyPhoneOTP(confirmationResult, otp) {
    try {
      const result = await confirmationResult.confirm(otp);
      return {
        success: true,
        user: result.user,
        token: await result.user.getIdToken()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async signOut() {
    try {
      await signOut(this.auth);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Firestore Methods
  async createUserDocument(uid, userData) {
    try {
      const userRef = doc(this.db, 'users', uid);
      await setDoc(userRef, userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getUserDocument(uid) {
    try {
      const userRef = doc(this.db, 'users', uid);
      return await getDoc(userRef);
    } catch (error) {
      console.error('Error getting user document:', error);
      return null;
    }
  }

  async updateUserDocument(uid, updateData) {
    try {
      const userRef = doc(this.db, 'users', uid);
      await updateDoc(userRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getUserByEmail(email) {
    try {
      const usersRef = collection(this.db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return {
          success: true,
          user: { id: userDoc.id, ...userDoc.data() }
        };
      }
      
      return {
        success: false,
        error: 'User not found'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Storage Methods
  async uploadFile(file, path) {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        success: true,
        url: downloadURL,
        path: path
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteFile(path) {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Auth State Observer
  onAuthStateChange(callback) {
    return onAuthStateChanged(this.auth, callback);
  }

  // Get current user
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // Get current user token
  async getCurrentUserToken() {
    const user = this.getCurrentUser();
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }

  // Setup reCAPTCHA for phone auth
  setupRecaptcha(containerId) {
    try {
      const recaptchaVerifier = new RecaptchaVerifier(this.auth, containerId, {
        size: 'invisible',
        callback: (response) => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
        }
      });
      
      return recaptchaVerifier;
    } catch (error) {
      console.error('Error setting up reCAPTCHA:', error);
      return null;
    }
  }
}

// Create and export a singleton instance
const firebaseService = new FirebaseService();
export default firebaseService;