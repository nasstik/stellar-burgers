import { rootReducer } from './store';
import userReducer from './slices/userSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import orderReducer from './slices/orderSlice';
import feedReducer from './slices/feedSlice';

describe('rootReducer', () => {
  it('должен возвращать начальное состояние при экшене @@INIT', () => {
    const initAction = { type: '@@INIT' };
    const state = rootReducer(undefined, initAction);

    expect(state).toEqual({
      user: userReducer(undefined, initAction),
      ingredients: ingredientsReducer(undefined, initAction),
      burgerConstructor: constructorReducer(undefined, initAction),
      order: orderReducer(undefined, initAction),
      feed: feedReducer(undefined, initAction),
    });
  });
});
