import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function VisitorRoute() {
  const { viewer } = useAuth();
  if (!viewer?.id) return <Outlet />;
  return <Navigate to="/" />;
}
