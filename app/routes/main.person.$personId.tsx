import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { deletePerson, getPerson } from "~/models/person.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  invariant(params.personId, "personId not found");

  const person = await getPerson({ id: params.personId, userId });
  if (!person) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ person });
};

export const action = async ({ params, request }: ActionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.personId, "personId not found");

  await deletePerson({ id: params.personId, userId });

  return redirect("/person");
};

export default function PersonDetailsPage() {
  const { person } = useLoaderData<typeof loader>();

  console.log(person);

  function makeItemFactory<P extends typeof person>(person: P) {
    return function <K extends keyof P>(label: string, key: K) {
      return {
        label,
        value: person[key],
      };
    };
  }

  const makeItem = makeItemFactory(person);

  const info = [
    makeItem("День рождения", "birthday"),
    {
      label: "Пол",
      value: person.gender,
    },
    makeItem("Отец", "fatherId"),
    makeItem("Мать", "motherId"),
    makeItem("Биография", "bio"),
  ];

  return (
    <div>
      <h3 className="text-2xl font-bold">{`${person.secondName} ${person.firstName} ${person.thirdName}`}</h3>

      <hr className="my-4" />

      <ul className="flex flex-col gap-2">
        {info.map((row) => (
          <li
            key={row.label}
            className="rounded-md border-2 border-blue-500 pl-1"
          >
            <span className="font-bold">{row.label}</span>: {row.value}
          </li>
        ))}
      </ul>

      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Удалить
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Note not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
