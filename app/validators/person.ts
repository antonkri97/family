import { Gender } from "@prisma/client";
import { nullable, object, optional, string, z } from "zod";

export const simplePersonSchema = object({
  id: string(),
  firstName: string(),
  secondName: nullable(string()),
  thirdName: nullable(string()),
  birthday: nullable(string()),
  gender: z.enum([Gender.MALE, Gender.FEMALE]),
  spouseId: optional(string()).or(nullable(string())),
  motherId: optional(string()).or(nullable(string())),
  fatherId: optional(string()).or(nullable(string())),
  bio: optional(string()).or(nullable(string())),
});

export function getSchemas(
  config: {
    wife: boolean;
    husband: boolean;
    father: boolean;
    mother: boolean;
  } = { father: false, husband: false, mother: false, wife: false }
) {
  let schema = simplePersonSchema;

  if (config.wife) {
    schema = schema.extend({
      wife: simplePersonSchema,
    });
  }

  if (config.husband) {
    schema = schema.extend({
      husband: simplePersonSchema,
    });
  }

  if (config.father) {
    schema = schema.extend({
      father: simplePersonSchema,
    });
  }

  if (config.father) {
    schema = schema.extend({
      mother: simplePersonSchema,
    });
  }

  return schema;
}

export type SimplePersonValidated = z.infer<typeof simplePersonSchema>;

export const fullPersonSchema = getSchemas({
  father: true,
  husband: true,
  mother: true,
  wife: true,
});

export type FullPersonValidated = z.infer<typeof fullPersonSchema>;

export const updatePersonSchema = simplePersonSchema.omit({ id: true });
export type UpdatePersonValidated = z.infer<typeof updatePersonSchema>;
