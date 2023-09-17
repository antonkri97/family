import type { PropsWithChildren } from "react";

export const Button = ({
  type = "submit",
  children,
  dataTestId,
}: PropsWithChildren<{
  type?: "submit" | "button";
  dataTestId?: string | null;
}>) => (
  <button
    data-test-id={dataTestId}
    type={type}
    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
  >
    {children}
  </button>
);
