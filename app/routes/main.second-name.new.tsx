import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useRef } from "react";
import { createSecondName } from "~/models/second-name.server";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const secondName = formData.get("secondName");

  if (typeof secondName !== "string" || secondName === "") {
    return json(
      {
        errors: {
          secondName: "Введите фамилию",
        },
      },
      { status: 400 }
    );
  }

  const res = await createSecondName({ secondName, id: userId });

  return redirect(`/main/second-name/${res.id}`);
};

export default function NewSecondNamePage() {
  const actionData = useActionData<typeof action>();

  const secondNameRef = useRef<HTMLInputElement>(null);

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
          <span>Фамилия: </span>
          <input
            ref={secondNameRef}
            name="secondName"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.secondName ? true : undefined}
            aria-errormessage={
              actionData?.errors?.secondName ? "title-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.secondName ? (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.secondName}
          </div>
        ) : null}
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
