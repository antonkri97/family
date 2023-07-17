import type { PropsWithChildren } from "react";

export const Select = ({
  selectRef,
  onChange,
  name,
  label,
  invalid,
  ariaErrorMessage,
  errorMessage,
  children,
}: PropsWithChildren<{
  selectRef: React.RefObject<HTMLSelectElement>;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  invalid: true | undefined;
  ariaErrorMessage: string | undefined;
  errorMessage: string | undefined | null;
  label: string;
}>) => (
  <div>
    <div>
      <label className="flex w-full flex-col gap-1">
        <span>{label}</span>

        <select
          ref={selectRef}
          onChange={onChange}
          name={name}
          className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          aria-invalid={invalid}
          aria-errormessage={ariaErrorMessage}
        >
          {children}
        </select>
      </label>
      {errorMessage ? (
        <div className="pt-1 text-red-700" id="title-error">
          {errorMessage}
        </div>
      ) : null}
    </div>
  </div>
);
