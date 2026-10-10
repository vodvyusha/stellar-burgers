import { useEffect } from 'react';

import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';

import { useDispatch, useSelector } from '@services/store';
import { getOrders } from '@slices/ordersSlice';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.orders.orders);

  const isLoading = useSelector((state) => state.orders.isLoading);

  const error = useSelector((state) => state.orders.error);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} error={error} />;
};
