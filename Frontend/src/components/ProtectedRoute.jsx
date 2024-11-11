import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('access_token');;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
}

return children;
}

export default ProtectedRoute;
