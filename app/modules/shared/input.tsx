export const Input = ({
  refProp,
  name,
  label,
  invalid,
  ariaErrorMessage,
  errorMessage,
  dataTestId,
}: {
  refProp: React.RefObject<HTMLInputElement>;
  name: string;
  label: string;
  invalid: true | undefined;
  ariaErrorMessage: string | undefined;
  errorMessage: string | undefined | null;
  dataTestId: string | null;
}) => (
  <div>
    <label className="flex w-full flex-col gap-1">
      <span>{label}</span>
      <input
        data-test-id={dataTestId}
        ref={refProp}
        name={name}
        className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
        aria-invalid={invalid}
        aria-errormessage={ariaErrorMessage}
      />
    </label>
    {errorMessage ? (
      <div className="pt-1 text-red-700" id="title-error">
        {errorMessage}
      </div>
    ) : null}
  </div>
);
