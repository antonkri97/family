import { faker } from "@faker-js/faker";
import type { CreatedPerson, User } from "support/aliases";
import { isString } from "support/utils";

describe("update person", () => {
  it("should update person", () => {
    cy.login().then(({ email }) => {
      cy.createPerson({ email, gender: "MALE" })?.as("person");
    });
    cy.get<CreatedPerson>("@person").then(({ person }) => {
      cy.visitAndCheck(`/main/person/edit/${person?.id}`);
    });

    const personForm = {
      firstName: faker.internet.userName(),
      secondName: faker.internet.userName(),
      thirdName: faker.internet.userName(),
      birthday: faker.date.birthdate(),
    };

    cy.get<CreatedPerson>("@person").then(({ person }) => {
      cy.get("[data-test-id='first-name']").should(
        "have.value",
        person?.firstName
      );
      cy.get("[data-test-id='second-name']").should(
        "have.value",
        person?.secondName
      );
      cy.get("[data-test-id='third-name']").should(
        "have.value",
        person?.thirdName
      );
      cy.get("[data-test-id='birthday']").should(
        "have.value",
        person?.birthday
      );

      cy.get("[data-test-id='mother']").should(
        "have.value",
        person?.motherId ?? ""
      );

      cy.get("[data-test-id='father']").should(
        "have.value",
        person?.fatherId ?? ""
      );

      cy.get("[data-test-id='spouse']").should(
        "have.value",
        person?.spouseId ?? ""
      );

      cy.get("[data-test-id='bio']").should("have.value", person?.bio ?? "");
    });

    cy.get("[data-test-id='first-name']").type(
      `{selectAll}{backspace}${personForm.firstName}`,
      {
        force: true,
      }
    );
    cy.get("[data-test-id='second-name']").type(
      `{selectAll}{backspace}${personForm.secondName}`,
      {
        force: true,
      }
    );
    cy.get("[data-test-id='third-name']").type(
      `{selectAll}{backspace}${personForm.thirdName}`,
      {
        force: true,
      }
    );
    cy.get("[data-test-id='birthday']").type(
      `{selectAll}{backspace}${personForm.birthday.toDateString()}`,
      { force: true }
    );

    cy.get("[data-test-id='update']").click();

    cy.get<CreatedPerson>("@person").then(({ person }) => {
      cy.cleanupPerson(person);
    });
  });

  it("should update person with his relations", () => {
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

    cy.createPerson({ gender: "FEMALE" }).as("newWife");

    cy.createPerson({ gender: "MALE" }).as("newFather");
    cy.createPerson({ gender: "FEMALE" }).as("newMother");

    // test

    cy.get<CreatedPerson>("@son").then(({ person: son }) =>
      cy.visitAndCheck(`/main/person/edit/${son?.id}`)
    );

    cy.get<CreatedPerson>("@father").then(({ person: father }) =>
      cy.get("[data-test-id='father']").should("have.value", father?.id)
    );

    cy.get<CreatedPerson>("@mother").then(({ person: mother }) =>
      cy.get("[data-test-id='mother']").should("have.value", mother?.id)
    );

    cy.get<CreatedPerson>("@sonsWife").then(({ person: sonsWife }) =>
      cy.get("[data-test-id='spouse']").should("have.value", sonsWife?.id)
    );

    cy.get<CreatedPerson>("@newWife").then(({ person: newWife }) => {
      cy.get("[data-test-id='spouse']").select(newWife?.id ?? "");
    });

    cy.get<CreatedPerson>("@newFather").then(({ person: newFather }) => {
      cy.get("[data-test-id='father']").select(newFather?.id ?? "");
    });

    cy.get<CreatedPerson>("@newMother").then(({ person: newMother }) => {
      cy.get("[data-test-id='mother']").select(newMother?.id ?? "");
    });

    cy.get("[data-test-id='update']").click();

    cy.get<CreatedPerson>("@son").then(({ person: son }) =>
      cy.url().should("contain", `main/person/${son?.id}`)
    );

    // TODO: find a way to fix it
    // Probably relates to https://github.com/remix-run/remix/issues/4822

    // cy.get<CreatedPerson>("@newWife").then(({ person: newWife }) =>
    //   cy.get("[data-test-id='spouse']").should("have.text", formatName(newWife))
    // );

    // cy.get<CreatedPerson>("@newFather").then(({ person: newFather }) =>
    //   cy
    //     .get("[data-test-id='father']")
    //     .should("have.text", formatName(newFather))
    // );

    // cy.get<CreatedPerson>("@newMother").then(({ person: newMother }) =>
    //   cy
    //     .get("[data-test-id='mother']")
    //     .should("have.text", formatName(newMother))
    // );

    // cleanup
    cy.get<CreatedPerson>("@father").then(({ person: father }) =>
      cy.get<CreatedPerson>("@mother").then(({ person: mother }) =>
        cy.get<CreatedPerson>("@son").then(({ person: son }) =>
          cy.get<CreatedPerson>("@sonsWife").then(({ person: sonsWIfe }) =>
            cy.get<CreatedPerson>("@newWife").then(({ person: newWife }) =>
              cy.cleanupPersons({
                ids: [
                  father?.id,
                  mother?.id,
                  son?.id,
                  sonsWIfe?.id,
                  newWife?.id,
                ].filter(isString),
              })
            )
          )
        )
      )
    );
  });
});
