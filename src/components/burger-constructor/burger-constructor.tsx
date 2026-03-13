import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store'; // используем твои типизированные хуки
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

// Импортируем экшены и селекторы из твоих слайсов
import { getConstructorState } from '../../services/slices/constructorSlice';
import { placeOrder, getOrderLoading, getOrderData, clearOrder } from '../../services/slices/orderSlice';
import { getUser } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. Берем данные из стора
  const constructorItems = useSelector(getConstructorState);
  const orderRequest = useSelector(getOrderLoading);
  const orderModalData = useSelector(getOrderData);
  const user = useSelector(getUser);

  // 2. Логика клика по кнопке "Оформить заказ"
  const onOrderClick = () => {
    // Если булки нет или заказ уже отправляется — ничего не делаем
    if (!constructorItems.bun || orderRequest) return;

    // Если пользователь не авторизован — редирект на логин
    if (!user) {
      navigate('/login');
      return;
    }

    // Собираем массив ID для API (булка сверху, булка снизу + начинка)
    const orderData = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(placeOrder(orderData));
  };

  // 3. Закрытие модалки с номером заказа
  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  // 4. Подсчет итоговой стоимости
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
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
