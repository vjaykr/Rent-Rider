import React from 'react';
import '../styles/animations.css';

const SkeletonLoader = ({ className = '', lines = 1, height = 'h-4' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`skeleton ${height} bg-gray-200 rounded mb-2 last:mb-0`}
        />
      ))}
    </div>
  );
};

export const CardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
    <div className="skeleton h-48 bg-gray-200 rounded mb-4" />
    <div className="skeleton h-6 bg-gray-200 rounded mb-2" />
    <div className="skeleton h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="skeleton h-4 bg-gray-200 rounded w-1/2" />
  </div>
);

export const ListSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow animate-pulse">
        <div className="skeleton w-16 h-16 bg-gray-200 rounded-full" />
        <div className="flex-1">
          <div className="skeleton h-4 bg-gray-200 rounded mb-2" />
          <div className="skeleton h-3 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    ))}
  </div>
);

export default SkeletonLoader;