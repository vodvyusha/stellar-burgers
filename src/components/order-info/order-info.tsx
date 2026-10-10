import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';
import { getOrderByNumber } from '@slices/orderInfoSlice';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const { number } = useParams();

  const orderData = useSelector((state) => state.orderInfo.order);

  const isLoading = useSelector((state) => state.orderInfo.isLoading);

  const error = useSelector((state) => state.orderInfo.error);

  const ingredients = useSelector((state) => state.ingredients.ingredients);

  const orderNumber = Number(number);

  const isInvalidNumber = !number || Number.isNaN(orderNumber);

  useEffect(() => {
    if (!isInvalidNumber) {
      dispatch(getOrderByNumber(orderNumber));
    }
  }, [dispatch, orderNumber, isInvalidNumber]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) {
      return null;
    }

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);

          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (isInvalidNumber) {
    return <p className="text text_type_main-medium">Некорректный номер заказа</p>;
  }

  if (error) {
    return <p className="text text_type_main-medium">{error}</p>;
  }

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
