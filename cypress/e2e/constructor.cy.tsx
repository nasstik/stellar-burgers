/// <reference types="cypress" />

const API_URL = 'https://norma.education-services.ru';

describe('тестирование конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');

    cy.setCookie('accessToken', 'test-access-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.visit('/');

    cy.wait('@getIngredients');
  });

  it('должен добавлять булки и начинку', () => {
    cy.get('[data-cy="add-button"] button').first().click();
    cy.get('[data-cy="add-button"] button').eq(1).click();
    cy.get('[data-cy="constructor-bun-top"]').should('exist');
    cy.get('[data-cy="constructor-ingredients"]').should(
      'contain',
      'Биокотлета из марсианской магнолии'
    );
    cy.get('[data-cy="constructor-bun-bottom"]').should('exist');
  });

  describe('работа модальных окон', () => {
    it('открытие и закрытие модалки ингредиента по крестику', () => {
      cy.get('[data-cy="ingredient-link"]').first().click();
      cy.get('[data-cy="modal"]').should('be.visible'); 
      cy.get('[data-cy="modal-close"]').should('be.visible').click();
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('закрытие модалки по клику на оверлей', () => {
      cy.get('[data-cy="ingredient-link"]').first().click();
      cy.get('[data-cy="modal-overlay"]').click({ force: true });
      cy.get('[data-cy="modal"]').should('not.exist');
    });
  });
  it('создание заказа', () => {
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    cy.get('[data-cy="add-button"] button').first().click();
    cy.get('[data-cy="add-button"] button').eq(1).click();

    cy.get('[data-cy="order-button"] button').click();

    cy.wait('@createOrder');

    cy.get('[data-cy="order-number"]').should('have.text', '12345');

    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
    cy.get('[data-cy="constructor-ingredients"]').should(
      'not.contain',
      'Биокотлета из марсианской магнолии'
    );
  });
});
