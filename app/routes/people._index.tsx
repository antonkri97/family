import { Link } from "@remix-run/react";

export default function PeopleIndexPage() {
  return (
    <p>
      Выберите члена семьи для просмотра или{" "}
      <Link to="new" className="text-blue-500 underline">
        добавьте еще
      </Link>
    </p>
  );
}
