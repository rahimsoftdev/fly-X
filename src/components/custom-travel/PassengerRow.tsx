import type { IPassenger } from "@/types/custom-travel.type";
import FormField from "./FormField";

interface FieldConfig {
  key: keyof IPassenger;
  label: string;
  placeholder: string;
  type: "text" | "email" | "tel";
}

const FIELDS: FieldConfig[] = [
  { key: "firstName", label: "First Name", placeholder: "John", type: "text" },
  { key: "lastName", label: "Last Name", placeholder: "Davis", type: "text" },
  {
    key: "streetAddress",
    label: "Street Address",
    placeholder: "New york city",
    type: "text",
  },
  { key: "zipCode", label: "Zip Code", placeholder: "1212", type: "text" },
  {
    key: "email",
    label: "Email",
    placeholder: "john@example.com",
    type: "email",
  },
  {
    key: "phone",
    label: "Phone",
    placeholder: "+1 (555) 123-4567",
    type: "tel",
  },
];

interface Props {
  index: number;
  passenger: IPassenger;
  onChange: (index: number, field: keyof IPassenger, value: string) => void;
}

export default function PassengerRow({ index, passenger, onChange }: Props) {
  return (
    <div className="rounded-lg border border-(--border-color) p-3 sm:p-4">
      <p className="mb-3 text-xs font-medium text-(--paragraph-text)">
        Passenger {index + 1}
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {FIELDS.map((field) => (
          <FormField
            key={field.key}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            autoComplete="off"
            value={passenger[field.key]}
            onChange={(value) => onChange(index, field.key, value)}
          />
        ))}
      </div>
    </div>
  );
}