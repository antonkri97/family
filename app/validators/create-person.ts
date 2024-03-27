import { Gender } from "@prisma/client";
import type { NodeOnDiskFile } from "@remix-run/node";
import { z, ZodError } from "zod";

const relationSchema = z.object({
  spouse: z.string().nullable(),
  mother: z.string().nullable(),
  father: z.string().nullable(),
});

const personSchema = z.object({
  avatar: z.optional(z.string()), // Adjust based on your AvatarUpload logic
  firstName: z.string().min(2),
  secondName: z.string().min(2),
  thirdName: z.string().min(2),
  birthday: z.string(),
  gender: z.enum([Gender.MALE, Gender.FEMALE]),
  relations: relationSchema,
});

export type PersonFormValues = z.infer<typeof personSchema>;

export const validatePersonForm = (data: unknown): PersonFormValues => {
  try {
    return personSchema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      // Handle validation errors, e.g., log them or show to the user
      console.error(error.errors);
      throw error;
    } else {
      // Handle other types of errors
      console.error(error);
      throw error;
    }
  }
};

export const unwrapFormData = (formData: FormData) => {
  return {
    firstName: formData.get("firstName"),
    secondName: formData.get("secondName"),
    thirdName: formData.get("thirdName"),
    birthday: formData.get("birthday"),
    gender: formData.get("gender"),
    avatar: (formData.get("avatar") as unknown as NodeOnDiskFile).name,
    relations: {
      spouse: formData.get("spouse"),
      father: formData.get("father"),
      mother: formData.get("mother"),
    },
  };
};
