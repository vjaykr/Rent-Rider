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
    const baseStyles = 'flex items-center justify-between w-auto max-w-xs p-2 rounded-lg shadow-lg border transition-all duration-150';
    
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
      onMouseEnter={() => toast.dismiss(t.id)}
    >
      <div className="flex items-center space-x-1">
        <span className="text-xs">{getIcon()}</span>
        <span className="text-xs font-medium whitespace-nowrap">{message}</span>
      </div>
    </div>
  );
};

// Simple Toast Functions
export const showToast = {
  success: (message, options = {}) => {
    return toast.custom((t) => (
      <SimpleToast t={t} message={message} type="success" />
    ), {
      duration: 2000,
      position: 'top-right',
      ...options
    });
  },

  error: (message, options = {}) => {
    return toast.custom((t) => (
      <SimpleToast t={t} message={message} type="error" />
    ), {
      duration: 2000,
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
      duration: 2000,
      position: 'top-right',
      ...options
    });
  },

  info: (message, options = {}) => {
    return toast.custom((t) => (
      <SimpleToast t={t} message={message} type="default" />
    ), {
      duration: 2000,
      position: 'top-right',
      ...options
    });
  },

  dismiss: (toastId) => toast.dismiss(toastId)
};

// Mobile-Responsive Toaster Component
export const EnhancedToaster = () => (
  <Toaster
    position="top-right"
    containerStyle={{
      top: 20,
      right: 20,
      zIndex: 9999
    }}
    toastOptions={{
      duration: 2000,
      style: {
        background: 'transparent',
        boxShadow: 'none',
        padding: 0,
        maxWidth: 'fit-content',
        minWidth: 'auto'
      }
    }}
  />
);

export default SimpleToast;