import { rootReducer } from './store'; 

describe('rootReducer', () => {
  it('должен правильно инициализироваться с дефолтным состоянием', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    
    expect(initialState).toEqual({
      user: expect.any(Object),
      ingredients: expect.any(Object),
      burgerConstructor: expect.any(Object),
      order: expect.any(Object),
      feed: expect.any(Object)
    });
  });
});
