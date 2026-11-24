import { useId } from "react";
import { ChevronDown } from "lucide-react";
import { inputBase, labelClass } from "./fieldStyles";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder: string;
  disabled?: boolean;
}

export default function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: SelectFieldProps) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>

      <div className="relative ">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputBase} appearance-none pr-9 cursor-pointer ${
            value ? "text-(--heading-text)" : "text-slate-400"
          }`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}