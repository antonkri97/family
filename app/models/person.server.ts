import { type Person, type User } from "@prisma/client";

import { prisma } from "~/db.server";
import type { PersonFormValues } from "~/validators/create-person";
import { simplePersonSchema } from "~/validators/person";
import type { SimplePersonValidated } from "~/validators/person";

export async function getPerson({
  id,
  userId,
}: Pick<Person, "id"> & {
  userId: User["id"];
}): Promise<SimplePersonValidated> {
  const person = await prisma.person.findFirst({
    where: { id, userId },
  });
  return simplePersonSchema.parse(person);
}

export async function getPersonList({ id }: Pick<User, "id">) {
  const persons = await prisma.person.findMany({
    where: { userId: id },
    include: { spouse: true, spouses: true },
  });

  const validated: SimplePersonValidated[] = [];

  for (const person of persons) {
    const parse = simplePersonSchema.safeParse(person);

    if (parse.success) {
      validated.push(parse.data);
    } else {
      console.error(`can't validate this person`, person, parse.error);
    }
  }

  return validated;
}

export type GetPersonsListItems = Awaited<ReturnType<typeof getPersonList>>;

export async function createPerson(value: PersonFormValues, userId: string) {
  const { relations } = value;
  const person = await prisma.person.create({
    data: {
      firstName: value.firstName,
      secondName: value.secondName,
      thirdName: value.thirdName,
      avatar: value.avatar,
      gender: value.gender,
      user: { connect: { id: userId } },
      birthday: value.birthday,
      ...(relations.spouse && {
        spouse: { connect: { id: relations.spouse } },
      }),
      ...(relations.mother && {
        mother: { connect: { id: relations.mother } },
      }),
      ...(relations.father && {
        father: { connect: { id: relations.father } },
      }),
    },
  });

  if (value.relations.spouse) {
    await prisma.person.update({
      where: { id: value.relations.spouse },
      data: { spouse: { connect: { id: person.id } } },
    });
  }

  if (value.relations.mother) {
    await prisma.person.update({
      where: { id: value.relations.mother },
      data: { mother: { connect: { id: person.id } } },
    });
  }

  if (value.relations.father) {
    await prisma.person.update({
      where: { id: value.relations.father },
      data: { father: { connect: { id: person.id } } },
    });
  }

  return person;
}

export async function updatePerson(
  id: string,
  person: PersonFormValues
): Promise<SimplePersonValidated> {
  const { father, mother, spouse } = person.relations;
  const updatedPerson = await prisma.person.update({
    data: {
      firstName: person.firstName,
      secondName: person.secondName,
      thirdName: person.thirdName,
      gender: person.gender,
      ...(person.avatar && { avatar: person.avatar }),
      ...(father && { father: { connect: { id: father } } }),
      ...(mother && { mother: { connect: { id: mother } } }),
      ...(spouse && { spouse: { connect: { id: spouse } } }),
    },
    where: {
      id,
    },
  });

  if (spouse && updatedPerson) {
    prisma.person.update({
      where: { id: spouse },
      data: { spouse: { connect: { id: updatedPerson.id } } },
    });
  }

  return simplePersonSchema.parse(updatedPerson);
}

export function deletePerson({
  id,
  userId,
}: Pick<Person, "id"> & { userId: User["id"] }) {
  return prisma.person.deleteMany({
    where: { id, userId },
  });
}
