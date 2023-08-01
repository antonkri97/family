import { Gender } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { nullable, object, optional, string, z } from "zod";
import { getGenders } from "~/models/gender.server";

import { createPeople, getPeopleListItems } from "~/models/people.server";
import { Button, Input, Select, Textarea } from "~/modules/shared";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const genders = getGenders();
  const people = await getPeopleListItems({ id: userId });

  return json({ people, genders });
};

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);

  const People = object({
    firstName: string(),
    secondName: string(),
    thirdName: string(),
    birthday: string(),
    gender: z.enum([Gender.MALE, Gender.FEMALE]),
    spouse: nullable(string()),
    bio: nullable(string()),
  });

  const formData = await request.formData();

  const parsed = People.safeParse({
    firstName: formData.get("firstName"),
    secondName: formData.get("secondName"),
    thirdName: formData.get("thirdName"),
    birthday: formData.get("birthday"),
    gender: formData.get("gender"),
    spouse: formData.get("spouse"),
    bio: formData.get("bio"),
  });

  if (parsed.success) {
    const people = await createPeople({
      firstName: parsed.data.firstName,
      secondName: parsed.data.secondName,
      thirdName: parsed.data.thirdName,
      birthday: parsed.data.birthday,
      gender: parsed.data.gender,
      spouseId: parsed.data.spouse,
      bio: parsed.data.bio ?? "",
      userId,
    });

    return redirect(`/main/people/${people.id}`);
  }

  return json(
    {
      errors: {
        firstName: "",
        secondName: "",
        thirdName: "",
        birthday: "",
      },
    },
    { status: 400 }
  );
};

export default function NewPeoplePage() {
  const { genders, people } = useLoaderData<typeof loader>();

  const actionData = useActionData<typeof action>();
  const firstNameRef = useRef<HTMLInputElement>(null);
  const secondNameRef = useRef<HTMLInputElement>(null);
  const thirdNameRef = useRef<HTMLInputElement>(null);
  const birthDayRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const spousesRef = useRef<HTMLSelectElement>(null);

  const [selectedGender, setSelectedGender] = useState(genders[0].value);

  const [spouses, setSpouses] = useState(
    people.filter(({ gender }) => selectedGender !== gender)
  );

  const onGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpouses(people.filter(({ gender }) => gender !== e.target.value));
    setSelectedGender(e.target.value as Gender);
  };

  useEffect(() => {
    if (actionData?.errors?.firstName) {
      firstNameRef.current?.focus();
    } else if (actionData?.errors?.secondName) {
      secondNameRef.current?.focus();
    } else if (actionData?.errors?.thirdName) {
      thirdNameRef.current?.focus();
    } else if (actionData?.errors?.birthday) {
      birthDayRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <Input
        label="Имя: "
        name="firstName"
        refProp={firstNameRef}
        invalid={actionData?.errors?.firstName ? true : undefined}
        ariaErrorMessage={
          actionData?.errors?.firstName ? "title-error" : undefined
        }
        errorMessage={actionData?.errors?.firstName}
      />

      <Input
        label="Фамилия: "
        name="secondName"
        refProp={secondNameRef}
        invalid={actionData?.errors?.secondName ? true : undefined}
        ariaErrorMessage={
          actionData?.errors?.secondName ? "title-error" : undefined
        }
        errorMessage={actionData?.errors?.secondName}
      />

      <Input
        label="Отчество: "
        name="thirdName"
        refProp={thirdNameRef}
        invalid={actionData?.errors?.thirdName ? true : undefined}
        ariaErrorMessage={
          actionData?.errors?.thirdName ? "title-error" : undefined
        }
        errorMessage={actionData?.errors?.thirdName}
      />

      <Input
        label="Год рождения: "
        name="birthday"
        refProp={thirdNameRef}
        invalid={actionData?.errors?.birthday ? true : undefined}
        ariaErrorMessage={
          actionData?.errors?.birthday ? "title-error" : undefined
        }
        errorMessage={actionData?.errors?.birthday}
      />

      <Select
        label="Пол: "
        selectRef={genderRef}
        onChange={(e) => onGenderChange(e)}
        name="gender"
      >
        {genders.map((gender) => (
          <option key={gender.value} value={gender.value}>
            {gender.label}
          </option>
        ))}
      </Select>

      <Select label="Супруг(а): " selectRef={spousesRef} name="spouse">
        {spouses.map((spouse) => (
          <option key={spouse.id} value={spouse.id}>
            {`${spouse.secondName} ${spouse.firstName} ${spouse.thirdName}`}
          </option>
        ))}
      </Select>

      <Textarea label="Биография: " name="bio" />

      <div className="text-right">
        <Button>Добавить</Button>
      </div>
    </Form>
  );
}
