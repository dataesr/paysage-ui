import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Error from '../errors';
import { PageSpinner } from '../spinner';

export default function ProtectedRoute({ roles }) {
  const { viewer, isLoading } = useAuth();
  const canView = roles.length ? (viewer.id && roles.includes(viewer.role)) : !!viewer.id;
  if (isLoading) return <PageSpinner />;
  if (canView) return <Outlet />;
  return <Error status="404" />;
}

ProtectedRoute.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string),
};

ProtectedRoute.defaultProps = {
  roles: [],
};
