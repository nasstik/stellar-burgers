/// <reference types="cypress" />

const API_URL = 'https://norma.education-services.ru';

describe('тестирование конструктора бургера', () => {
  beforeEach(() => {
    // Используем маску '**', чтобы Cypress ловил запрос вне зависимости от домена,
    // если API_URL вдруг снова изменится
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');

    cy.setCookie('accessToken', 'test-access-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.visit('/');

    // Ждем только ингредиенты, так как getUser может сработать раньше или позже
    cy.wait('@getIngredients');
  });

  it('должен добавлять булки и начинку', () => {
    // Добавляем булку (ищем кнопку ВНУТРИ контейнера add-button)
    cy.get('[data-cy="add-button"] button').first().click();

    // Добавляем начинку (тоже ищем кнопку внутри)
    cy.get('[data-cy="add-button"] button').eq(1).click();

    // Проверяем наличие в конструкторе
    cy.get('[data-cy="constructor-bun-top"]').should('exist');
    // Используем полное название из твоего JSON
    cy.get('[data-cy="constructor-ingredients"]').should(
      'contain',
      'Биокотлета из марсианской магнолии'
    );
    cy.get('[data-cy="constructor-bun-bottom"]').should('exist');
  });

  describe('работа модальных окон', () => {
    it('открытие и закрытие модалки ингредиента по крестику', () => {
      cy.get('[data-cy="ingredient-link"]').first().click();
      cy.get('[data-cy="modal"]').should('be.visible'); // Проверка, что открылась
      cy.get('[data-cy="modal-close"]').should('be.visible').click();
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('закрытие модалки по клику на оверлей', () => {
      cy.get('[data-cy="ingredient-link"]').first().click();
      // Кликаем по оверлею (force нужен, если оверлей перекрыт контентом)
      cy.get('[data-cy="modal-overlay"]').click({ force: true });
      cy.get('[data-cy="modal"]').should('not.exist');
    });
  });
  it('создание заказа', () => {
    // 1. Используй маску '**', чтобы точно перехватить POST
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    // 2. Добавляем ингредиенты (ОБЯЗАТЕЛЬНО добавь 'button' в селектор!)
    // Иначе бургер не соберется и кнопка заказа будет неактивна
    cy.get('[data-cy="add-button"] button').first().click();
    cy.get('[data-cy="add-button"] button').eq(1).click();

    // 3. Кликаем по кнопке оформления
    cy.get('[data-cy="order-button"] button').click();

    // 4. Ждем ответа от сервера
    cy.wait('@createOrder');

    // 5. Проверяем номер заказа (убедись, что в order.json номер именно 12345)
    cy.get('[data-cy="order-number"]').should('have.text', '12345');

    // 6. Закрываем модалку
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    // 7. Проверка очистки конструктора
    cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
    cy.get('[data-cy="constructor-ingredients"]').should(
      'not.contain',
      'Биокотлета из марсианской магнолии'
    );
  });
});
