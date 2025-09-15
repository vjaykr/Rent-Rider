import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { EnhancedToaster } from './components/CustomToast';
import { useSecureAuth } from './context/SecureAuthContext';
import { PageLoader } from './components/LoadingSpinner';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import './styles/animations.css';
import './styles/mobile.css';

// Lazy load all pages for optimal performance
const Home = lazy(() => import('./pages/Home/Home'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Search = lazy(() => import('./pages/Search'));
const Wallet = lazy(() => import('./pages/Wallet'));
const Support = lazy(() => import('./pages/Support'));
const Earnings = lazy(() => import('./pages/Earnings'));
const Login = lazy(() => import('./components/auth/SecureLoginForm'));
const ProfileCompletion = lazy(() => import('./pages/ProfileCompletion'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));
const VehicleSearch = lazy(() => import('./pages/Vehicle/VehicleSearch'));
const VehicleDetails = lazy(() => import('./pages/Vehicle/VehicleDetails'));
const BookingPage = lazy(() => import('./pages/Booking/BookingPage'));
const BookingConfirmation = lazy(() => import('./pages/Booking/BookingConfirmation'));
const BookingHistory = lazy(() => import('./pages/Booking/BookingHistory'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const OwnerDashboard = lazy(() => import('./pages/OwnerDashboard/OwnerDashboard'));
const AddVehicle = lazy(() => import('./pages/OwnerDashboard/AddVehicle'));
const ManageVehicles = lazy(() => import('./pages/OwnerDashboard/ManageVehicles'));
const OwnerBookings = lazy(() => import('./pages/OwnerDashboard/OwnerBookings'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PrivacyPolicy = lazy(() => import('./components/Legal/Privacy_Policy'));
const TermsOfService = lazy(() => import('./components/Legal/Terms_Of_Service'));
const CookiePolicy = lazy(() => import('./components/Legal/Cookie_Policy'));
const RefundPolicy = lazy(() => import('./components/Legal/Refund_Policy'));
const OwnerLayout = lazy(() => import('./layouts/OwnerLayout'));

function App() {
  const { loading } = useSecureAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader text="Initializing RentRider" />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col">
        <Navigation />
        
        <main className="flex-grow">
          <Suspense fallback={<PageLoader text="Loading page" />}>
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
              
              {/* Protected Routes - Profile */}
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              
              {/* Protected Routes - General */}
              <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
              <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
              <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
              
              {/* Protected Routes - Customer */}
              <Route path="/book/:vehicleId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
              <Route path="/booking/confirmation/:bookingId" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />
              <Route path="/bookings" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
              
              {/* Protected Routes - Owner */}
              <Route path="/owner" element={<ProtectedRoute allowedRoles={['owner']}><OwnerLayout /></ProtectedRoute>}>
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
        <ScrollToTop />
        
        <EnhancedToaster />
      </div>
    </ErrorBoundary>
  );
}

export default App;