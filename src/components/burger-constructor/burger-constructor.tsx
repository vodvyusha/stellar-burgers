import { clearConstructor } from '@slices/constructorSlice';
import { createOrder, resetOrder } from '@slices/orderSlice';
import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  selectConstructorItems,
  selectOrderError,
  selectOrderModalData,
  selectOrderRequest,
  selectUser,
} from '@services/selectors';
import { useDispatch, useSelector } from '@services/store';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const orderError = useSelector(selectOrderError);
  const user = useSelector(selectUser);

  const onOrderClick = async (): Promise<void> => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login', {
        state: { from: location },
      });

      return;
    }
    const ingredientIds = [
      constructorItems.bun._id,

      ...constructorItems.ingredients.map((ingredient) => ingredient._id),

      constructorItems.bun._id,
    ];
    const result = await dispatch(createOrder(ingredientIds));
    if (createOrder.fulfilled.match(result)) {
      dispatch(clearConstructor());
    }
  };

  const closeOrderModal = (): void => {
    dispatch(resetOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      orderError={orderError}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
