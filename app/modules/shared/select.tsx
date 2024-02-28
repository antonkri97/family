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
  addEmpty = true,
  dataTestId,
  defaultValue,
  disabled,
}: PropsWithChildren<{
  selectRef?: React.RefObject<HTMLSelectElement>;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  invalid?: true | undefined;
  ariaErrorMessage?: string | undefined;
  errorMessage?: string | undefined | null;
  label: string;
  addEmpty?: boolean;
  dataTestId?: string | null;
  defaultValue?: string | null;
  disabled?: boolean;
}>) => (
  <div className="mb-4">
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-600">
        {label}
      </label>

      <select
        disabled={disabled}
        ref={selectRef}
        onChange={onChange}
        defaultValue={defaultValue}
        name={name}
        data-test-id={dataTestId}
        className="w-full rounded-md border p-2 focus:border-indigo-500 focus:outline-none"
        aria-invalid={invalid}
        aria-errormessage={ariaErrorMessage}
      >
        {addEmpty ? <option value={""}>—</option> : null}
        {children}
      </select>
      {errorMessage ? (
        <div className="pt-1 text-red-700" id="title-error">
          {errorMessage}
        </div>
      ) : null}
    </div>
  </div>
);
