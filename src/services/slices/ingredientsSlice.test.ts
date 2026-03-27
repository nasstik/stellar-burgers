import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';

describe('ingredients slice', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  test('при вызове fetchIngredients.pending переменная loading меняется на true', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('при вызове fetchIngredients.fulfilled данные записываются в ingredients и loading становится false', () => {
    const mockIngredients = [
      { _id: '1', name: 'Ингредиент 1', type: 'main' },
      { _id: '2', name: 'Ингредиент 2', type: 'bun' }
    ];
    
    const action = { 
      type: fetchIngredients.fulfilled.type, 
      payload: mockIngredients 
    };
    const state = ingredientsReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  test('при вызове fetchIngredients.rejected ошибка записывается в error и loading становится false', () => {
    const errorMessage = 'Ошибка сети';
    const action = { 
      type: fetchIngredients.rejected.type, 
      error: { message: errorMessage } 
    };
    const state = ingredientsReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
