import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { auth, onAuthStateChange } from '../config/firebase';
import { authService } from '../services/authService';

// Initial state
const initialState = {
  user: null,
  loading: true,
  isAuthenticated: false,
  token: localStorage.getItem('token'),
  error: null
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
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
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
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
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await authService.getProfile();
          if (response.success) {
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: { user: response.user, token }
            });
          } else {
            localStorage.removeItem('token');
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
          }
        } catch (error) {
          localStorage.removeItem('token');
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      // This helps maintain Firebase session state
      // The actual authentication is handled by our unified system
    });

    return unsubscribe;
  }, []);

  // Login with Firebase (Google/Email)
  const loginWithFirebase = async (idToken, userData = null) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await authService.firebaseAuth(idToken, userData);
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: response.user, token: response.token }
        });
        return { success: true, user: response.user };
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Authentication failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
      return { success: false, message };
    }
  };

  // Login with email/password
  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await authService.login(email, password);
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: response.user, token: response.token }
        });
        return { success: true, user: response.user };
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
      return { success: false, message };
    }
  };

  // Register
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await authService.register(userData);
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: response.user, token: response.token }
        });
        return { success: true, user: response.user };
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
      return { success: false, message };
    }
  };

  // Update profile
  const updateProfile = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await authService.updateProfile(userData);
      
      if (response.success) {
        dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: response.user });
        return { success: true, user: response.user };
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
      return { success: false, message };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      
      // Sign out from Firebase as well
      try {
        await auth.signOut();
      } catch (firebaseError) {
        console.error('Firebase signout error:', firebaseError);
      }
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    loginWithFirebase,
    login,
    register,
    updateProfile,
    logout,
    clearError
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