import { Gender } from "@prisma/client";

export function getGenders() {
  return [
    {
      value: Gender.MALE,
      label: "Мужской",
    },
    {
      value: Gender.FEMALE,
      label: "Женский",
    },
  ];
}
