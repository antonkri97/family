import type { User, People } from "@prisma/client";

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
      secondName: true,
    },
  });
}

export function getPeopleListItems({ userId }: { userId: User["id"] }) {
  return prisma.people.findMany({
    where: { userId },
  });
}

export function createPeople({
  firstName,
  secondNameId,
  thirdName,
  birthday,
  genderId,
  bio,
  userId,
}: Pick<
  People,
  "firstName" | "secondNameId" | "thirdName" | "birthday" | "genderId" | "bio"
> & {
  userId: User["id"];
}) {
  return prisma.people.create({
    data: {
      firstName,
      secondName: {
        connect: {
          id: secondNameId,
        },
      },
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

export function deleteNote({
  id,
  userId,
}: Pick<People, "id"> & { userId: User["id"] }) {
  return prisma.people.deleteMany({
    where: { id, userId },
  });
}
