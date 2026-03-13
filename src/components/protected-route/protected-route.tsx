import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../../services/store';
import { Preloader } from '../ui';

type TProtectedProps = {
  onlyUnAuth?: boolean; // Флаг: доступ только для НЕавторизованных (логин, регистрация)
  children: React.ReactElement;
};

export const ProtectedRoute = ({ onlyUnAuth = false, children }: TProtectedProps) => {
  const { user, isAuthChecked } = useSelector((state: RootState) => state.user);
  const location = useLocation();

  // Пока идет запрос к API за профилем — показываем загрузку
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Если пользователь залогинен, но пытается зайти на /login или /register
  if (onlyUnAuth && user) {
    // Берем адрес из истории (куда он шел до этого) или на главную
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  // Если пользователь НЕ залогинен, но пытается зайти в /profile
  if (!onlyUnAuth && !user) {
    // Сохраняем в state текущий адрес, чтобы после логина вернуть его сюда
    return <Navigate to='/login' state={{ from: location }} />;
  }

  // Если всё ок — показываем нужную страницу
  return children;
};
