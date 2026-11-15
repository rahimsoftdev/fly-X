import type { LucideIcon } from "lucide-react";

type ProcessCardProps = {
    step: string;
    title: string;
    description: string;
    icon: LucideIcon;
};

export default function ProcessCard({
    step,
    title,
    description,
    icon: Icon,
}: ProcessCardProps) {
    return (
        <article
            className="group flex h-full flex-col gap-5 rounded-xl border border-primary
                 bg-primary/5 p-5 transition-all duration-300
                 hover:-translate-y-1 hover:border-primary hover:shadow-lg hover:shadow-primary/10
                 dark:bg-primary/10 xl:p-6"
        >
            {/* Top: icon + step number */}
            <div className="flex items-center justify-between">
                <span
                    className="flex size-11 shrink-0 items-center justify-center rounded-full
                     border border-primary/70 bg-primary/10 text-primary
                     transition-colors duration-300 group-hover:bg-primary group-hover:text-white"
                >
                    <Icon className="size-5" strokeWidth={1.75} />
                </span>

                <span className="text-xl font-bold tracking-tight text-(--heading-text) md:text-2xl">
                    {step}
                </span>
            </div>

            {/* Text */}
            <div className="space-y-2">
                <h3 className="text-base font-semibold text-(--heading-text)">
                    {title}
                </h3>
                <p className="text-sm leading-relaxed text-(--paragraph-text)">
                    {description}
                </p>
            </div>
        </article>
    );
}