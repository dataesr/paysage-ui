import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function ProtectedRoute({ roles }) {
  const { viewer } = useAuth();
  const canView = roles.length ? (viewer.id && roles.includes(viewer.role)) : !!viewer.id;
  if (canView) return <Outlet />;
  return <Navigate to="/se-connecter" replace />;
}

ProtectedRoute.propTypes = {
  roles: PropTypes.arrayOf([PropTypes.string]),
};

ProtectedRoute.defaultProps = {
  roles: [],
};
