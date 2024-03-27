import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { FaPen, FaTrash } from "react-icons/fa";
import { deletePerson, getPersonList } from "~/models/person.server";
import { Table } from "~/modules/shared";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const peopleList = await getPersonList({ id: userId });

  if (!peopleList) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ peopleList, foo: "bar" });
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  const formData = await request.formData();
  const personId = formData.get("id") as string;

  const userId = await requireUserId(request);

  await deletePerson({ id: personId, userId });

  return null;
};

export default function PersonListPage() {
  const { peopleList } = useLoaderData<typeof loader>();

  return (
    <Table
      colDef={[
        { field: "firstName", header: "Имя" },
        { field: "secondName", header: "Фамилия" },
        { field: "thirdName", header: "Отчество" },
        { field: "birthday", header: "Дата рождения" },
      ]}
      data={peopleList}
      actionColumn={[
        {
          icon: (row) => (
            <Link to={`/main/person/edit/${row.id}`}>
              <FaPen size={20} />
            </Link>
          ),
        },
        {
          icon: (row) => (
            <Form method="post">
              <button
                type="submit"
                className="font-inherit cursor-pointer border-none bg-none p-0 text-inherit outline-inherit"
              >
                <input type="hidden" name="id" value={row.id} />
                <FaTrash size={20} />
              </button>
            </Form>
          ),
        },
      ]}
    />
  );
}
