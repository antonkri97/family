import { Gender } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { getGenders } from "~/models/gender.server";
import { getPersonListItems } from "~/models/person.server";
import { requireUserId } from "~/session.server";
import { simplePersonSchema } from "~/validators/person";

export async function entitiesLoader(request: LoaderFunctionArgs["request"]) {
  const userId = await requireUserId(request);

  const genders = getGenders();
  const persons = await getPersonListItems({ id: userId });
  const mothers = persons.filter(({ gender }) => gender === Gender.FEMALE);
  const fathers = persons.filter(({ gender }) => gender === Gender.MALE);

  return {
    genders,
    persons: persons.map((person) => simplePersonSchema.parse(person)),
    mothers,
    fathers,
  };
}
