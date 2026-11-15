import type { LucideIcon } from "lucide-react";

type BenefitCardProps = {
    image: string;
    imageAlt: string;
    title: string;
    description: string;
    icon: LucideIcon;
};

export default function BenefitCard({
    image,
    imageAlt,
    title,
    description,
    icon: Icon,
}: BenefitCardProps) {
    return (
        <article
            className="group flex h-full flex-col overflow-hidden rounded-lg bg-[#F1F6FF]
                 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                 hover:shadow-[#14438B]/15 dark:bg-[#14438B]/20"
        >
            {/* Image */}
            <div className="overflow-hidden">
                <img
                    src={image}
                    alt={imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="h-48 w-full object-cover object-center transition-transform duration-500
                     group-hover:scale-105 sm:h-44 md:h-40 lg:h-44 xl:h-58"
                />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex items-center gap-2.5">
                    <span
                        className="flex size-6 shrink-0 items-center justify-center rounded-full
                       bg-[#14438B] text-white"
                    >
                        <Icon className="size-3.5" strokeWidth={2} />
                    </span>
                    <h3 className="text-sm font-semibold text-(--heading-text) md:text-base">
                        {title}
                    </h3>
                </div>

                <p className="text-xs leading-relaxed text-(--paragraph-text) md:text-sm">
                    {description}
                </p>
            </div>
        </article>
    );
}