import type { People, User } from "@prisma/client";

import { prisma } from "~/db.server";

export function getPeople({
  id,
  userId,
}: Pick<People, "id"> & {
  userId: User["id"];
}) {
  return prisma.people.findFirst({
    where: { id, userId },
    include: {
      gender: true,
    },
  });
}

export async function getPossibleSpouses(userId: string, genderId: string) {
  const gender = await prisma.gender.findFirst({
    where: { NOT: { id: { equals: genderId } } },
  });

  return prisma.people.findMany({
    where: { userId, genderId: gender?.id },
  });
}

export function getPeopleListItems({ id }: Pick<User, "id">) {
  return prisma.people.findMany({
    where: { userId: id },
  });
}

export function createPeople({
  firstName,
  secondName,
  thirdName,
  birthday,
  genderId,
  bio,
  userId,
}: Pick<
  People,
  "firstName" | "secondName" | "thirdName" | "birthday" | "genderId" | "bio"
> & {
  userId: User["id"];
}) {
  return prisma.people.create({
    data: {
      firstName,
      secondName,
      thirdName,
      birthday,
      bio,
      user: {
        connect: {
          id: userId,
        },
      },
      gender: {
        connect: {
          id: genderId,
        },
      },
    },
  });
}

export function deletePeople({
  id,
  userId,
}: Pick<People, "id"> & { userId: User["id"] }) {
  return prisma.people.deleteMany({
    where: { id, userId },
  });
}
