// Use this to delete a user by their email
// Simply call this with:
// npx ts-node --require tsconfig-paths/register ./cypress/support/delete-user.ts username@example.com
// and that user will get deleted

import { Prisma } from "@prisma/client";
import { installGlobals } from "@remix-run/node";

import { prisma } from "~/db.server";

installGlobals();

async function deletePerson(id: string) {
  if (!id) {
    throw new Error("id required");
  }

  try {
    await prisma.person.delete({ where: { id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      console.log("Person not found, so no need to delete");
    } else {
      throw error;
    }
  } finally {
    await prisma.$disconnect();
  }
}

deletePerson(process.argv[2]);
