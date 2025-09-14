import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// صفحات المصادقة
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// صفحات التطبيق
import { ModernDashboard, DashboardLayout } from './components/dashboard';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* الصفحة الرئيسية - إعادة توجيه إلى لوحة التحكم أو تسجيل الدخول */}
            <Route 
              path="/" 
              element={<Navigate to="/dashboard" replace />} 
            />
            
            {/* صفحات المصادقة - لا تتطلب مصادقة */}
            <Route 
              path="/login" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <LoginPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <RegisterPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/verify-email" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <VerifyEmailPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/forgot-password" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <ForgotPasswordPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reset-password" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <ResetPasswordPage />
                </ProtectedRoute>
              } 
            />
            
            {/* صفحات التطبيق - تتطلب مصادقة */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <ModernDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* أي مسار غير موجود - إعادة توجيه إلى الصفحة الرئيسية */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
