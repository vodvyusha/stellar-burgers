import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { BurgerConstructorUI } from '@ui';

import { useDispatch, useSelector } from '@services/store';

import { createOrder, resetOrder } from '@slices/orderSlice';

import { clearConstructor } from '@slices/constructorSlice';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const constructorItems = useSelector((state) => state.burgerConstructor);
  const orderRequest = useSelector((state) => state.order.orderRequest);
  const orderModalData = useSelector((state) => state.order.orderModalData);
  const orderError = useSelector((state) => state.order.error);
  const user = useSelector((state) => state.user.user);

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
