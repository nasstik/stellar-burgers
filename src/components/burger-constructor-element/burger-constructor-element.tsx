import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store'; // Твой типизированный хук
import { removeIngredient, moveIngredient } from '../../services/slices/constructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    // Перемещение вниз (увеличиваем индекс)
    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        dispatch(moveIngredient({ from: index, to: index + 1 }));
      }
    };

    // Перемещение вверх (уменьшаем индекс)
    const handleMoveUp = () => {
      if (index > 0) {
        dispatch(moveIngredient({ from: index, to: index - 1 }));
      }
    };

    // Удаление по уникальному id из конструктора
    const handleClose = () => {
      dispatch(removeIngredient(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
