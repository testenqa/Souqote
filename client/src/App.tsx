import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/SimpleAuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { useAuth } from './contexts/SimpleAuthContext';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import RoleBasedRoute from './components/auth/RoleBasedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RFQs from './pages/rfqs/RFQs';
import RFQDetails from './pages/rfqs/RFQDetails';
import PostRFQ from './pages/rfqs/PostRFQ';
import MyRFQs from './pages/rfqs/MyRFQs';
import Vendors from './pages/vendors/Vendors';
import VendorProfile from './pages/vendors/VendorProfile';
import MyQuotes from './pages/vendors/MyQuotes';
import Messages from './pages/messages/Messages';
import Profile from './pages/profile/Profile';
import EditProfile from './pages/profile/EditProfile';
import AdminDashboard from './pages/admin/AdminDashboard';

// Test Supabase connection - temporarily disabled to fix loading issue
// import './utils/testSupabase';

// Removed ConditionalMyRFQs - now using separate routes with role-based access

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

const AppContent: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="min-h-screen">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/vendors/:id" element={<VendorProfile />} />
            
            {/* RFQ Browsing - Vendors can find RFQs to bid on */}
            <Route 
              path="/rfqs" 
              element={
                <RoleBasedRoute allowedRoles={['vendor', 'admin']} showAccessDenied={true}>
                  <RFQs />
                </RoleBasedRoute>
              } 
            />
            <Route path="/rfqs/:id" element={<RFQDetails />} />
            
            {/* Auth Routes */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />
            
            {/* Buyer-only Routes - Vendors cannot access */}
            <Route 
              path="/post-rfq" 
              element={
                <RoleBasedRoute allowedRoles={['buyer', 'admin']} showAccessDenied={true}>
                  <PostRFQ />
                </RoleBasedRoute>
              } 
            />
            
            {/* Vendor-only Routes - Buyers cannot access */}
            <Route 
              path="/my-quotes" 
              element={
                <RoleBasedRoute allowedRoles={['vendor', 'admin']} showAccessDenied={true}>
                  <MyQuotes />
                </RoleBasedRoute>
              } 
            />
            
            {/* Buyer-only RFQs Route - Vendors cannot access */}
            <Route 
              path="/my-rfqs" 
              element={
                <RoleBasedRoute allowedRoles={['buyer', 'admin']} showAccessDenied={true}>
                  <MyRFQs />
                </RoleBasedRoute>
              } 
            />
            
            {/* Common Protected Routes */}
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile/edit" 
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin-only Routes */}
            <Route 
              path="/admin" 
              element={
                <RoleBasedRoute allowedRoles={['admin']} showAccessDenied={true}>
                  <AdminDashboard />
                </RoleBasedRoute>
              } 
            />
            
            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
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
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
