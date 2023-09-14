import { Gender } from "@prisma/client";
import { nullable, object, string, z } from "zod";

export const personSchema = object({
  id: string(),
  firstName: string(),
  secondName: nullable(string()),
  thirdName: nullable(string()),
  birthday: nullable(string()),
  gender: z.enum([Gender.MALE, Gender.FEMALE]),
  spouseId: nullable(string()),
  motherId: nullable(string()),
  fatherId: nullable(string()),
  bio: nullable(string()),
});

export function getSchemas(
  config: {
    wife: boolean;
    husband: boolean;
    father: boolean;
    mother: boolean;
  } = { father: false, husband: false, mother: false, wife: false }
) {
  let schema = personSchema;

  if (config.wife) {
    schema = schema.extend({
      wife: personSchema,
    });
  }

  if (config.husband) {
    schema = schema.extend({
      husband: personSchema,
    });
  }

  if (config.father) {
    schema = schema.extend({
      father: personSchema,
    });
  }

  if (config.father) {
    schema = schema.extend({
      mother: personSchema,
    });
  }

  return schema;
}

export type PersonId = string & { __brand: "PersonId" };

export type SimplePersonValidated = Omit<z.infer<typeof personSchema>, "id"> & {
  id: PersonId;
};

const fullSchema = getSchemas({
  father: true,
  husband: true,
  mother: true,
  wife: true,
});

export type FullPersonValidated = Omit<z.infer<typeof fullSchema>, "id"> & {
  id: PersonId;
};
