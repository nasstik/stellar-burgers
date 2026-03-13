import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react'; // Добавили useEffect
import { useDispatch, useSelector } from '../../services/store'; // Твои хуки
import { fetchFeeds, getOrders } from '../../services/slices/feedSlice'; // Твои экшены


export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  
  // 1. Берем заказы из стора
  const orders: TOrder[] = useSelector(getOrders);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]); 


  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  }; 

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
