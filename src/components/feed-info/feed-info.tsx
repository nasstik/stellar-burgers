import { FC } from 'react';
import { useSelector } from '../../services/store'; // Твой типизированный хук
import { getOrders, getFeedState } from '../../services/slices/feedSlice';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

const getOrdersByStatus = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  // 1. Берем данные из стора
  const orders = useSelector(getOrders);
  const feed = useSelector(getFeedState);

  // 2. Формируем списки номеров заказов по статусам
  const readyOrders = getOrdersByStatus(orders, 'done');
  const pendingOrders = getOrdersByStatus(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{
        total: feed.total,
        totalToday: feed.totalToday
      }}
    />
  );
};
