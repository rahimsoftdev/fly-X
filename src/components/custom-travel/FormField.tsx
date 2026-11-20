import { useId, type InputHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { inputBase } from "@/components/travel/fieldStyles";

interface Props
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "className"
  > {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: LucideIcon;
  className?: string; // bahirer div-er jonno (jemon md:col-span-2)
}

export default function FormField({
  label,
  value,
  onChange,
  icon: Icon,
  className,
  ...rest
}: Props) {
  const id = useId();

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-(--heading-text)"
      >
        {Icon && <Icon className="size-3.5 text-(--paragraph-text)" />}
        {label}
      </label>

      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBase} ${
          value ? "text-(--heading-text)" : "text-slate-400"
        }`}
        {...rest}
      />
    </div>
  );
}