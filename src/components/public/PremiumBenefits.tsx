import { ConciergeBell, SlidersHorizontal, Users } from "lucide-react";


import networkImg from "@/assets/images/networkImg.png";
import conciergeImg from "@/assets/images/conciergeImg.png";
import membershipImg from "@/assets/images/membershipImg.png";

import BenefitCard from "@/components/ui/BenefitCard";

const benefits = [
  {
    image: networkImg,
    imageAlt: "Professional working at a desk with a headset",
    title: "Exclusive Network Access",
    description:
      "Join a curated community of executives, founders, and industry leaders.",
    icon: Users,
  },
  {
    image: conciergeImg,
    imageAlt: "Smiling concierge in a navy suit",
    title: "Concierge Service",
    description:
      "Dedicated travel concierge managing every detail of your journey.",
    icon: ConciergeBell,
  },
  {
    image: membershipImg,
    imageAlt: "Black premium membership card on a marble surface",
    title: "Flexible Membership",
    description:
      "Pay-as-you-fly model with no long-term contracts or hidden fees.",
    icon: SlidersHorizontal,
  },
];

export default function PremiumBenefits() {
  return (
    <section
      id="premium-benefits"
      className="section-padding bg-white transition-colors duration-300 dark:bg-(--background)"
    >
      <div className="container-main">
        {/* Heading */}
        <div className="mb-3 space-y-2 md:mb-5">
          <p className="text-xs font-medium uppercase tracking-widest text-[#14438B] dark:text-primary">
            Membership
          </p>
          <h2 className="title-text font-playfair">Premium Benefits</h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {benefits.map((item) => (
            <BenefitCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}