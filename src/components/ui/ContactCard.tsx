import type { LucideIcon } from "lucide-react";

type ContactCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  linkLabel: string;
  href: string;
  external?: boolean;
};

export default function ContactCard({
  icon: Icon,
  title,
  description,
  linkLabel,
  href,
  external = false,
}: ContactCardProps) {
  return (
    <article
      className="group flex h-full flex-col gap-3 rounded-xl border border-primary/70 bg-primary/5
                 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary
                 hover:shadow-lg hover:shadow-primary/10 dark:bg-primary/10 md:p-5"
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-full border
                   border-primary/40 bg-primary/10 text-primary transition-colors duration-300
                   group-hover:bg-primary group-hover:text-white"
      >
        <Icon className="size-4" strokeWidth={1.75} />
      </span>

      <div className="space-y-1.5">
        <h3 className="text-sm font-semibold text-(--heading-text) md:text-base">
          {title}
        </h3>
        <p className="text-xs leading-relaxed text-(--paragraph-text) md:text-sm">
          {description}
        </p>
      </div>

      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="mt-auto break-all text-xs font-medium text-primary underline-offset-4
                   hover:underline focus-visible:outline-2 focus-visible:outline-offset-2
                   focus-visible:outline-primary md:text-sm"
      >
        {linkLabel}
      </a>
    </article>
  );
}