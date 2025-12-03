import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/aura.css';
import AdminDashboard from './pages/AdminDashboard';
import GuestRegistration from './pages/GuestRegistration';
import CheckinScanner from './pages/CheckinScanner';
import Landing from './pages/Landing';
import Layout from './components/Layout';
import AdminLogin from './pages/AdminLogin';

function RequireAdmin({ children }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('aura_admin_token') : null;
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />
          <Route path="/register/:code" element={<GuestRegistration />} />
          <Route path="/checkin" element={<CheckinScanner />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
