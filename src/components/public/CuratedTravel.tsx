import { Link } from "react-router";
import travelImg from "../../assets/images/travel.png";

export default function CuratedTravel() {
  return (
    <section
      id="curated-travel"
      className="section-padding bg-[#FAFAFA] dark:bg-[#0B1220]"
    >
      <div className="container-main">
        <div className="grid grid-cols-1 items-center gap-8 md:gap-10 lg:grid-cols-5 lg:gap-12">
          {/* Left: content */}
          <div className="space-y-4  lg:col-span-2 lg:space-y-5 lg:text-left">
            <h2 className="title-text font-playfair">Curated Travel</h2>

            <p className="description-text mx-auto max-w-lg lg:mx-0">
              Do you travel between NYC and Tampa? Join other members and
              experience the luxury of a shared private jet.
            </p>

            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-full bg-primary
                         px-5 py-2.5 text-sm font-medium text-white transition-all duration-300
                         hover:bg-secondary hover:shadow-lg hover:shadow-primary/20
                         focus-visible:outline-2 focus-visible:outline-offset-2
                         focus-visible:outline-primary active:scale-95
                         dark:hover:bg-primary/80"
            >
              Become a Member
            </Link>
          </div>

          {/* Right: image */}
          <div className="lg:col-span-3">
            <img
              src={travelImg}
              alt="Private jets flying above the clouds and parked on the tarmac"
              loading="lazy"
              decoding="async"
              className="max-h-120 w-full rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}