import { getOrders } from '@slices/ordersSlice';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import {
  selectProfileOrders,
  selectProfileOrdersError,
  selectProfileOrdersLoading,
} from '@services/selectors';
import { useDispatch, useSelector } from '@services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders = useSelector(selectProfileOrders);

  const isLoading = useSelector(selectProfileOrdersLoading);

  const error = useSelector(selectProfileOrdersError);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} error={error} />;
};
