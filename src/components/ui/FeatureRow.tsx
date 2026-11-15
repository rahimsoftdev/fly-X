type FeatureRowProps = {
  type: "left" | "right"; // image kon pashe thakbe
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  highlight: string; // italic ongsho
  description: string;
};

export default function FeatureRow({
  type,
  image,
  imageAlt,
  eyebrow,
  title,
  highlight,
  description,
}: FeatureRowProps) {
  const isImageLeft = type === "left";

  return (
    <div className="grid grid-cols-1 items-center gap-6 md:gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
      {/* Image: mobile e shobshomoy upore, desktop e type onujayi */}
      <div className={isImageLeft ? "lg:order-1" : "lg:order-2"}>
        <div className="overflow-hidden rounded-xl">
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            decoding="async"
            className="h-56 w-full object-cover object-center transition-transform duration-500
                       hover:scale-105 sm:h-72 md:h-80 lg:h-72 xl:h-80"
          />
        </div>
      </div>

      {/* Text */}
      <div
        className={`space-y-3  md:space-y-4 lg:text-left ${
          isImageLeft ? "lg:order-2" : "lg:order-1"
        }`}
      >
        <p className="text-xs font-medium uppercase tracking-widest text-[#14438B] dark:text-primary">
          {eyebrow}
        </p>

        <h2 className="title-text font-playfair">
          {title}{" "}
          <span className="block italic font-normal sm:inline lg:block xl:inline">
            {highlight}
          </span>
        </h2>

        <p className="description-text  max-w-xl ">
          {description}
        </p>
      </div>
    </div>
  );
}