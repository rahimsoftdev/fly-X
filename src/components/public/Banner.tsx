
import heroImage from "@/assets/images/hero.png";

const Banner = () => {
  return (
    <section className="w-full pt-5 md:pt-8">
      <div className="container-main">
        <div className="relative w-full">
          {/* Hero Image */}
          <div className="relative h-[260px] w-full overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800 sm:h-[320px] md:h-[400px] lg:h-[450px] xl:h-[480px] md:rounded-3xl">
            <img
              src={heroImage}
              alt="Private Jet Flying Above Clouds"
              className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
            />

            {/* Image Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
          </div>

          {/* Hero Content */}
          <div
            className="
              relative z-10 w-full
              bg-[var(--background)]
              pt-5 pb-1
              md:absolute md:bottom-0 md:left-0
              md:w-[56%] md:rounded-tr-[28px]
              md:pt-7 md:pr-8 md:pb-3
              lg:w-[50%] lg:pt-8 lg:pr-10
              xl:w-[46%]
            "
          >
            {/* Top Inverted Curve */}
            <span
              aria-hidden="true"
              className="inverted-curve-top pointer-events-none absolute -top-6 left-0 hidden size-6 md:block"
            />

            {/* Right Inverted Curve */}
            <span
              aria-hidden="true"
              className="inverted-curve-right pointer-events-none absolute -right-6 bottom-0 hidden size-6 md:block"
            />

            {/* Content */}
            <div>
              <h1 className="title-text">
                Private Travel
                <br />
                Reimagined
              </h1>

              <p className="description-text mt-2.5 sm:mt-3">
                Join an exclusive network that transforms travel demand into
                shared private charter opportunities.
              </p>

              {/* CTA Button */}
              <div className="mt-4 sm:mt-5">
                <button
                  type="button"
                  className="
                    inline-flex items-center justify-center
                    rounded-full bg-primary
                    px-4 py-1.5
                    text-sm font-semibold text-white
                    shadow-sm
                    transition-all duration-200
                    hover:bg-primary/90 hover:shadow-md
                    active:scale-95
                    cursor-pointer
                    sm:px-5 sm:py-2
                  "
                >
                  Become a Member
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
