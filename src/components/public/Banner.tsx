import heroImage from "@/assets/images/hero.png";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Link } from "react-router";

const CURVE_SIZE = 24;

const Banner = () => {
  const { user, role } = useCurrentUser();

  // login thakle /role e jabe, na thakle /register e
  const isLoggedIn = !!user && !!role;
  const ctaLink = isLoggedIn ? `/${role}` : "/register";
  const ctaText = isLoggedIn ? "Dashboard" : "Become a Member";

  return (
    <section className="w-full pt-5 md:pt-8">
      <div className="container-main">
        <div className="relative w-full">
          {/* Hero Image */}
          <div className="relative h-[240px] w-full overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800 sm:h-[330px] md:h-[520px] md:rounded-3xl lg:h-[560px] xl:h-[600px]">
            <img
              src={heroImage}
              alt="Private jet flying above clouds"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover object-center"
            />

            {/* Image Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          </div>

          {/* Hero Content */}
          <div
            className="
              relative z-10 w-full
              bg-[var(--background)]
              pt-5 pb-1
              md:absolute md:bottom-0 md:left-0
              md:w-[54%] md:rounded-tr-3xl
              md:pt-7 md:pr-8 md:pb-1
              lg:w-[50%] lg:pt-8 lg:pr-10
              xl:w-[44%] xl:pt-10 xl:pr-12
            "
          >
            {/* Right inverted curve: image er bottom-left corner round kore (md+ only) */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 hidden md:block"
              style={{
                right: -CURVE_SIZE,
                width: CURVE_SIZE,
                height: CURVE_SIZE,
                background: `radial-gradient(circle at 100% 0, transparent ${
                  CURVE_SIZE - 0.5
                }px, var(--background) ${CURVE_SIZE}px)`,
              }}
            />

            {/* Content */}
            <div>
              <h1 className="font-playfair text-[26px] font-medium leading-[1.2] tracking-tight text-[var(--heading-text)] sm:text-3xl md:text-[32px] lg:text-[40px]">
                Private Travel
                <br />
                Reimagined
              </h1>

              <p className="mt-2.5 max-w-md text-[13px] leading-relaxed text-[var(--paragraph-text)] sm:mt-3 sm:text-sm md:max-w-none md:text-[13px] lg:text-[15px] xl:text-base">
                Join an exclusive network that transforms travel demand into
                shared private charter opportunities.
              </p>

              {/* CTA Button */}
              <div className="mt-4 sm:mt-5">
                <Link
                  to={ctaLink}
                  className="
                    inline-flex items-center justify-center
                    rounded-full bg-primary
                    px-5 py-2
                    text-[13px] font-medium text-white
                    shadow-sm
                    transition-all duration-200
                    hover:bg-primary/90 hover:shadow-md
                    focus-visible:outline-2 focus-visible:outline-offset-2
                    focus-visible:outline-primary
                    active:scale-95
                    sm:text-sm
                    lg:px-6 lg:py-2.5
                  "
                >
                  {ctaText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;