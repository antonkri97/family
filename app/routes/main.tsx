import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import NavLinks from "~/components/NavLinks";

import { getPersonList } from "~/models/person.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const person = await getPersonList({ id: userId });
  return json({ person });
};

export default function PersonPage() {
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
