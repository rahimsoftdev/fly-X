import { ConciergeBell, Route, Star, Ticket } from "lucide-react";
import CallToAction from "@/components/shared/CallToAction";

//images: 
import termsImg from "@/assets/images/termsImg.png"; // hero image (meeting room)
import termsCallActionImg from '@/assets/images/termCallActionImg.png'

/* ------------------------------------------------------------------ */
/* Static content: edit text here without touching the JSX             */
/* ------------------------------------------------------------------ */

// Bullet points inside the "Required Disclosures" card
const disclosures: { label: string; text: string }[] = [
    {
        label: "Broker Status",
        text: "Raven facilitates arrangements for air transportation by selecting FAA-certificated Part 135 air carriers.",
    },
    {
        label: "Operator Identity",
        text: "All flights are performed by third-party licensed air carriers whose identities will be disclosed prior to flight.",
    },
    {
        label: "Operational Control",
        text: "The operating carrier maintains full operational control of the aircraft and its flight crew at all times.",
    },
    {
        label: "Approval",
        text: "All flight requests are subject to operator approval, aircraft availability, and crew scheduling.",
    },
];

// Two small cards in "Protective Clauses"
const clauses: { title: string; text: string }[] = [
    {
        title: "Aircraft Specifics",
        text: "Raven cannot guarantee a specific tail number or year of manufacture, though we prioritize late-model aircraft within the requested class.",
    },
    {
        title: "Weather & Capacity",
        text: "Flights may be delayed or rescheduled due to adverse weather conditions, ATC constraints, or weight/balance limitations for specific airfields.",
    },
];

// Feature list inside the "Membership" card
const membershipPerks: { icon: typeof Star; label: string }[] = [
    { icon: Star, label: "Curated shared opportunities" },
    { icon: ConciergeBell, label: "Concierge coordination" },
    { icon: Route, label: "Priority route access" },
    { icon: Ticket, label: "Priority route access" },
];

// Three steps in "How It Works"
const steps: { step: string; title: string; text: string }[] = [
    {
        step: "1",
        title: "Apply",
        text: "Submit your application for membership to join our vetted travel community.",
    },
    {
        step: "2",
        title: "Interest",
        text: "Submit travel interest for specific dates and routes within our digital dashboard.",
    },
    {
        step: "3",
        title: "Confirm",
        text: "Once a flight is matched, confirm your trip and receive your flight manifest details.",
    },
];

// Aircraft names listed in "Safety First"
const fleet: string[] = ["Citation Latitude", "Challenger 300", "Phenom 300"];

/* ------------------------------------------------------------------ */
/* Shared class names (keeps the JSX short and consistent)             */
/* ------------------------------------------------------------------ */

// Common card look: white in light mode, var(--card) in dark mode
const cardClass =
    "rounded-xl border border-(--border-color) bg-white p-5 shadow-sm " +
    "transition-colors duration-300 dark:bg-(--card) md:p-6";

/* Small helper: "01 — REQUIRED DISCLOSURES" style label */
function SectionLabel({ children }: { children: string }) {
    return (
        <h2 className="mb-3 text-[11px] font-medium uppercase tracking-widest text-(--paragraph-text) md:mb-4 md:text-xs">
            {children}
        </h2>
    );
}

