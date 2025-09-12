import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';

import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';

import { auth, db, googleProvider, facebookProvider } from '../config/firebase';

class FirebaseAuthService {
  constructor() {
    this.auth = auth;
    this.db = db;
    this.currentUser = null;
    this.authStateListeners = [];
    
    // Set up auth state listener
    this.unsubscribeAuth = onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
      this.authStateListeners.forEach(listener => listener(user));
    });
  }

  // Auth state management
  onAuthStateChanged(callback) {
    this.authStateListeners.push(callback);
    return () => {
      this.authStateListeners = this.authStateListeners.filter(listener => listener !== callback);
    };
  }

  getCurrentUser() {
    return this.currentUser;
  }

  async getIdToken() {
    if (this.currentUser) {
      return await this.currentUser.getIdToken();
    }
    return null;
  }

  // Email/Password Authentication
  async signInWithEmailPassword(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      return {
        success: true,
        user: user,
        token: await user.getIdToken()
      };
    } catch (error) {
      console.error('Email/Password sign in error:', error);
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  async createUserWithEmailPassword(email, password, userData = {}) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      // Update user profile
      await updateProfile(user, {
        displayName: userData.displayName || `${userData.firstName} ${userData.lastName}` || 'User'
      });
      
      // Send email verification
      try {
        await sendEmailVerification(user);
      } catch (emailError) {
        console.warn('Email verification failed:', emailError);
      }
      
      return {
        success: true,
        user: user,
        token: await user.getIdToken()
      };
    } catch (error) {
      console.error('Email/Password sign up error:', error);
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  // Google Authentication
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, googleProvider);
      const user = result.user;
      
      // Try to update user data in Firestore, but don't fail if it doesn't work
      try {
        await this.updateUserData(user);
      } catch (firestoreError) {
        console.warn('Firestore update failed, but Google authentication succeeded:', firestoreError);
      }
      
      return {
        success: true,
        user: user,
        token: await user.getIdToken()
      };
    } catch (error) {
      console.error('Google sign in error:', error);
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  // Facebook Authentication
  async signInWithFacebook() {
    try {
      const result = await signInWithPopup(this.auth, facebookProvider);
      const user = result.user;
      
      // Try to update user data in Firestore, but don't fail if it doesn't work
      try {
        await this.updateUserData(user);
      } catch (firestoreError) {
        console.warn('Firestore update failed, but Facebook authentication succeeded:', firestoreError);
      }
      
      return {
        success: true,
        user: user,
        token: await user.getIdToken()
      };
    } catch (error) {
      console.error('Facebook sign in error:', error);
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  // Phone Authentication
  async setupRecaptcha(containerId) {
    try {
      this.recaptchaVerifier = new RecaptchaVerifier(this.auth, containerId, {
        'size': 'invisible',
        'callback': () => {
          console.log('reCAPTCHA verified');
        }
      });
      
      return {
        success: true,
        verifier: this.recaptchaVerifier
      };
    } catch (error) {
      console.error('reCAPTCHA setup error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendPhoneVerification(phoneNumber) {
    try {
      if (!this.recaptchaVerifier) {
        await this.setupRecaptcha('recaptcha-container');
      }
      
      const confirmationResult = await signInWithPhoneNumber(this.auth, phoneNumber, this.recaptchaVerifier);
      
      return {
        success: true,
        verificationId: confirmationResult.verificationId,
        confirmationResult: confirmationResult
      };
    } catch (error) {
      console.error('Phone verification error:', error);
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  async verifyPhoneCode(confirmationResult, code) {
    try {
      const result = await confirmationResult.confirm(code);
      const user = result.user;
      
      // Try to update user data in Firestore, but don't fail if it doesn't work
      try {
        await this.updateUserData(user);
      } catch (firestoreError) {
        console.warn('Firestore update failed, but phone verification succeeded:', firestoreError);
      }
      
      return {
        success: true,
        user: user,
        token: await user.getIdToken()
      };
    } catch (error) {
      console.error('Phone code verification error:', error);
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  // Password Reset
  async sendPasswordReset(email) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return {
        success: true,
        message: 'Password reset email sent'
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  // Update Password
  async updateUserPassword(currentPassword, newPassword) {
    try {
      const user = this.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }
      
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
      
      return {
        success: true,
        message: 'Password updated successfully'
      };
    } catch (error) {
      console.error('Password update error:', error);
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  // Email Verification
  async sendEmailVerification() {
    try {
      const user = this.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }
      
      await sendEmailVerification(user);
      
      return {
        success: true,
        message: 'Verification email sent'
      };
    } catch (error) {
      console.error('Email verification error:', error);
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  // Sign Out
  async signOut() {
    try {
      await signOut(this.auth);
      this.currentUser = null;
      
      // Clear reCAPTCHA
      if (this.recaptchaVerifier) {
        this.recaptchaVerifier.clear();
        this.recaptchaVerifier = null;
      }
      
      return {
        success: true,
        message: 'Signed out successfully'
      };
    } catch (error) {
      console.error('Sign out error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Firestore user data management
  async createUserDocument(user, additionalData = {}) {
    try {
      // Check if we're offline
      if (!navigator.onLine) {
        console.warn('Offline: Skipping Firestore user document creation');
        return null;
      }
      
      const userRef = doc(this.db, 'users', user.uid);
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
        emailVerified: user.emailVerified,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...additionalData
      };
      
      await setDoc(userRef, userData);
      return userData;
    } catch (error) {
      console.error('Error creating user document:', error);
      if (error.code === 'unavailable' || error.message.includes('offline') || error.message.includes('client is offline')) {
        console.warn('Firestore is offline, skipping document creation');
        return null;
      }
      // Don't throw error for Firestore issues in authentication flow
      return null;
    }
  }

  async updateUserData(user) {
    try {
      // Check if we're offline or if user is null
      if (!navigator.onLine || !user) {
        console.warn('Offline or no user: Skipping Firestore user data update');
        return null;
      }
      
      const userRef = doc(this.db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
        emailVerified: user.emailVerified,
        lastSignInAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      if (userDoc.exists()) {
        await updateDoc(userRef, userData);
      } else {
        await setDoc(userRef, {
          ...userData,
          createdAt: serverTimestamp()
        });
      }
      
      return userData;
    } catch (error) {
      console.error('Error updating user data:', error);
      if (error.code === 'unavailable' || error.message.includes('offline') || error.message.includes('client is offline')) {
        console.warn('Firestore is offline, skipping user data update');
        return null;
      }
      // Don't throw error for Firestore issues in authentication flow
      return null;
    }
  }

  async getUserData(uid) {
    try {
      // Check if we're offline
      if (!navigator.onLine) {
        console.warn('Offline: Skipping Firestore user data fetch');
        return { success: false, error: 'Offline' };
      }
      
      const userRef = doc(this.db, 'users', uid || this.currentUser?.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return {
          success: true,
          data: userDoc.data()
        };
      } else {
        return {
          success: false,
          error: 'User document not found'
        };
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      if (error.code === 'unavailable' || error.message.includes('offline') || error.message.includes('client is offline')) {
        console.warn('Firestore is offline, skipping user data fetch');
        return { success: false, error: 'Offline' };
      }
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Clean up
  destroy() {
    if (this.unsubscribeAuth) {
      this.unsubscribeAuth();
    }
    
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
    }
  }
}

// Create singleton instance
const firebaseAuthService = new FirebaseAuthService();

export default firebaseAuthService;
