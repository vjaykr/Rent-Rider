import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/authService';
import firebaseAuthService from '../services/firebaseAuthService';
import toast from 'react-hot-toast';

// Initial state
const initialState = {
  user: null,
  firebaseUser: null,
  token: localStorage.getItem('token'),
  firebaseToken: null,
  loading: true,
  isAuthenticated: false,
  authMethod: 'email', // 'email', 'phone', 'google', 'facebook'
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  UPDATE_USER: 'UPDATE_USER',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_FIREBASE_USER: 'SET_FIREBASE_USER',
  SET_AUTH_METHOD: 'SET_AUTH_METHOD',
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        firebaseUser: action.payload.firebaseUser,
        token: action.payload.token,
        firebaseToken: action.payload.firebaseToken,
        isAuthenticated: true,
        authMethod: action.payload.authMethod || 'email',
        loading: false,
      };
    
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        firebaseUser: null,
        token: null,
        firebaseToken: null,
        isAuthenticated: false,
        loading: false,
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        firebaseUser: null,
        token: null,
        firebaseToken: null,
        isAuthenticated: false,
        loading: false,
      };
    
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    
    case AUTH_ACTIONS.SET_FIREBASE_USER:
      return {
        ...state,
        firebaseUser: action.payload,
      };
    
    case AUTH_ACTIONS.SET_AUTH_METHOD:
      return {
        ...state,
        authMethod: action.payload,
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await authAPI.getProfile();
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              user: response.data,
              token,
            },
          });
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkAuth();
    
    // Set up Firebase auth state listener
    const unsubscribe = firebaseAuthService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const firebaseToken = await firebaseUser.getIdToken();
        dispatch({
          type: AUTH_ACTIONS.SET_FIREBASE_USER,
          payload: firebaseUser,
        });
        
        // Store Firebase token
        localStorage.setItem('firebaseToken', firebaseToken);
      } else {
        dispatch({
          type: AUTH_ACTIONS.SET_FIREBASE_USER,
          payload: null,
        });
        localStorage.removeItem('firebaseToken');
      }
    });

    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      const response = await authAPI.login(credentials);
      const { user, token } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token },
      });
      
      toast.success(`Welcome back, ${user.firstName}!`);
      return { success: true, user };
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
      
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      const response = await authAPI.register(userData);
      const { user, token } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token },
      });
      
      toast.success(`Welcome to Rydigo, ${user.firstName}!`);
      return { success: true, user };
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
      
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    toast.success('Logged out successfully');
  };

  // Update user profile
  const updateUser = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: response.data,
      });
      
      toast.success('Profile updated successfully');
      return { success: true, user: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      await authAPI.changePassword(passwordData);
      toast.success('Password changed successfully');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password change failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      await authAPI.forgotPassword(email);
      toast.success('Password reset email sent');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset email';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Reset password
  const resetPassword = async (token, newPassword) => {
    try {
      await authAPI.resetPassword(token, newPassword);
      toast.success('Password reset successfully');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Verify email
  const verifyEmail = async (token) => {
    try {
      const response = await authAPI.verifyEmail(token);
      
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: { isEmailVerified: true },
      });
      
      toast.success('Email verified successfully');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Email verification failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Firebase Authentication Methods
  
  // Firebase Email/Password login
  const firebaseLogin = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      const result = await firebaseAuthService.signInWithEmailPassword(email, password);
      
      if (result.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: result.user,
            firebaseUser: result.user,
            token: result.token,
            firebaseToken: result.token,
            authMethod: 'email'
          },
        });
        
        toast.success(`Welcome back, ${result.user.displayName || result.user.email}!`);
        return { success: true, user: result.user };
      } else {
        dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
      toast.error('Login failed');
      return { success: false, error: error.message };
    }
  };

  // Firebase Email/Password registration
  const firebaseRegister = async (email, password, userData = {}) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      const result = await firebaseAuthService.createUserWithEmailPassword(email, password, userData);
      
      if (result.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: result.user,
            firebaseUser: result.user,
            token: result.token,
            firebaseToken: result.token,
            authMethod: 'email'
          },
        });
        
        toast.success(`Welcome to RentRider, ${result.user.displayName || result.user.email}!`);
        return { success: true, user: result.user };
      } else {
        dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
      toast.error('Registration failed');
      return { success: false, error: error.message };
    }
  };

  // Firebase Google login
  const googleLogin = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      const result = await firebaseAuthService.signInWithGoogle();
      
      if (result.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: result.user,
            firebaseUser: result.user,
            token: result.token,
            firebaseToken: result.token,
            authMethod: 'google'
          },
        });
        
        toast.success(`Welcome back, ${result.user.displayName || result.user.email}!`);
        return { success: true, user: result.user };
      } else {
        dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
      toast.error('Google login failed');
      return { success: false, error: error.message };
    }
  };

  // Firebase Facebook login
  const facebookLogin = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      const result = await firebaseAuthService.signInWithFacebook();
      
      if (result.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: result.user,
            firebaseUser: result.user,
            token: result.token,
            firebaseToken: result.token,
            authMethod: 'facebook'
          },
        });
        
        toast.success(`Welcome back, ${result.user.displayName || result.user.email}!`);
        return { success: true, user: result.user };
      } else {
        dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
      toast.error('Facebook login failed');
      return { success: false, error: error.message };
    }
  };

  // Firebase Phone authentication
  const sendPhoneVerification = async (phoneNumber) => {
    try {
      const result = await firebaseAuthService.sendPhoneVerification(phoneNumber);
      
      if (result.success) {
        toast.success('Verification code sent to your phone');
        return { success: true, confirmationResult: result.confirmationResult };
      } else {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      toast.error('Phone verification failed');
      return { success: false, error: error.message };
    }
  };

  const verifyPhoneCode = async (confirmationResult, code) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      const result = await firebaseAuthService.verifyPhoneCode(confirmationResult, code);
      
      if (result.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: result.user,
            firebaseUser: result.user,
            token: result.token,
            firebaseToken: result.token,
            authMethod: 'phone'
          },
        });
        
        toast.success('Phone verification successful!');
        return { success: true, user: result.user };
      } else {
        dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
      toast.error('Phone verification failed');
      return { success: false, error: error.message };
    }
  };

  // Firebase Password reset
  const firebaseResetPassword = async (email) => {
    try {
      const result = await firebaseAuthService.sendPasswordReset(email);
      
      if (result.success) {
        toast.success('Password reset email sent');
        return { success: true };
      } else {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      toast.error('Password reset failed');
      return { success: false, error: error.message };
    }
  };

  // Firebase Logout
  const firebaseLogout = async () => {
    try {
      await firebaseAuthService.signOut();
      localStorage.removeItem('token');
      localStorage.removeItem('firebaseToken');
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  // Helper functions
  const isOwner = () => state.user?.role === 'owner';
  const isCustomer = () => state.user?.role === 'customer';
  const isAdmin = () => state.user?.role === 'admin';
  
  const hasRole = (role) => {
    if (Array.isArray(role)) {
      return role.includes(state.user?.role);
    }
    return state.user?.role === role;
  };

  const value = {
    // State
    ...state,
    
    // Actions
    login,
    register,
    logout,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    
    // Firebase Actions
    firebaseLogin,
    firebaseRegister,
    googleLogin,
    facebookLogin,
    sendPhoneVerification,
    verifyPhoneCode,
    firebaseResetPassword,
    firebaseLogout,
    
    // Helper functions
    isOwner,
    isCustomer,
    isAdmin,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
