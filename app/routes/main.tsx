import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import NavLinks from "~/components/NavLinks";

import { getPersonListItems } from "~/models/person.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const person = await getPersonListItems({ id: userId });
  return json({ person });
};

export default function PersonPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="z-10 h-full overflow-y-auto bg-white">
        <NavLinks />
      </div>
      <div className="relative flex-1 overflow-y-auto p-4">
        <Outlet />
      </div>
    </div>
  );
}
