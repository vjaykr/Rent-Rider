import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Components
import LoadingSpinner from './components/LoadingSpinner';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

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
const PrivacyPolicy = React.lazy(() => import('./components/Legal/Privacy_Policy'));
const TermsOfService = React.lazy(() => import('./components/Legal/Terms_Of_Service'));
const CookiePolicy = React.lazy(() => import('./components/Legal/Cookie_Policy'));
const RefundPolicy = React.lazy(() => import('./components/Legal/Refund_Policy'));

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
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          
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
      <ScrollToTop />
    </div>
  );
}

export default App;
