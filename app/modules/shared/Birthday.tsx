interface BirthdayInputProps {
  label: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  name: string;
  dataTestId?: string;
  refProp?: React.RefObject<HTMLInputElement>;
  invalid?: true | undefined;
  ariaErrorMessage?: string | undefined;
  errorMessage?: string | undefined | null;
  defaultValue?: string;
}

export const BirthdayInput: React.FC<BirthdayInputProps> = ({
  label,
  name,
  onChange = () => {},
  disabled = false,
  errorMessage,
  invalid,
  defaultValue,
  ariaErrorMessage,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="date"
        name={name}
        defaultValue={defaultValue}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200"
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
