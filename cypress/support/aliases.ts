import type { prisma } from "~/db.server";

export interface User {
  email?: string;
}

export interface CreatedPerson {
  person?: Awaited<ReturnType<(typeof prisma)["person"]["create"]>>;
}

export interface PersonId {
  id?: string;
}
