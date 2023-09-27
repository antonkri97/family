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
  defaultValue?: string;
}>) => (
  <div>
    <div>
      <label className="flex w-full flex-col gap-1">
        <span>{label}</span>

        <select
          ref={selectRef}
          onChange={onChange}
          defaultValue={defaultValue}
          name={name}
          data-test-id={dataTestId}
          className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          aria-invalid={invalid}
          aria-errormessage={ariaErrorMessage}
        >
          {addEmpty ? <option value={""}>—</option> : null}
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
