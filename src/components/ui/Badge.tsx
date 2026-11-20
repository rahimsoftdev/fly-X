import type { ReactNode } from "react";

type Variant = "primary" | "danger" | "neutral";

const styles: Record<Variant, string> = {
  primary: "bg-primary/10 text-primary",
  danger: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400",
  neutral: "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300",
};

interface BadgeProps {
  variant?: Variant;
  children: ReactNode;
}

const Badge = ({ variant = "primary", children }: BadgeProps) => (
  <span
    className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${styles[variant]}`}
  >
    {children}
  </span>
);

export default Badge;