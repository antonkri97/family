import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { getGenders } from "~/models/gender.server";

import { createPeople, getPeopleListItems } from "~/models/people.server";
import { getSecondNames } from "~/models/second-name.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const genders = await getGenders();

  const people = await getPeopleListItems({ userId });

  const secondNames = await getSecondNames();

  return json({ people, genders, secondNames });
};

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const firstName = formData.get("firstName");
  const secondNameId = formData.get("secondName");
  const thirdName = formData.get("thirdName");
  const birthday = formData.get("birthday");
  const genderId = formData.get("gender");
  const bio = formData.get("bio");

  if (typeof firstName !== "string" || firstName.length === 0) {
    return json(
      {
        errors: {
          firstName: "Заполните имя",
          secondName: null,
          thirdName: null,
          birthday: null,
          gender: null,
        },
      },
      { status: 400 }
    );
  }

  if (typeof secondNameId !== "string" || secondNameId === null) {
    return json(
      {
        errors: {
          firstName: null,
          secondName: "Заполните фамилию",
          thirdName: null,
          birthday: null,
          gender: null,
        },
      },
      { status: 400 }
    );
  }

  if (typeof thirdName !== "string" || thirdName.length === 0) {
    return json(
      {
        errors: {
          firstName: null,
          secondName: null,
          thirdName: "Заполните отчество",
          birthday: null,
          gender: null,
        },
      },
      { status: 400 }
    );
  }

  if (typeof birthday !== "string" || birthday.length === 0) {
    return json(
      {
        errors: {
          firstName: null,
          secondName: null,
          thirdName: null,
          birthday: "Введите дату рождения",
          gender: null,
        },
      },
      { status: 400 }
    );
  }

  if (typeof genderId !== "string" || genderId.length === 0) {
    return json(
      {
        errors: {
          firstName: null,
          secondName: null,
          thirdName: null,
          birthday: null,
          gender: "Выберите пол",
        },
      },
      { status: 400 }
    );
  }

  const people = await createPeople({
    firstName,
    secondNameId,
    thirdName,
    birthday,
    genderId,
    bio: bio?.length === 0 || typeof bio !== "string" ? "" : bio,
    userId,
  });

  return redirect(`/main/people/${people.id}`);
};

export default function NewPeoplePage() {
  const { genders, secondNames } = useLoaderData<typeof loader>();

  const actionData = useActionData<typeof action>();
  const firstNameRef = useRef<HTMLInputElement>(null);
  const secondNameRef = useRef<HTMLSelectElement>(null);
  const thirdNameRef = useRef<HTMLInputElement>(null);
  const birthDayRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (actionData?.errors?.firstName) {
      firstNameRef.current?.focus();
    } else if (actionData?.errors?.secondName) {
      secondNameRef.current?.focus();
    } else if (actionData?.errors?.thirdName) {
      thirdNameRef.current?.focus();
    } else if (actionData?.errors?.birthday) {
      birthDayRef.current?.focus();
    } else if (actionData?.errors?.gender) {
      genderRef.current?.focus();
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
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Имя: </span>
          <input
            ref={firstNameRef}
            name="firstName"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.firstName ? true : undefined}
            aria-errormessage={
              actionData?.errors?.firstName ? "title-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.firstName ? (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.firstName}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Фамилия: </span>

          <select
            ref={secondNameRef}
            name="secondName"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.secondName ? true : undefined}
            aria-errormessage={
              actionData?.errors?.secondName ? "title-error" : undefined
            }
          >
            {secondNames.map((secondName) => (
              <option key={secondName.id} value={secondName.id}>
                {`${secondName.secondName}(а)`}
              </option>
            ))}
          </select>
        </label>
        {actionData?.errors?.secondName ? (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.secondName}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Отчество: </span>
          <input
            ref={thirdNameRef}
            name="thirdName"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.thirdName ? true : undefined}
            aria-errormessage={
              actionData?.errors?.thirdName ? "title-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.thirdName ? (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.thirdName}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Год рождения: </span>
          <input
            ref={birthDayRef}
            name="birthday"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.birthday ? true : undefined}
            aria-errormessage={
              actionData?.errors?.birthday ? "title-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.birthday ? (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.birthday}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Пол: </span>

          <select
            ref={genderRef}
            name="gender"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.gender ? true : undefined}
            aria-errormessage={
              actionData?.errors?.gender ? "title-error" : undefined
            }
          >
            {genders.map((gender) => (
              <option key={gender.id} value={gender.id}>
                {gender.name}
              </option>
            ))}
          </select>
        </label>
        {actionData?.errors?.gender ? (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.gender}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Биография: </span>
          <textarea
            name="bio"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
          />
        </label>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Добавить
        </button>
      </div>
    </Form>
  );
}
