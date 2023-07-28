import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { getPeopleListItems } from "~/models/people.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const people = await getPeopleListItems({ id: userId });
  return json({ people });
};

export default function PeoplePage() {
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
          <Link to="people/list" className="block p-4 text-xl text-blue-500">
            Люди
          </Link>
          <Link to="people/new" className="block p-4 text-xl text-blue-500">
            Добавить человека
          </Link>
          <Link to="trees" className="block p-4 text-xl text-blue-500">
            Деревья
          </Link>

          <hr />

          {data.people.length === 0 ? (
            <p className="p-4">Пока никого нет</p>
          ) : (
            <ol>
              {data.people.map((people) => (
                <li key={people.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={`people/${people.id}`}
                  >
                    😀 {people.firstName}
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
