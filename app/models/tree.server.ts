import { getPersonListItems } from "./person.server";
import { simplePersonSchema } from "~/validators/person";
import { buildTrees } from "./trees";

export async function getTrees(userId: string) {
  const personsRaw = await getPersonListItems({ id: userId });
  const validated = personsRaw.map((person) =>
    simplePersonSchema.parse(person)
  );

  const entities = Object.fromEntries(
    validated.map((person) => [person.id, person])
  );

  return buildTrees(validated, entities);
}
