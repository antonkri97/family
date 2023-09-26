import { faker } from "@faker-js/faker";
import type { Person } from "@prisma/client";

describe("update person", () => {
  beforeEach(() => {
    cy.login().then((user) => {
      const email = (user as { email?: string }).email;
      cy.createPerson(email);
    });
    cy.get("@person").then((data: any) => {
      const person = data.person as Person;
      cy.visitAndCheck(`/main/person/edit/${person.id}`);
    });
  });

  it("should update person", () => {
    const personForm = {
      firstName: faker.internet.userName(),
      secondName: faker.internet.userName(),
      thirdName: faker.internet.userName(),
      birthday: faker.date.birthdate(),
    };

    cy.get("@person").then((data: any) => {
      const person = data.person as Person;

      cy.get("[data-test-id='first-name']").should(
        "have.value",
        person.firstName
      );
      cy.get("[data-test-id='second-name']").should(
        "have.value",
        person.secondName
      );
      cy.get("[data-test-id='third-name']").should(
        "have.value",
        person.thirdName
      );
      cy.get("[data-test-id='birthday']").should("have.value", person.birthday);

      cy.get("[data-test-id='mother']").should(
        "have.value",
        person.motherId ?? ""
      );

      cy.get("[data-test-id='father']").should(
        "have.value",
        person.fatherId ?? ""
      );

      cy.get("[data-test-id='spouse']").should(
        "have.value",
        person.spouseId ?? ""
      );

      cy.get("[data-test-id='bio']").should("have.value", person.bio ?? "");
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

    // cy.get("@personId").then((data) => {
    //   const id = (data as { id?: string }).id;
    //   cy.url().should("contain", `main/person/${id}`);
    // });
  });
});
