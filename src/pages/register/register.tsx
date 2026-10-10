import { type SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '@services/store';
import { registerUser, clearUserError } from '@slices/userSlice';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector((state) => state.user.error);

  useEffect(() => {
    dispatch(clearUserError());
  }, [dispatch]);

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();

    const result = await dispatch(
      registerUser({
        name: userName,
        email,
        password,
      })
    );

    if (registerUser.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <RegisterUI
      errorText={error ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
