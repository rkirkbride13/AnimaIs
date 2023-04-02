/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

declare namespace Cypress {
  interface Chainable {
    signup(name: string, email: string, password: string): Chainable<any>;
  }
}

Cypress.Commands.add("signup", (name, email, password) => {
  cy.visit("/signup");
  cy.get('[data-cy="name"]').type(name);
  cy.get('[data-cy="email"]').type(email);
  cy.get('[data-cy="password"]').type(password);
  cy.get('[data-cy="signup-submit"]').click();
});

declare namespace Cypress {
  interface Chainable {
    signin(email: string, password: string): Chainable<any>;
  }
}

Cypress.Commands.add("signin", (email, password) => {
  cy.visit("/");
  cy.get('[data-cy="email"]').type(email);
  cy.get('[data-cy="password"]').type(password);
  cy.get('[data-cy="signin-submit"]').click();
});

//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }