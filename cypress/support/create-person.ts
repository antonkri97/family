// Use this to create a person by user email
// Simply call this with:
// npx ts-node --require tsconfig-paths/register ./cypress/support/create-person.ts username@example.com
// and that person will be created

import { faker } from "@faker-js/faker";
import { Gender, Prisma } from "@prisma/client";
import { installGlobals } from "@remix-run/node";

import { prisma } from "~/db.server";

installGlobals();

async function createPerson(email: string) {
  if (!email) {
    throw new Error("email required");
  }

  try {
    const user = await prisma.user.findFirst({ where: { email } });

    if (user?.id) {
      const personForm = {
        firstName: faker.internet.userName(),
        secondName: faker.internet.userName(),
        thirdName: faker.internet.userName(),
        birthday: faker.date.birthdate(),
        gender: Gender.MALE,
      };

      const person = await prisma.person.create({
        data: {
          firstName: personForm.firstName,
          secondName: personForm.secondName,
          thirdName: personForm.thirdName,
          birthday: personForm.birthday.toDateString(),
          gender: personForm.gender,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      console.log(JSON.stringify(person));
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      console.log("User not found");
    } else {
      throw error;
    }
  } finally {
    await prisma.$disconnect();
  }
}

createPerson(process.argv[2]);
