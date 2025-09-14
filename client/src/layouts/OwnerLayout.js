import React from 'react';
import { Outlet } from 'react-router-dom';

export default function OwnerLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
}
