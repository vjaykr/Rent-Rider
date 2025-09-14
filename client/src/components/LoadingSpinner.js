import React from 'react';
import '../styles/animations.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'blue', 
  text = '', 
  fullScreen = false,
  overlay = false 
}) => {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'border-blue-600 border-t-blue-200',
    white: 'border-white border-t-gray-300',
    gray: 'border-gray-600 border-t-gray-300',
    green: 'border-green-600 border-t-green-200',
    red: 'border-red-600 border-t-red-200'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative">
        <div 
          className={`${sizeClasses[size]} ${colorClasses[color]} border-3 rounded-full animate-spin gpu-accelerated`}
        />
        <div 
          className={`absolute inset-0 ${sizeClasses[size]} border-3 border-transparent border-t-current rounded-full animate-pulse opacity-30`}
        />
      </div>
      {text && (
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 animate-pulse">
            {text}<span className="loading-dots"></span>
          </p>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-2xl border border-white/20">
          {spinner}
        </div>
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Skeleton Components
export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse ${className}`}>
    <div className="skeleton h-48 bg-gray-200" />
    <div className="p-6 space-y-3">
      <div className="skeleton h-6 bg-gray-200 rounded w-3/4" />
      <div className="skeleton h-4 bg-gray-200 rounded w-1/2" />
      <div className="skeleton h-4 bg-gray-200 rounded w-2/3" />
      <div className="flex justify-between items-center pt-2">
        <div className="skeleton h-5 bg-gray-200 rounded w-1/4" />
        <div className="skeleton h-8 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  </div>
);

export const SkeletonList = ({ items = 5, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm animate-pulse">
        <div className="skeleton w-16 h-16 bg-gray-200 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-5 bg-gray-200 rounded w-3/4" />
          <div className="skeleton h-4 bg-gray-200 rounded w-1/2" />
          <div className="skeleton h-3 bg-gray-200 rounded w-1/3" />
        </div>
        <div className="skeleton w-20 h-8 bg-gray-200 rounded-lg" />
      </div>
    ))}
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
    <div className="p-6 border-b border-gray-200">
      <div className="skeleton h-6 bg-gray-200 rounded w-1/4" />
    </div>
    <div className="divide-y divide-gray-200">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4 flex items-center space-x-4 animate-pulse">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div key={colIndex} className="flex-1">
              <div className="skeleton h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Loading States for Different Components
export const PageLoader = ({ text = 'Loading page' }) => (
  <LoadingSpinner size="large" text={text} fullScreen />
);

export const ComponentLoader = ({ text = 'Loading' }) => (
  <LoadingSpinner size="medium" text={text} overlay />
);

export const ButtonLoader = ({ size = 'small' }) => (
  <LoadingSpinner size={size} color="white" />
);

export default LoadingSpinner;