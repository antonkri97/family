import { faker } from "@faker-js/faker";
import { Gender } from "@prisma/client";

describe("person", () => {
  afterEach(() => {
    cy.cleanupPerson();
  });

  it("should allow to create new person", () => {
    cy.login();

    const personForm = {
      firstName: faker.internet.userName(),
      secondName: faker.internet.userName(),
      thirdName: faker.internet.userName(),
      birthday: faker.date.birthdate(),
      gender: Gender.MALE,
    };

    cy.visit("/main/person/new");

    cy.get("[data-test-id='first-name']").type(personForm.firstName, {
      force: true,
    });
    cy.get("[data-test-id='second-name']").type(personForm.secondName, {
      force: true,
    });
    cy.get("[data-test-id='third-name']").type(personForm.thirdName, {
      force: true,
    });
    cy.get("[data-test-id='birthday']").type(
      personForm.birthday.toDateString()
    );
    cy.get("[data-test-id='gender']").select(personForm.gender);

    cy.get("[data-test-id='create']").click();

    cy.url()
      .then((url) => ({ id: url.split("/").at(-1) }))
      .as("person");
  });
});
