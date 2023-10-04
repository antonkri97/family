import type { Gender } from "@prisma/client";
import { json, redirect } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getPerson, updatePerson } from "~/models/person.server";
import { Select, Textarea, Button, Input } from "~/modules/shared";
import { useSpouses } from "~/modules/shared/hooks";
import { entitiesLoader } from "~/modules/shared/loaders";
import { getUserId } from "~/session.server";
import { isMale } from "~/utils";
import { updatePersonSchema } from "~/validators/person";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);

  invariant(params.personId, "Missing personId param");
  invariant(userId, "Missing userId");

  const person = await getPerson({ id: params.personId, userId });
  if (!person) {
    throw new Response("Not found", { status: 404 });
  }

  const { genders, persons, mothers, fathers } = await entitiesLoader(request);

  return json({ person, genders, persons, mothers, fathers });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.personId, "Missing personId param");

  const formData = await request.formData();
  const updates = updatePersonSchema.safeParse(Object.fromEntries(formData));

  if (!updates.success) {
    return json({ message: updates.error.message }, { status: 400 });
  }

  updatePerson(params.personId, updates.data);

  return redirect(`/main/person/${params.personId}`);
};

export default function EditPerson() {
  const { person, persons, genders, fathers, mothers } =
    useLoaderData<typeof loader>();

  const [spouses, onGenderChange] = useSpouses(person.gender, persons);

  const spouseId = person[isMale(person) ? "wife" : "husband"]?.id;
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
        defaultValue={person.firstName}
      />

      <Input
        label="Фамилия: "
        name="secondName"
        dataTestId="second-name"
        defaultValue={person.secondName}
      />

      <Input
        label="Отчество: "
        name="thirdName"
        dataTestId="third-name"
        defaultValue={person.thirdName}
      />

      <Input
        label="Год рождения: "
        name="birthday"
        dataTestId="birthday"
        defaultValue={person.birthday}
      />

      <Select
        label="Пол: "
        dataTestId="gender"
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

      <Select
        label="Супруг(а): "
        name="spouseId"
        dataTestId="spouse"
        defaultValue={spouseId}
      >
        {spouses.map((spouse) => (
          <option key={spouse.id} value={spouse.id}>
            {`${spouse.secondName} ${spouse.firstName} ${spouse.thirdName}`}
          </option>
        ))}
      </Select>

      <Select
        label="Мать"
        name="motherId"
        dataTestId="mother"
        defaultValue={person.motherId?.toString()}
      >
        {mothers.map((mother) => (
          <option key={mother.id} value={mother.id}>
            {`${mother.secondName} ${mother.firstName} ${mother.thirdName}`}
          </option>
        ))}
      </Select>

      <Select
        label="Отец"
        name="fatherId"
        dataTestId="father"
        defaultValue={person.fatherId?.toString()}
      >
        {fathers.map((father) => (
          <option key={father.id} value={father.id}>
            {`${father.secondName} ${father.firstName} ${father.thirdName}`}
          </option>
        ))}
      </Select>

      <Textarea
        label="Биография: "
        name="bio"
        dataTestId="bio"
        defaultValue={person.bio ?? ""}
      />

      <div className="text-right">
        <Button dataTestId="update">Добавить</Button>
      </div>
    </Form>
  );
}
