import { getPersonListItems } from "./person.server";
import type { PersonId } from "~/validators/person";
import { personSchema } from "~/validators/person";
import { buildTrees } from "./trees";

export async function getTrees(userId: string) {
  const personsRaw = await getPersonListItems({ id: userId });
  const validated = personsRaw.map((person) => ({
    ...personSchema.parse(person),
    id: person.id as PersonId,
  }));

  const entities = Object.fromEntries(
    validated.map((person) => [person.id, person])
  );

  const trees = buildTrees(validated, entities);

  return trees;
}
