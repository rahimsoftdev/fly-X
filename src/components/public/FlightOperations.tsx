import flightImg from "@/assets/images/flightImg.png";

const highlight = "font-medium text-primary";

export default function FlightOperations() {
  return (
    <section
      id="flight-operations"
      className="pt-10 md:pt-12 xl:pt-section bg-white transition-colors duration-300 dark:bg-[#0B1220]"
    >
      <div className="container-main">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left: text */}
          <div className="space-y-4 lg:col-span-7 lg:text-left">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Operational Excellence
            </p>

            <h2 className="title-text font-playfair">
              Flight Operations &amp; Airports
            </h2>

            <div className="mx-auto max-w-2xl space-y-4 lg:mx-0">
              <p className="description-text">
                Experience the pinnacle of executive travel between the
                financial heartbeat of <span className={highlight}>New York</span>{" "}
                and the sun-drenched shores of Tampa. We use only the highest
                rated operators to ensure an experience engineered for the
                discerning traveler who values time as their most precious
                asset.
              </p>

              <p className="description-text">
                By utilizing airports such as Teterboro (
                <span className={highlight}>TEB</span>) in New Jersey, we bypass
                the congestion of major hubs, offering direct access just
                minutes from Manhattan. And we ensure a seamless transition to
                the Gulf Coast&apos;s premier business and leisure destination
                of <span className={highlight}>Tampa</span> using airports such
                as <span className={highlight}>TPA</span> and Tampa Executive.
              </p>
            </div>
          </div>

          {/* Right: single combined image */}
          <div className="lg:col-span-5">
            <img
              src={flightImg}
              alt="Private jet on the tarmac and aerial view of an airport terminal"
              loading="lazy"
              decoding="async"
              className="mx-auto h-auto w-full rounded-xl object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}