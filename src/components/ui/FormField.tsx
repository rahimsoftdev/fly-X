import type { InputHTMLAttributes } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
  error?: string; // validation message shown under the input
};

export default function FormField({
  label,
  id,
  error,
  className = "",
  ...rest
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block font-playfair text-xs font-medium text-(--heading-text)"
      >
        {label}
      </label>

      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-(--heading-text)
                    placeholder:text-(--paragraph-text)/60 transition-colors duration-200
                    focus:border-primary focus:outline-2 focus:outline-primary/30
                    dark:bg-(--card) ${
                      error ? "border-red-500" : "border-slate-400/60"
                    } ${className}`}
        {...rest}
      />

      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}