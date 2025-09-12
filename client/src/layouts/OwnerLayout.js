import React from 'react';
import Navigation from '../components/Navigation';

export default function OwnerLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}
