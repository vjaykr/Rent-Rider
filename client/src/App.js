import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSecureAuth } from './context/SecureAuthContext';

// Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/auth/ProtectedRoute';



// Layouts
import OwnerLayout from './layouts/OwnerLayout';

// Pages (Lazy loaded for better performance)
const Home = React.lazy(() => import('./pages/Home/Home'));
const HowItWorks = React.lazy(() => import('./pages/HowItWorks'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Search = React.lazy(() => import('./pages/Search'));
const Wallet = React.lazy(() => import('./pages/Wallet'));
const Support = React.lazy(() => import('./pages/Support'));
const Earnings = React.lazy(() => import('./pages/Earnings'));
const Login = React.lazy(() => import('./components/auth/SecureLoginForm'));
const ProfileCompletion = React.lazy(() => import('./components/auth/ProfileCompletion'));
const ForgotPassword = React.lazy(() => import('./pages/Auth/ForgotPassword'));
const VehicleSearch = React.lazy(() => import('./pages/Vehicle/VehicleSearch'));
const VehicleDetails = React.lazy(() => import('./pages/Vehicle/VehicleDetails'));
const BookingPage = React.lazy(() => import('./pages/Booking/BookingPage'));
const BookingConfirmation = React.lazy(() => import('./pages/Booking/BookingConfirmation'));
const BookingHistory = React.lazy(() => import('./pages/Booking/BookingHistory'));
const Profile = React.lazy(() => import('./pages/Profile/Profile'));
const OwnerDashboard = React.lazy(() => import('./pages/OwnerDashboard/OwnerDashboard'));
const AddVehicle = React.lazy(() => import('./pages/OwnerDashboard/AddVehicle'));
const ManageVehicles = React.lazy(() => import('./pages/OwnerDashboard/ManageVehicles'));
const OwnerBookings = React.lazy(() => import('./pages/OwnerDashboard/OwnerBookings'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const PrivacyPolicy = React.lazy(() => import('./components/Legal/Privacy_Policy'));
const TermsOfService = React.lazy(() => import('./components/Legal/Terms_Of_Service'));
const CookiePolicy = React.lazy(() => import('./components/Legal/Cookie_Policy'));

function App() {
  const { loading } = useSecureAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <Navigation />
      
      <main className="flex-grow">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="large" />
          </div>
        }>
          <Routes key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile-completion" element={<ProfileCompletion />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/vehicles" element={<VehicleSearch />} />
            <Route path="/vehicles/:id" element={<VehicleDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            
            {/* Protected Routes - General */}
            <Route 
              path="/search" 
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/wallet" 
              element={
                <ProtectedRoute>
                  <Wallet />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/support" 
              element={
                <ProtectedRoute>
                  <Support />
                </ProtectedRoute>
              } 
            />

            
            {/* Protected Routes - Customer */}
            <Route 
              path="/book/:vehicleId" 
              element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/booking/confirmation/:bookingId" 
              element={
                <ProtectedRoute>
                  <BookingConfirmation />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bookings" 
              element={
                <ProtectedRoute>
                  <BookingHistory />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Routes - Owner */}
            <Route 
              path="/owner" 
              element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <OwnerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<OwnerDashboard />} />
              <Route path="dashboard" element={<OwnerDashboard />} />
              <Route path="vehicles" element={<ManageVehicles />} />
              <Route path="add-vehicle" element={<AddVehicle />} />
              <Route path="bookings" element={<OwnerBookings />} />
              <Route path="earnings" element={<Earnings />} />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      
      <Footer />
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#4ade80',
              color: '#fff',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#ef4444',
              color: '#fff',
            },
          },
          loading: {
            style: {
              background: '#3b82f6',
              color: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
