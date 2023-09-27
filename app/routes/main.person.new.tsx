import { Gender } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { nullable, object, string, z } from "zod";

import { createPerson } from "~/models/person.server";
import { Button, Input, Select, Textarea } from "~/modules/shared";
import { useSpouses } from "~/modules/shared/hooks";
import { entitiesLoader } from "~/modules/shared/loaders";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { fathers, genders, mothers, persons } = await entitiesLoader(request);
  return json({ fathers, genders, mothers, persons });
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  const Person = object({
    firstName: string(),
    secondName: nullable(string()),
    thirdName: nullable(string()),
    birthday: nullable(string()),
    gender: z.enum([Gender.MALE, Gender.FEMALE]),
    spouse: nullable(string()),
    mother: nullable(string()),
    father: nullable(string()),
    bio: nullable(string()),
  });

  const formData = await request.formData();

  const parsed = Person.safeParse({
    firstName: formData.get("firstName"),
    secondName: formData.get("secondName"),
    thirdName: formData.get("thirdName"),
    birthday: formData.get("birthday"),
    gender: formData.get("gender"),
    spouse: formData.get("spouse"),
    mother: formData.get("mother"),
    father: formData.get("father"),
    bio: formData.get("bio"),
  });

  if (parsed.success) {
    const person = await createPerson({
      firstName: parsed.data.firstName,
      secondName: parsed.data.secondName,
      thirdName: parsed.data.thirdName,
      birthday: parsed.data.birthday,
      gender: parsed.data.gender,
      spouseId: parsed.data.spouse,
      motherId: parsed.data.mother,
      fatherId: parsed.data.father,
      bio: parsed.data.bio ?? "",
      userId,
    });

    return redirect(`/main/person/${person.id}`);
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

export default function NewPersonPage() {
  const { genders, persons, fathers, mothers } = useLoaderData<typeof loader>();

  const actionData = useActionData<typeof action>();
  const firstNameRef = useRef<HTMLInputElement>(null);
  const secondNameRef = useRef<HTMLInputElement>(null);
  const thirdNameRef = useRef<HTMLInputElement>(null);
  const birthDayRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);

  const [spouses, onGenderChange] = useSpouses(genders[0].value, persons);

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
        dataTestId="first-name"
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
        dataTestId="second-name"
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
        dataTestId="third-name"
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
        dataTestId="birthday"
        refProp={thirdNameRef}
        invalid={actionData?.errors?.birthday ? true : undefined}
        ariaErrorMessage={
          actionData?.errors?.birthday ? "title-error" : undefined
        }
        errorMessage={actionData?.errors?.birthday}
      />

      <Select
        label="Пол: "
        dataTestId="gender"
        selectRef={genderRef}
        onChange={(e) => onGenderChange(e.target.value as Gender)}
        name="gender"
        addEmpty={false}
      >
        {genders.map((gender) => (
          <option key={gender.value} value={gender.value}>
            {gender.label}
          </option>
        ))}
      </Select>

      <Select label="Супруг(а): " name="spouse" dataTestId="spouse">
        {spouses.map((spouse) => (
          <option key={spouse.id} value={spouse.id}>
            {`${spouse.secondName} ${spouse.firstName} ${spouse.thirdName}`}
          </option>
        ))}
      </Select>

      <Select label="Мать" name="mother" dataTestId="mother">
        {mothers.map((mother) => (
          <option key={mother.id} value={mother.id}>
            {`${mother.secondName} ${mother.firstName} ${mother.thirdName}`}
          </option>
        ))}
      </Select>

      <Select label="Отец" name="father" dataTestId="father">
        {fathers.map((father) => (
          <option key={father.id} value={father.id}>
            {`${father.secondName} ${father.firstName} ${father.thirdName}`}
          </option>
        ))}
      </Select>

      <Textarea label="Биография: " name="bio" dataTestId="bio" />

      <div className="text-right">
        <Button dataTestId="create">Добавить</Button>
      </div>
    </Form>
  );
}
