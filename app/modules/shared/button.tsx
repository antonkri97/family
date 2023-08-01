import type { PropsWithChildren } from "react";

export const Button = ({
  type = "submit",
  children,
}: PropsWithChildren<{ type?: "submit" | "button" }>) => (
  <button
    type={type}
    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
  >
    {children}
  </button>
);
