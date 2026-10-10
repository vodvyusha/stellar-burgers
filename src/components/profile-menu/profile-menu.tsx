import { ProfileMenuUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDispatch } from '@services/store';
import { logoutUser } from '@slices/userSlice';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    const result = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(result)) {
      navigate('/login');
    }
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
