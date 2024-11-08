import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('access_token');;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]); // Re-run only if authentication status changes

  return isAuthenticated ? children : null;
}

export default ProtectedRoute;
