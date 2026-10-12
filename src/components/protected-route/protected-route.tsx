import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

import { selectAuthChecked, selectUser } from '@services/selectors';
import { useSelector } from '@services/store';

import type { ReactNode } from 'react';

type TProtectedRouteProps = {
  children: ReactNode;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
}: TProtectedRouteProps): React.JSX.Element => {
  const location = useLocation();

  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectAuthChecked);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from?.pathname || '/';

    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
