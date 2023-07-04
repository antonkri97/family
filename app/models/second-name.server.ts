import type { SecondName, User } from "@prisma/client";
import { prisma } from "~/db.server";

export function createSecondName({
  secondName,
  id,
}: Pick<SecondName, "secondName"> & Pick<User, "id">) {
  return prisma.secondName.create({ data: { secondName, userId: id } });
}

export function getSecondNames() {
  return prisma.secondName.findMany();
}

export function getSecondName({ id, userId }: { id: string; userId: string }) {
  return prisma.secondName.findFirst({ where: { id, userId } });
}
