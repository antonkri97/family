/* eslint-disable @typescript-eslint/no-namespace */
import { faker } from "@faker-js/faker";
import type { CreatedPerson, User } from "./aliases";
import type * as CreatePerson from "./create-person";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Logs in with a random user. Yields the user and adds an alias to the user
       *
       * @returns {typeof login}
       * @memberof Chainable
       * @example
       *    cy.login()
       * @example
       *    cy.login({ email: 'whatever@example.com' })
       */
      login: typeof login;

      /**
       * Deletes the current @user
       *
       * @returns {typeof cleanupUser}
       * @memberof Chainable
       * @example
       *    cy.cleanupUser()
       * @example
       *    cy.cleanupUser({ email: 'whatever@example.com' })
       */
      cleanupUser: typeof cleanupUser;

      /**
       * Deletes the current @person
       *
       * @returns {typeof cleanupPerson}
       * @memberof Chainable
       * @example
       *    cy.cleanupPerson()
       * @example
       *    cy.cleanupPerson({ id: '12345678' })
       */
      cleanupPerson: typeof cleanupPerson;

      /**
       * Deletes persons
       *
       * @returns {typeof cleanupPerson}
       * @memberof Chainable
       * @example
       *    cy.cleanupPerson()
       * @example
       *    cy.cleanupPerson({ ids: ['12345678'] })
       */
      cleanupPersons: typeof cleanupPersons;

      /**
       * Create person
       *
       * @returns {typeof createPerson}
       * @memberof Chainable
       * @example
       *    cy.createPerson()
       * @example
       *    cy.createPerson({ email: address@example.com })
       */
      createPerson: typeof createPerson;

      /**
       * Extends the standard visit command to wait for the page to load
       *
       * @returns {typeof visitAndCheck}
       * @memberof Chainable
       * @example
       *    cy.visitAndCheck('/')
       *  @example
       *    cy.visitAndCheck('/', 500)
       */
      visitAndCheck: typeof visitAndCheck;
    }
  }
}

function login({
  email = faker.internet.email({ provider: "example.com" }),
}: {
  email?: string;
} = {}) {
  cy.then<User>(() => ({ email })).as("user");
  cy.exec(
    `npx ts-node --require tsconfig-paths/register ./cypress/support/create-user.ts "${email}"`
  ).then(({ stdout }) => {
    const cookieValue = stdout
      .replace(/.*<cookie>(?<cookieValue>.*)<\/cookie>.*/s, "$<cookieValue>")
      .trim();
    cy.setCookie("__session", cookieValue);
  });
  return cy.get<User>("@user");
}

function cleanupUser({ email }: { email?: string } = {}) {
  if (email) {
    deleteUserByEmail(email);
  } else {
    cy.get<User>("@user").then((user) => {
      const email = user.email;
      if (email) {
        deleteUserByEmail(email);
      }
    });
  }
  cy.clearCookie("__session");
}

function cleanupPerson({ id }: { id?: string } = {}) {
  if (id) {
    deletePerson(id);
  } else {
    cy.get("@person").then((person) => {
      const id = (person as { id?: string }).id;
      if (id) {
        deletePerson(id);
      }
    });
  }
  cy.clearCookie("__session");
}

function cleanupPersons({ ids }: { ids?: string[] } = {}) {
  if (ids) {
    ids.forEach((id) => {
      if (typeof id === "string") {
        deletePerson(id);
      }
    });
  } else {
    cy.get("@personIds").then((data) => {
      const ids = (data as { ids?: string[] }).ids;
      if (ids) {
        ids.forEach((id) => {
          deletePerson(id);
        });
      }
    });
  }
  cy.clearCookie("__session");
}

function deleteUserByEmail(email: string) {
  cy.exec(
    `npx ts-node --require tsconfig-paths/register ./cypress/support/delete-user.ts "${email}"`
  );
  cy.clearCookie("__session");
}

function deletePerson(id: string) {
  cy.exec(
    `npx ts-node --require tsconfig-paths/register ./cypress/support/delete-person.ts "${id}"`
  );
}

function createPerson(
  initialValue: Parameters<(typeof CreatePerson)["createPerson"]>[0]
) {
  return cy.get<User>("@user").then(({ email }) => {
    return execCreatePerson({
      ...initialValue,
      email,
      gender: initialValue?.gender ?? "MALE",
    }).then<CreatedPerson>(({ stdout }) => {
      return { person: JSON.parse(stdout) };
    });
  });
}

function execCreatePerson(
  initialValue: Parameters<(typeof CreatePerson)["createPerson"]>[0]
) {
  function escapeJSON(string: string) {
    return string.replace(/[\n"\\&\r\t\b\f]/g, "\\$&");
  }
  return cy.exec(
    `npx ts-node --require tsconfig-paths/register ./cypress/support/create-person.ts "${escapeJSON(
      JSON.stringify(initialValue)
    )}"`
  );
}

// We're waiting a second because of this issue happen randomly
// https://github.com/cypress-io/cypress/issues/7306
// Also added custom types to avoid getting detached
// https://github.com/cypress-io/cypress/issues/7306#issuecomment-1152752612
// ===========================================================
function visitAndCheck(url: string, waitTime = 1000) {
  cy.visit(url);
  cy.location("pathname").should("contain", url).wait(waitTime);
}

export const main = () => {
  Cypress.Commands.add("login", login);
  Cypress.Commands.add("cleanupUser", cleanupUser);
  Cypress.Commands.add("visitAndCheck", visitAndCheck);
  Cypress.Commands.add("cleanupPerson", cleanupPerson);
  Cypress.Commands.add("cleanupPersons", cleanupPersons);
  Cypress.Commands.add("createPerson", createPerson);
};
