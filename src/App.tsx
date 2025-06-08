import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/layout/Header';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white dark:bg-gray-900">
            <Routes>
              {/* User Routes with Header */}
              <Route path="/" element={<><Header /><Home /></>} />
              <Route path="/auth" element={<><Header /><Auth /></>} />
              <Route path="/pricing" element={<><Header /><Home /></>} />
              <Route
                path="/dashboard"
                element={
                  <>
                    <Header />
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  </>
                }
              />
              <Route
                path="/settings"
                element={
                  <>
                    <Header />
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  </>
                }
              />
              
              {/* Admin Routes (no header) */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                    </Routes>
                  </AdminLayout>
                </AdminProtectedRoute>
              } />
              
              {/* 404 Catch-all Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
