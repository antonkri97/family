import type { CreatedPerson, User } from "support/aliases";

describe("trees", () => {
  it("should render tree", () => {
    // prepare
    cy.login()
      .then<User>(({ email }) => ({ email }))
      .as("user");

    cy.createPerson({ gender: "MALE" }).as("father");
    cy.get<CreatedPerson>("@father")
      .then(({ person }) =>
        cy.createPerson({ gender: "FEMALE", spouseId: person?.id })
      )
      .as("mother");

    cy.get<CreatedPerson>("@father").then(({ person: father }) =>
      cy
        .get<CreatedPerson>("@mother")
        .then(({ person: mother }) =>
          cy.createPerson({
            fatherId: father?.id,
            motherId: mother?.id,
            gender: "MALE",
          })
        )
        .as("son")
    );

    cy.get<CreatedPerson>("@son")
      .then(({ person: son }) =>
        cy.createPerson({ gender: "FEMALE", spouseId: son?.id })
      )
      .as("sonsWife");

    cy.visitAndCheck("/main/trees");
  });
});
