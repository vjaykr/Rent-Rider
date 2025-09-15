import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { secureAuthService } from '../services/secureAuthService';
import { auth, onAuthStateChange } from '../config/firebase';
import { showToast } from '../components/CustomToast';

// Initial state
const initialState = {
  user: null,
  loading: true,
  isAuthenticated: false,
  requiresProfileCompletion: false,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  PROFILE_INCOMPLETE: 'PROFILE_INCOMPLETE',
  PROFILE_COMPLETE: 'PROFILE_COMPLETE',
  LOGOUT: 'LOGOUT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        requiresProfileCompletion: false,
        loading: false,
        error: null
      };
    
    case AUTH_ACTIONS.PROFILE_INCOMPLETE:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        requiresProfileCompletion: true,
        loading: false,
        error: null
      };
    
    case AUTH_ACTIONS.PROFILE_COMPLETE:
      return {
        ...state,
        user: action.payload.user,
        requiresProfileCompletion: false,
        error: null
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        loading: false
      };
    
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    default:
      return state;
  }
};

// Create context
const SecureAuthContext = createContext();

// Auth provider component
export const SecureAuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await secureAuthService.getCurrentUser();
        if (response.success) {
          if (response.user.isProfileComplete) {
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: { user: response.user }
            });
          } else {
            dispatch({
              type: AUTH_ACTIONS.PROFILE_INCOMPLETE,
              payload: { user: response.user }
            });
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } catch (error) {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    };

    initializeAuth();
  }, []);

  // Listen for logout and auth update events
  useEffect(() => {
    const handleLogout = () => {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    };

    const handleAuthUpdate = (event) => {
      if (event.detail) {
        dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { user: event.detail } });
      }
    };

    window.addEventListener('auth:logout', handleLogout);
    window.addEventListener('auth:update', handleAuthUpdate);
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
      window.removeEventListener('auth:update', handleAuthUpdate);
    };
  }, []);

  // Firebase auth state listener (for Google auth)
  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      // Firebase state is maintained for Google auth
      // Actual app state is managed by our secure system
    });

    return unsubscribe;
  }, []);

  // Google signup/login
  const signInWithGoogle = async (firebaseIdToken) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await secureAuthService.googleSignup(firebaseIdToken);
      
      if (response.success) {
        if (response.requiresProfileCompletion) {
          dispatch({
            type: AUTH_ACTIONS.PROFILE_INCOMPLETE,
            payload: { user: response.user }
          });
          return { success: true, requiresProfileCompletion: true, user: response.user };
        } else {
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: { user: response.user }
          });
          return { success: true, user: response.user };
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      let message = 'Google authentication failed';
      
      if (error.message && error.message.includes('Network Error')) {
        message = 'Network connection failed. Please check your internet connection.';
      } else if (error.message && error.message.includes('Invalid authentication token')) {
        message = 'Authentication token expired. Please try signing in again.';
      } else if (error.message) {
        message = error.message;
      }
      
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
      return { success: false, message };
    }
  };

  // Complete profile
  const completeProfile = async (profileData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await secureAuthService.completeProfile(profileData);
      
      if (response.success) {
        dispatch({
          type: AUTH_ACTIONS.PROFILE_COMPLETE,
          payload: { user: response.user }
        });
        showToast.success('Profile completed successfully!');
        return { success: true, user: response.user };
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.message || 'Profile completion failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
      return { success: false, message };
    }
  };

  // Email/password login
  const signInWithEmail = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await secureAuthService.emailLogin(email, password);
      
      if (response.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: response.user }
        });
        return { success: true, user: response.user };
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.message || 'Email login failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
      return { success: false, message };
    }
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await secureAuthService.updateProfile(profileData);
      
      if (response.success) {
        // Force immediate state update
        dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { user: response.user } });
        // Emit multiple events to ensure navbar updates
        window.dispatchEvent(new CustomEvent('profile:updated', { detail: response.user }));
        window.dispatchEvent(new CustomEvent('auth:update', { detail: response.user }));
        window.dispatchEvent(new CustomEvent('user:refreshed', { detail: response.user }));
        showToast.success('Profile updated successfully!');
        return response;
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: response.message });
        return response;
      }
    } catch (error) {
      const message = error.message || 'Profile update failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
      return { success: false, message };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await secureAuthService.logout();
      
      // Sign out from Firebase as well
      try {
        await auth.signOut();
      } catch (firebaseError) {
        console.error('Firebase signout error:', firebaseError);
      }
      
      showToast.success('Signed out');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage token
      localStorage.removeItem('token');
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const response = await secureAuthService.getCurrentUser();
      if (response.success) {
        dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { user: response.user } });
        // Force component re-render with updated user data
        window.dispatchEvent(new CustomEvent('user:refreshed', { detail: response.user }));
        return response.user;
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const value = {
    ...state,
    signInWithGoogle,
    completeProfile,
    signInWithEmail,
    updateProfile,
    logout,
    clearError,
    refreshUser
  };

  return (
    <SecureAuthContext.Provider value={value}>
      {children}
    </SecureAuthContext.Provider>
  );
};

// Custom hook to use secure auth context
export const useSecureAuth = () => {
  const context = useContext(SecureAuthContext);
  if (!context) {
    throw new Error('useSecureAuth must be used within a SecureAuthProvider');
  }
  return context;
};