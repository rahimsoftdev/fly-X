import JourneyCard from "../ui/JourneyCard";

/* Content lives here, so you can edit text without touching the JSX */
const steps = [
  {
    step: "01",
    title: "Membership",
    description:
      "Submit the membership form to create your account, and share your travel preferences.",
  },
  {
    step: "02",
    title: "Reservation",
    description:
      "Based on shared travel preferences, Flyx will curate a shared travel experience on which you can place a reservation.",
  },
  {
    step: "03",
    title: "Confirmation",
    description:
      "Once enough members have placed their reservation, the flight is booked and confirmation sent to the members.",
  },
  {
    step: "04",
    title: "Your Flight",
    description:
      "You arrive at the designated airport where you will be personally greeted and escorted onto the aircraft for your flight.",
  },
];

export default function MembershipJourney() {
  return (
    <section
      id="membership-journey"
      className="section-padding bg-[#E9F2FF] transition-colors duration-300 dark:bg-[#0F1B33]"
    >
      <div className="container-main">
        {/* Heading block */}
        <div className="mb-6 space-y-3 md:mb-8">
          {/* Pill label */}
          <span
            className="inline-block rounded-full bg-primary/20 px-3.5 py-1 text-[10px] font-semibold
                       uppercase tracking-widest text-primary"
          >
            Application
          </span>
          <h2 className="title-text font-playfair">Membership Journey</h2>
        </div>

        {/* Cards: 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
          {steps.map((item) => (
            <JourneyCard key={item.step} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}