import { FC } from 'react';
import { useSelector } from '../../services/store'; // Твой хук
import { getUser } from '../../services/slices/userSlice'; // Твой селектор
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
    // Берем данные пользователя из Redux
    const user = useSelector(getUser);
  
    // Передаем имя пользователя в UI (если юзера нет, будет пустая строка)
    return <AppHeaderUI userName={user?.name || ''} />;
  };