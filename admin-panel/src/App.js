import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Components
import LoadingSpinner from './components/LoadingSpinner';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages (Lazy loaded for better performance)
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'));
const Users = React.lazy(() => import('./pages/Users/Users'));
const Vehicles = React.lazy(() => import('./pages/Vehicles/Vehicles'));
const AddVehicle = React.lazy(() => import('./pages/Vehicles/AddVehicle'));
const MyBikes = React.lazy(() => import('./pages/MyBikes/MyBikes'));
const Bookings = React.lazy(() => import('./pages/Bookings/Bookings'));
const Payments = React.lazy(() => import('./pages/Payments/Payments'));
const Reports = React.lazy(() => import('./pages/Reports/Reports'));
const Login = React.lazy(() => import('./pages/Login'));

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="large" />
        </div>
      }>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Admin Routes with Layout */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <ProtectedRoute>
                <Layout><Users /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vehicles" 
            element={
              <ProtectedRoute>
                <Layout><Vehicles /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vehicles/add" 
            element={
              <ProtectedRoute>
                <Layout><AddVehicle /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-bikes" 
            element={
              <ProtectedRoute>
                <Layout><MyBikes /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bookings" 
            element={
              <ProtectedRoute>
                <Layout><Bookings /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payments" 
            element={
              <ProtectedRoute>
                <Layout><Payments /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute>
                <Layout><Reports /></Layout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
