import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import { ROUTES } from '../constants';

export function ProtectedRoute() {
  const token = useAppSelector(s => s.auth.token);
  return token ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
}
