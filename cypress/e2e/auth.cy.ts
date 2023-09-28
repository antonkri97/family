import { faker } from "@faker-js/faker";
import type { User } from "support/aliases";

describe("auth", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow you to register and login", () => {
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
      password: faker.internet.password(),
    };

    cy.then<User>(() => ({ email: loginForm.email })).as("user");

    cy.visitAndCheck("/");

    cy.get("[data-test-id='join']").click();

    cy.get("[data-test-id='email']").type(loginForm.email);
    cy.get("[data-test-id='password']").type(loginForm.password);

    cy.get("[data-test-id='register']").click();

    cy.get("[data-test-id='logout']").click();

    cy.get("[data-test-id='login']").click();

    cy.get("[data-test-id='email']").type(loginForm.email);
    cy.get("[data-test-id='password']").type(loginForm.password);
    cy.get("[data-test-id='login']").click();

    cy.get("[data-test-id='logout']").click();
  });
});
