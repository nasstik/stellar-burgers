import constructorReducer, {
    addIngredient,
    removeIngredient,
    moveIngredient
  } from './constructorSlice';
  
  describe('burgerConstructor slice', () => {
    const initialState = {
      bun: null,
      ingredients: []
    };
  
    const mockIngredient = {
      _id: '1',
      name: 'Ингредиент',
      type: 'main',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 10,
      price: 100,
      image: '',
      image_mobile: '',
      image_large: ''
    };
  
    test('должен обрабатывать добавление ингредиента', () => {
      // В редьюсере используется prepare с nanoid, поэтому проверяем структуру
      const newState = constructorReducer(initialState, addIngredient(mockIngredient));
      
      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]).toEqual(expect.objectContaining(mockIngredient));
      expect(newState.ingredients[0]).toHaveProperty('id'); // проверяем наличие сгенерированного nanoid
    });
  
    test('должен обрабатывать добавление булки', () => {
      const bunIngredient = { ...mockIngredient, type: 'bun', name: 'Булка' };
      const newState = constructorReducer(initialState, addIngredient(bunIngredient));
      
      expect(newState.bun).toEqual(expect.objectContaining(bunIngredient));
    });
  
    test('должен обрабатывать удаление ингредиента', () => {
      const stateWithItem = {
        bun: null,
        ingredients: [{ ...mockIngredient, id: 'test-id' }]
      };
  
      const newState = constructorReducer(stateWithItem, removeIngredient('test-id'));
      
      expect(newState.ingredients).toHaveLength(0);
    });
  
    test('должен обрабатывать изменение порядка ингредиентов', () => {
      const stateWithItems = {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: '1', name: 'Первый' },
          { ...mockIngredient, id: '2', name: 'Второй' }
        ]
      };
  
      // Перемещаем с индекса 0 на индекс 1
      const newState = constructorReducer(
        stateWithItems, 
        moveIngredient({ from: 0, to: 1 })
      );
  
      expect(newState.ingredients[0].id).toBe('2');
      expect(newState.ingredients[1].id).toBe('1');
    });
  });
  