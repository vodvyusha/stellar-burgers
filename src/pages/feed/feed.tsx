import { useEffect } from 'react';

import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

import { useDispatch, useSelector } from '@services/store';
import { getFeeds } from '@slices/feedSlice';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.feed.orders);

  const isLoading = useSelector((state) => state.feed.isLoading);

  const error = useSelector((state) => state.feed.error);

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  const handleGetFeeds = (): void => {
    dispatch(getFeeds());
  };

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} error={error} handleGetFeeds={handleGetFeeds} />;
};
