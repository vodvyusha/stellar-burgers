import { type SyntheticEvent, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '@services/store';
import { clearUserError, loginUser } from '@slices/userSlice';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const error = useSelector((state) => state.user.error);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    dispatch(clearUserError());
  }, [dispatch]);

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();

    const result = await dispatch(
      loginUser({
        email,
        password,
      })
    );

    if (loginUser.fulfilled.match(result)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
