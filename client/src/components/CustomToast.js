import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

// Simple Toast Component
const SimpleToast = ({ t, message, type = 'default' }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'loading':
        return '⏳';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const getStyles = () => {
    const baseStyles = 'flex items-center justify-between w-full p-3 rounded-lg shadow-lg border transition-all duration-200';
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-500 text-white border-green-400`;
      case 'error':
        return `${baseStyles} bg-red-500 text-white border-red-400`;
      case 'loading':
        return `${baseStyles} bg-blue-500 text-white border-blue-400`;
      case 'warning':
        return `${baseStyles} bg-yellow-500 text-white border-yellow-400`;
      default:
        return `${baseStyles} bg-white text-gray-800 border-gray-200`;
    }
  };

  return (
    <div 
      className={`${getStyles()} cursor-pointer`}
      onClick={() => toast.dismiss(t.id)}
    >
      <div className="flex items-center space-x-2">
        <span className="text-sm">{getIcon()}</span>
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          toast.dismiss(t.id);
        }}
        className="ml-2 p-1 rounded hover:bg-white/20 transition-colors"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// Simple Toast Functions
export const showToast = {
  success: (message, options = {}) => {
    return toast.custom((t) => (
      <SimpleToast t={t} message={message} type="success" />
    ), {
      duration: options.duration || 1500,
      position: 'top-right',
      ...options
    });
  },

  error: (message, options = {}) => {
    return toast.custom((t) => (
      <SimpleToast t={t} message={message} type="error" />
    ), {
      duration: options.duration || 3000,
      position: 'top-right',
      ...options
    });
  },

  loading: (message, options = {}) => {
    return toast.custom((t) => (
      <SimpleToast t={t} message={message} type="loading" />
    ), {
      duration: options.duration || Infinity,
      position: 'top-right',
      ...options
    });
  },

  warning: (message, options = {}) => {
    return toast.custom((t) => (
      <SimpleToast t={t} message={message} type="warning" />
    ), {
      duration: options.duration || 2000,
      position: 'top-right',
      ...options
    });
  },

  info: (message, options = {}) => {
    return toast.custom((t) => (
      <SimpleToast t={t} message={message} type="default" />
    ), {
      duration: options.duration || 1500,
      position: 'top-right',
      ...options
    });
  },

  dismiss: (toastId) => toast.dismiss(toastId)
};

// Simple Toaster Component
export const EnhancedToaster = () => (
  <Toaster
    position="top-right"
    containerStyle={{
      top: 20,
      right: 20,
      zIndex: 9999
    }}
    toastOptions={{
      style: {
        background: 'transparent',
        boxShadow: 'none',
        padding: 0
      }
    }}
  />
);

export default SimpleToast;