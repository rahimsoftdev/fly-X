import type { LucideIcon } from "lucide-react";

type ReceiveCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function ReceiveCard({
  icon: Icon,
  title,
  description,
}: ReceiveCardProps) {
  return (
    <article
      className="group flex h-full flex-col gap-4 rounded-2xl border border-(--border-color)
                 bg-white p-5 transition-all duration-300 hover:-translate-y-1
                 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10
                 dark:bg-(--card) md:p-6"
    >
      <span
        className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10
                   text-primary transition-colors duration-300
                   group-hover:bg-primary group-hover:text-white"
      >
        <Icon className="size-5" strokeWidth={1.75} />
      </span>

      <div className="space-y-2">
        <h3 className="font-playfair text-base font-semibold text-(--heading-text) md:text-lg">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-(--paragraph-text)">
          {description}
        </p>
      </div>
    </article>
  );
}