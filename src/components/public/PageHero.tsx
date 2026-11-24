type PageHeroProps = {
  image: string; // background image
  imageAlt?: string;
  heading: string;
  description: string;
};

export default function PageHero({
  image,
  imageAlt = "",
  heading,
  description,
}: PageHeroProps) {
  return (
  <section className="relative isolate overflow-hidden bg-[#E8EEF7] transition-colors duration-300 dark:bg-[#0B1220]">
  {/* Background image */}
  <img
    src={image}
    alt={imageAlt}
    aria-hidden={imageAlt === ""}
    decoding="async"
    fetchPriority="high"
    className="absolute inset-0 -z-10 h-full w-full  object-center
               transition-[filter] duration-300 dark:brightness-75 "
  />

  <div className="container-main">
    <div className="flex min-h-56 flex-col justify-end gap-3 py-8 sm:min-h-64 md:min-h-72 md:gap-4 md:py-10 xl:min-h-80 xl:py-12">
      <h1 className="max-w-md font-playfair text-3xl font-semibold leading-tight tracking-tight text-white drop-shadow-md sm:text-4xl md:max-w-lg lg:text-[40px]">
        {heading}
      </h1>

      <p className="max-w-sm text-sm leading-relaxed text-white/90 drop-shadow md:max-w-md md:text-base">
        {description}
      </p>
    </div>
  </div>
</section>
  );
}