export default function TermsAndConditionsPage() {
    return (
        <>
            <main className="pb-10 md:pb-12 xl:pb-section pt-10 bg-[#FAFAFA] transition-colors duration-300 dark:bg-[#0B1220]">
                <div className="container-main">
                    {/* Gap between every section: 40px (mobile), 48px (md), 80px (xl) */}
                    <div className="flex flex-col gap-10 md:gap-12 xl:gap-20">
                        {/* ---------------- Page header + hero image ---------------- */}
                        <header className="space-y-5 md:space-y-6">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div className="space-y-2">
                                    {/* Pill label */}
                                    <span className="inline-block rounded-full bg-primary/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
                                        Private Shared Consolidations
                                    </span>
                                    <h1 className="title-text font-playfair">Terms &amp; Conditions</h1>
                                    <p className="text-sm font-medium text-(--heading-text)">
                                        Raven Private Aviation Membership
                                    </p>
                                </div>

                                <p className="text-xs text-(--paragraph-text)">
                                    Last updated: October 24, 2024
                                </p>
                            </div>

                            {/* Hero image */}
                            <img
                                src={termsImg}
                                alt="Presenter speaking to a group in a boardroom"
                                fetchPriority="high"
                                decoding="async"
                                className="h-52 w-full rounded-3xl object-cover object-center sm:h-64 md:h-80 xl:h-96"
                            />
                        </header>

                        {/* ---------------- 01 Required Disclosures ---------------- */}
                        <section id="required-disclosures">
                            <SectionLabel>01 — Required Disclosures</SectionLabel>

                            <div className={cardClass}>
                                <p className="mb-4 text-sm font-semibold leading-snug text-(--heading-text) md:text-base">
                                    Raven Private Aviation acts solely as an air charter broker and
                                    not as a direct air carrier.
                                </p>

                                <ul className="space-y-3">
                                    {disclosures.map((item) => (
                                        <li
                                            key={item.label}
                                            className="flex gap-2.5 text-xs leading-relaxed text-(--paragraph-text) md:text-sm"
                                        >
                                            {/* Bullet dot */}
                                            <span
                                                aria-hidden="true"
                                                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                                            />
                                            <span>
                                                <strong className="font-semibold text-(--heading-text)">
                                                    {item.label}:
                                                </strong>{" "}
                                                {item.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* ---------------- 02 Protective Clauses ---------------- */}
                        <section id="protective-clauses">
                            <SectionLabel>02 — Protective Clauses</SectionLabel>

                            {/* Mobile: 1 column | Tablet+: 2 columns */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                                {clauses.map((item) => (
                                    <article key={item.title} className={cardClass}>
                                        <h3 className="mb-2 text-sm font-semibold text-(--heading-text) md:text-base">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs leading-relaxed text-(--paragraph-text) md:text-sm">
                                            {item.text}
                                        </p>
                                    </article>
                                ))}

                                {/* Wide card spans both columns */}
                                <article className={`${cardClass} md:col-span-2`}>
                                    <h3 className="mb-2 text-sm font-semibold text-(--heading-text) md:text-base">
                                        Re-accommodation
                                    </h3>
                                    <p className="text-xs leading-relaxed text-(--paragraph-text) md:text-sm">
                                        In the event of a mechanical failure or carrier cancellation,
                                        Raven will use commercially reasonable efforts to secure a
                                        replacement aircraft of equal or greater value, subject to
                                        additional cost if applicable.
                                    </p>
                                </article>
                            </div>
                        </section>

                        {/* ---------------- 03 Membership ---------------- */}
                        <section id="membership">
                            <SectionLabel>03 — Membership</SectionLabel>

                            <div className={`${cardClass} space-y-5`}>
                                <p className="max-w-2xl text-xs leading-relaxed text-(--paragraph-text) md:text-sm">
                                    Membership at Raven grants access to a curated ecosystem of
                                    shared charter opportunities. Rather than booking an entire
                                    aircraft, members can purchase individual seats or blocks of
                                    seats on pre-existing flight plans.
                                </p>

                                {/* Perks: 1 col mobile, 2 col tablet+ */}
                                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:max-w-xl">
                                    {membershipPerks.map(({ icon: Icon, label }, index) => (
                                        <li
                                            key={`${label}-${index}`}
                                            className="flex items-center gap-2.5 text-xs text-(--paragraph-text) md:text-sm"
                                        >
                                            <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                                            {label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* ---------------- How It Works ---------------- */}
                        <section id="how-it-works-terms">
                            <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-(--paragraph-text)">
                                Private
                            </p>
                            <h2 className="title-text mb-5 font-playfair md:mb-6">How It Works</h2>

                            {/* Mobile: 1 col | Tablet+: 3 columns */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
                                {steps.map((item) => (
                                    <article key={item.step} className={`${cardClass} space-y-3`}>
                                        <span className="font-playfair text-2xl font-semibold leading-none text-(--heading-text) md:text-3xl">
                                            {item.step}
                                        </span>
                                        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-(--heading-text)">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs leading-relaxed text-(--paragraph-text) md:text-sm">
                                            {item.text}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </section>

                        {/* ---------------- 04 Safety First ---------------- */}
                        <section id="safety-first">
                            <SectionLabel>04 — Safety First</SectionLabel>

                            <div className={`${cardClass} space-y-4`}>
                                <p className="max-w-2xl text-xs leading-relaxed text-(--paragraph-text) md:text-sm">
                                    Safety is our absolute priority. We only partner with
                                    FAA-certificated Part 135 air carriers that exceed standard
                                    safety ratings (ARG/US, Wyvern).
                                </p>

                                <div className="border-t border-(--border-color) pt-4">
                                    <p className="mb-3 text-[10px] font-medium uppercase tracking-widest text-(--paragraph-text)">
                                        Sample Fleet Standards
                                    </p>

                                    {/* Fleet names: stacked on mobile, 3 columns on tablet+ */}
                                    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                        {fleet.map((name) => (
                                            <li
                                                key={name}
                                                className="font-playfair text-sm font-medium text-(--heading-text) md:text-base"
                                            >
                                                {name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

            </main>
            <div className="">
                <CallToAction image={termsCallActionImg}
                    imageAlt="image"
                    buttonLink="/"
                    heading="Ready to Elevate Your Travel Experience?"
                    description="Join the exclusive network of executives and founders who have discovered a smarter way to fly private."
                    buttonText="Become a Member"

                />
            </div>
        </>
    );
}