import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, roleRequired }) {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roleRequired && user?.accountType !== roleRequired) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}