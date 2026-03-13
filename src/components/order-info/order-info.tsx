import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom'; // Добавили для получения :number
import { useSelector } from '../../services/store'; // Твой хук
import { getIngredients } from '../../services/slices/ingredientsSlice';
import { getOrders, getFeedUserOrders } from '../../services/slices/feedSlice';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  /** TODO: взять переменные orderData и ingredients из стора */
  const allOrders = useSelector(getOrders).concat(useSelector(getFeedUserOrders));
  
  const orderData = useMemo(
    () => allOrders.find((item) => item.number === Number(number)),
    [allOrders, number]
  );

  const ingredients = useSelector(getIngredients);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
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
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
