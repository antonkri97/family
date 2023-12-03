interface InputProps {
  refProp?: React.RefObject<HTMLInputElement>;
  name: string;
  label: string;
  invalid?: true | undefined;
  ariaErrorMessage?: string | undefined;
  errorMessage?: string | undefined | null;
  dataTestId?: string | null;
  defaultValue?: string | null;
  placeholder?: string;
}

export const Input: React.FC<InputProps> = ({
  refProp,
  name,
  label,
  invalid,
  ariaErrorMessage,
  errorMessage,
  dataTestId,
  defaultValue,
  placeholder,
}) => {
  return (
    <div className="mb-4">
      <label className="mb-2 block text-sm font-semibold text-gray-600">
        {label}
      </label>
      <input
        data-test-id={dataTestId}
        ref={refProp}
        name={name}
        defaultValue={defaultValue ?? ""}
        className="w-full rounded-md border p-2 focus:border-indigo-500 focus:outline-none"
        type="text"
        placeholder={placeholder}
        aria-invalid={invalid}
        aria-errormessage={ariaErrorMessage}
      />
      {errorMessage ? (
        <div className="pt-1 text-red-700" id="title-error">
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
};
