import type { Gender } from "@prisma/client";
import { useState } from "react";
import type { SimplePersonValidated } from "~/validators/person";

export function useSpouses(
  gender: Gender,
  persons: SimplePersonValidated[]
): [SimplePersonValidated[], (gender: Gender) => void] {
  const [selectedGender, setSelectedGender] = useState(gender);

  const [spouses, setSpouses] = useState(
    persons.filter(({ gender }) => selectedGender !== gender)
  );

  const onGenderChange = (value: Gender) => {
    setSpouses(persons.filter(({ gender }) => gender !== value));
    setSelectedGender(value);
  };

  return [spouses, onGenderChange];
}
