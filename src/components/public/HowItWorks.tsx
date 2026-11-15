import ProcessCard from "@/components/ui/ProcessCard";
import { Crown, Layers, Navigation, UserRoundCog } from "lucide-react";
// import ProcessCard from "../ui/ProcessCard";

const steps = [
  {
    step: "01",
    title: "Become a Member",
    description:
      "Create an account and share your travel preferences through our private platform.",
    icon: Navigation,
  },
  {
    step: "02",
    title: "Concierge Matching",
    description:
      "Raven matches your travel preference with other members seeking similar travel, and curates the optimal shared charter.",
    icon: Layers,
  },
  {
    step: "03",
    title: "Operator Coordination",
    description:
      "We coordinate with certified operators to secure premium aircraft availability, timing and up to date communication with our members.",
    icon: UserRoundCog,
  },
  {
    step: "04",
    title: "Shared Charter Experience",
    description:
      "Enjoy the luxury of private aviation at a fraction of the cost.",
    icon: Crown,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-(--background)">
      <div className="container-main">
        {/* Heading */}
        <div className="mb-8 space-y-2 md:mb-10">
          <p className="text-xs font-medium uppercase tracking-widest text-secondary dark:text-primary">
            The Process
          </p>
          <h2 className="title-text font-playfair">How Raven Works</h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
          {steps.map((item) => (
            <ProcessCard key={item.step} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}