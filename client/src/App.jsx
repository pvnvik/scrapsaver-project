import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AuctionsPage from './pages/AuctionsPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ProcessPage from './pages/ProcessPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import IncentivesPage from './pages/IncentivesPage.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auctions"
          element={
            <ProtectedRoute>
              <AuctionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/process" element={<ProcessPage />} />
        <Route path="/incentives" element={<IncentivesPage />} />
      </Routes>
    </AuthProvider>
  );
}
