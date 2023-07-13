import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useRef } from "react";
import { createTree } from "~/models/tree.server";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const name = formData.get("name");

  if (typeof name !== "string" || name === "") {
    return json(
      {
        errors: {
          secondName: "Введите название дерева",
          feminine: null,
        },
      },
      { status: 400 }
    );
  }

  const id = await createTree({ name, userId });

  return redirect(`/main/tree/${id}`);
};

export default function NewTreePage() {
  const nameRef = useRef<HTMLInputElement>(null);

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
          <span>Название дерева:</span>
          <input
            ref={nameRef}
            name="name"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
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
