import { useState } from 'react';
import { useAuth as useAuthContext } from '../context/AuthContext';
import { signInWithGoogle, signInWithEmail, createUserWithEmail } from '../config/firebase';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const authContext = useAuthContext();
  const [loading, setLoading] = useState(false);

  // Google Sign In
  const signInWithGoogleAuth = async (userData = null) => {
    try {
      setLoading(true);
      
      const result = await signInWithGoogle();
      const idToken = await result.user.getIdToken();
      
      // If no userData provided, extract from Firebase user
      const finalUserData = userData || {
        firstName: result.user.displayName?.split(' ')[0] || '',
        lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
        email: result.user.email,
        phone: result.user.phoneNumber || ''
      };

      const response = await authContext.loginWithFirebase(idToken, finalUserData);
      
      if (response.success) {
        toast.success('Successfully signed in with Google!');
        return response;
      } else {
        toast.error(response.message || 'Google sign in failed');
        return response;
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error('Google sign in failed. Please try again.');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Sign In
  const signInWithEmailAuth = async (email, password) => {
    try {
      setLoading(true);
      
      const response = await authContext.login(email, password);
      
      if (response.success) {
        toast.success('Successfully signed in!');
        return response;
      } else {
        toast.error(response.message || 'Sign in failed');
        return response;
      }
    } catch (error) {
      console.error('Email sign in error:', error);
      toast.error('Sign in failed. Please try again.');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Registration
  const registerWithEmail = async (userData) => {
    try {
      setLoading(true);
      
      const response = await authContext.register(userData);
      
      if (response.success) {
        toast.success('Account created successfully!');
        return response;
      } else {
        toast.error(response.message || 'Registration failed');
        return response;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Firebase + MongoDB Registration (for Google users who need to complete profile)
  const registerWithFirebase = async (userData) => {
    try {
      setLoading(true);
      
      // Create Firebase user first
      const firebaseResult = await createUserWithEmail(userData.email, userData.password || 'temp-password');
      const idToken = await firebaseResult.user.getIdToken();
      
      // Then sync with MongoDB
      const response = await authContext.loginWithFirebase(idToken, userData);
      
      if (response.success) {
        toast.success('Account created successfully!');
        return response;
      } else {
        toast.error(response.message || 'Registration failed');
        return response;
      }
    } catch (error) {
      console.error('Firebase registration error:', error);
      toast.error('Registration failed. Please try again.');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Update Profile
  const updateUserProfile = async (userData) => {
    try {
      setLoading(true);
      
      const response = await authContext.updateProfile(userData);
      
      if (response.success) {
        toast.success('Profile updated successfully!');
        return response;
      } else {
        toast.error(response.message || 'Profile update failed');
        return response;
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Profile update failed. Please try again.');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const signOut = async () => {
    try {
      setLoading(true);
      await authContext.logout();
      toast.success('Signed out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return {
    // State from context
    ...authContext,
    
    // Loading state for this hook
    authLoading: loading,
    
    // Auth methods
    signInWithGoogle: signInWithGoogleAuth,
    signInWithEmail: signInWithEmailAuth,
    registerWithEmail,
    registerWithFirebase,
    updateProfile: updateUserProfile,
    signOut
  };
};