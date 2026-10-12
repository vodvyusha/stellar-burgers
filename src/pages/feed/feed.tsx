import { getFeeds } from '@slices/feedSlice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import {
  selectFeedError,
  selectFeedLoading,
  selectFeedOrders,
} from '@services/selectors';
import { useDispatch, useSelector } from '@services/store';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders = useSelector(selectFeedOrders);

  const isLoading = useSelector(selectFeedLoading);

  const error = useSelector(selectFeedError);

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
