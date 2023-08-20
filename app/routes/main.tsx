import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { getPersonListItems } from "~/models/person.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const person = await getPersonListItems({ id: userId });
  return json({ person });
};

export default function PersonPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Семья</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Выйти
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="person/list" className="block p-4 text-xl text-blue-500">
            Люди
          </Link>
          <Link to="person/new" className="block p-4 text-xl text-blue-500">
            Добавить человека
          </Link>
          <Link to="trees" className="block p-4 text-xl text-blue-500">
            Деревья
          </Link>

          <hr />

          {data.person.length === 0 ? (
            <p className="p-4">Пока никого нет</p>
          ) : (
            <ol>
              {data.person.map((person) => (
                <li key={person.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={`person/${person.id}`}
                  >
                    😀 {person.firstName}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
