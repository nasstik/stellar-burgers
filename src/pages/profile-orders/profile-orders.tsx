import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store'; 
import { fetchUserOrders, getFeedUserOrders } from '../../services/slices/feedSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  // 1. Берем именно личные заказы пользователя из стора
  const orders: TOrder[] = useSelector(getFeedUserOrders);

  // 2. Запрашиваем историю заказов при открытии страницы
  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);


  return <ProfileOrdersUI orders={orders} />;
};
