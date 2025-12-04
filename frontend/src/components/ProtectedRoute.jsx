import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('aura_admin_token');
    if (!token) {
      navigate('/admin/login', { replace: true });
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (isAuthenticated === null) {
    return (
      <div className="aura-loading">
        <div className="aura-spinner"></div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
}

export default ProtectedRoute;
