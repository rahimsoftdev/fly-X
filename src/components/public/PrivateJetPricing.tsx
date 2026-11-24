import {
  Banknote,
  Check,
  Headset,
  Info,
  Plane,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import membersImg from "@/assets/images/membersImg.png"; // avatar group image (2 faces)
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

/* ------------------------------------------------------------------ */
/* Static data (edit here to change content, no need to touch the JSX) */
/* ------------------------------------------------------------------ */

// Two feature cards shown on the left side
const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: UsersRound,
    title: "Shared Charter Model",
    description: "Pool members for a semi-private shared charter experience.",
  },
  {
    icon: Headset,
    title: "Concierge Coordination",
    description:
      "Dedicated specialists manage member logistics, ensuring seamless boarding and arrivals.",
  },
];

// Trust badges shown beside the disclosure box
const badges: string[] = [
  "FAA Part 135 Certified Operators",
  "Guaranteed Complimentary Catering",
  "Real-Time Operational Transparency",
];

// Example numbers used in the cost breakdown card
const TOTAL_CHARTER_COST = 20000;
const MEMBERS_ON_FLIGHT = 8;

// Format a number as USD, e.g. 2500 -> "$2,500"
const formatUSD = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export default function PrivateJetPricing() {

  const [totalUser, setTotalUser] = useState()
  useEffect(()=>{
    const getData = async ()=>{
      const res = await api.get('/users/count')
      console.log(res?.data?.data?.totalUsers, 'total user')
      setTotalUser(res?.data?.data?.totalUsers)
    }
    getData()
  },[])
  // Cost per member is calculated, so changing the numbers above updates everything
  const costPerMember = TOTAL_CHARTER_COST / MEMBERS_ON_FLIGHT;

  return (
    <section
      id="private-jet-pricing"
      className="section-padding bg-white transition-colors duration-300 dark:bg-[#0B1220]"
    >
      <div className="container-main">
        {/* ---------------- Heading block ---------------- */}
        <div className="mb-6 space-y-3  md:mb-10 lg:text-left">
          {/* Small blue label above the title */}
          <p className="text-[10px] font-medium uppercase tracking-widest text-primary md:text-xs">
            How Flight Pricing Works
          </p>

          <h2 className="title-text font-playfair">
            Private Jet Travel, Shared Intelligently
          </h2>

          <p className="description-text ">
            By allowing members to co-charter flights on popular routes, Flyx
            reduces individual costs by up to 70% while maintaining the
            uncompromising standards of private aviation.
          </p>
        </div>

        {/* ---------------- Cards row ---------------- */}
        {/* Mobile: stacked | Tablet: 2 columns | Desktop: 2 small cards + 1 wide card */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          {/* Feature cards (left side) */}
          {features.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="flex flex-col justify-center items-center text-center gap-3 rounded-xl bg-[#F4F5F7] p-5
                         transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                         hover:shadow-primary/10 dark:bg-(--card) md:p-6 lg:col-span-3 lg:min-h-64"
            >
              {/* Icon */}
              <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-4.5" strokeWidth={1.75} />
              </span>

              <div className="space-y-1.5">
                <h3 className="font-playfair text-sm font-semibold text-(--heading-text) md:text-base">
                  {title}
                </h3>
                <p className="text-xs leading-relaxed text-(--paragraph-text) md:text-sm">
                  {description}
                </p>
              </div>
            </article>
          ))}

          {/* Cost breakdown card (right side, spans full width on tablet) */}
          <article
            className="space-y-4 rounded-xl bg-[#EAF2FF] p-5 dark:bg-primary/10 sm:col-span-2
                       md:p-6 lg:col-span-6"
          >
            <p className="text-[10px] font-medium uppercase tracking-widest text-primary">
              Example Flight Cost Breakdown
            </p>

            {/* Row 1: total charter cost */}
            <div className="flex items-center gap-3">
              <span
                className="flex size-12 shrink-0 items-center justify-center rounded-lg border
                           border-primary/40 bg-white text-primary dark:bg-(--card)"
              >
                <Plane className="size-5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-(--paragraph-text)">
                  Total Charter Cost
                </p>
                <p className="text-sm font-semibold text-(--heading-text) md:text-base">
                  {formatUSD(TOTAL_CHARTER_COST)}
                </p>
              </div>
            </div>

            {/* Row 2: members on flight */}
            <div className="flex items-center gap-3">
              <div className="flex shrink-0 items-center overflow-hidden rounded-lg bg-primary">
                <img
                  src={membersImg}
                  alt="Members sharing the flight"
                  loading="lazy"
                  decoding="async"
                  className="h-9 w-auto object-cover"
                />
                {/* "+6" shows the remaining members not visible in the avatars */}
                <span className="px-2 text-xs font-semibold text-white">
                  +{Number(totalUser) - 2}
                </span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-(--paragraph-text)">
                  Members Join Flight
                </p>
                <p className="text-sm font-semibold text-(--heading-text) md:text-base">
                  {totalUser} Members
                </p>
              </div>
            </div>

            {/* Row 3: final price per member (highlighted) */}
            <div className="flex items-center gap-3 pt-1">
              <span
                className="flex size-12 shrink-0 items-center justify-center rounded-lg
                           bg-primary text-white"
              >
                <Banknote className="size-5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-(--paragraph-text) md:text-xs">
                  Estimated Cost Per Member
                </p>
                <p className="text-3xl font-bold tracking-tight text-primary md:text-4xl xl:text-5xl">
                  {formatUSD(costPerMember)}
                </p>
              </div>
            </div>
          </article>
        </div>

        {/* ---------------- Disclosure + badges row ---------------- */}
        {/* Mobile/Tablet: stacked | Desktop: disclosure (wide) + badges (narrow) */}
        <div className="mt-4 md:mt-7.5 grid grid-cols-1 items-center gap-4 lg:mt-10 lg:grid-cols-12 lg:gap-5">
          {/* Dark blue disclosure box */}
          <aside
            className="rounded-xl bg-secondary p-5 text-white md:p-6 lg:col-span-8"
            aria-label="Quotation disclosure"
          >
            <div className="mb-2 flex items-center gap-2.5">
              <Info className="size-4 shrink-0" aria-hidden="true" />
              <h3 className="text-xs font-semibold uppercase tracking-widest">
                Quotation Disclosure
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-white/80 md:text-sm">
              Why exact pricing cannot be guaranteed: Final costs are subject to
              the total number of committed members 48 hours before departure.
              If a flight does not reach minimum occupancy, members may opt to
              share a higher split or reschedule without penalty.
            </p>
          </aside>

          {/* Trust badges list */}
          <ul className="space-y-3 lg:col-span-4">
            {badges.map((badge) => (
              <li
                key={badge}
                className="flex items-center gap-3 text-[11px] font-semibold uppercase
                           tracking-wide text-secondary dark:text-white md:text-xs"
              >
                {/* Blue check circle */}
                <span
                  className="flex size-5 shrink-0 items-center justify-center rounded-full
                             bg-primary text-white"
                >
                  <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                </span>
                {badge}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}