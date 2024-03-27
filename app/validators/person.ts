import { Gender } from "@prisma/client";
import { z } from "zod";

export const simplePersonSchema = z.object({
  id: z.string(),

  firstName: z.string(),
  secondName: z.string().nullable(),
  thirdName: z.string().nullable(),

  birthday: z.string().nullable(),

  gender: z.enum([Gender.MALE, Gender.FEMALE]),

  bio: z.string().nullable(),
  avatar: z.string().nullable(),

  fatherId: z.string().nullable(),

  motherId: z.string().nullable(),

  spouseId: z.string().nullable(),

  userId: z.string(),
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
