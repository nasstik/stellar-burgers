import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { TOrder } from '@utils-types';

import { getConstructorState } from '../../services/slices/constructorSlice';
import {
  placeOrder,
  getOrderLoading,
  getOrderData,
  clearOrder
} from '../../services/slices/orderSlice';
import { getUser } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(getConstructorState);
  const orderRequest = useSelector(getOrderLoading);
  const orderModalData = useSelector(getOrderData);
  const user = useSelector(getUser);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const orderData = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(placeOrder(orderData));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
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
      constructorItems={constructorItems}
      orderModalData={orderModalData as TOrder}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
