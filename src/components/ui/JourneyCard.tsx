
type JourneyCardProps = {
  step: string; // step number, e.g. "01"
  title: string;
  description: string;
};

export default function JourneyCard({
  step,
  title,
  description,
}: JourneyCardProps) {
  return (
    <article
      className="group flex h-full flex-col gap-4 rounded-xl bg-white p-5 shadow-sm
                 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                 hover:shadow-primary/10 dark:bg-(--card) md:p-6"
    >
      {/* Big serif step number (muted gray, turns blue on hover) */}
      <span
        className="font-playfair text-4xl font-medium leading-none text-slate-400
                   transition-colors duration-300 group-hover:text-primary
                   dark:text-slate-500 md:text-5xl"
      >
        {step}
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