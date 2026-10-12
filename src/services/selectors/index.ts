import type { RootState } from '@services/store';

export const selectIngredients = (
  state: RootState
): RootState['ingredients']['ingredients'] => state.ingredients.ingredients;

export const selectIngredientsLoading = (
  state: RootState
): RootState['ingredients']['isLoading'] => state.ingredients.isLoading;

export const selectIngredientsError = (
  state: RootState
): RootState['ingredients']['error'] => state.ingredients.error;

export const selectUser = (state: RootState): RootState['user']['user'] =>
  state.user.user;

export const selectUserName = (
  state: RootState
): NonNullable<RootState['user']['user']>['name'] | undefined => state.user.user?.name;

export const selectUserError = (state: RootState): RootState['user']['error'] =>
  state.user.error;

export const selectAuthChecked = (
  state: RootState
): RootState['user']['isAuthChecked'] => state.user.isAuthChecked;

export const selectFeed = (state: RootState): RootState['feed'] => state.feed;

export const selectFeedOrders = (state: RootState): RootState['feed']['orders'] =>
  state.feed.orders;

export const selectFeedLoading = (state: RootState): RootState['feed']['isLoading'] =>
  state.feed.isLoading;

export const selectFeedError = (state: RootState): RootState['feed']['error'] =>
  state.feed.error;

export const selectConstructorItems = (
  state: RootState
): RootState['burgerConstructor'] => state.burgerConstructor;

export const selectOrderRequest = (
  state: RootState
): RootState['order']['orderRequest'] => state.order.orderRequest;

export const selectOrderModalData = (
  state: RootState
): RootState['order']['orderModalData'] => state.order.orderModalData;

export const selectOrderError = (state: RootState): RootState['order']['error'] =>
  state.order.error;

export const selectProfileOrders = (state: RootState): RootState['orders']['orders'] =>
  state.orders.orders;

export const selectProfileOrdersLoading = (
  state: RootState
): RootState['orders']['isLoading'] => state.orders.isLoading;

export const selectProfileOrdersError = (
  state: RootState
): RootState['orders']['error'] => state.orders.error;

export const selectOrderInfo = (state: RootState): RootState['orderInfo']['order'] =>
  state.orderInfo.order;

export const selectOrderInfoLoading = (
  state: RootState
): RootState['orderInfo']['isLoading'] => state.orderInfo.isLoading;

export const selectOrderInfoError = (
  state: RootState
): RootState['orderInfo']['error'] => state.orderInfo.error;
