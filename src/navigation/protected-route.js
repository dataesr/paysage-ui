import PropTypes from 'prop-types';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Error from '../components/errors';
import { PageSpinner } from '../components/spinner';

export default function ProtectedRoute({ roles }) {
  const { viewer, isLoading } = useAuth();
  const { pathname } = useLocation();
  const canView = roles.length ? (viewer.id && roles.includes(viewer.role)) : !!viewer.id;
  if (isLoading) return <PageSpinner />;
  if (canView) return <Outlet />;
  if (!canView && pathname === '/') return <Navigate to="/se-connecter" />;
  return <Error status="404" />;
}

ProtectedRoute.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string),
};

ProtectedRoute.defaultProps = {
  roles: [],
};
