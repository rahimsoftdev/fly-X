import { Fingerprint, Headset, ShieldCheck, User } from "lucide-react";
import ReceiveCard from "../ui/ReceiveCard";

const items = [
  {
    icon: User,
    title: "Exclusive Network Access",
    description:
      "Join a curated community of executives, founders, and industry leaders.",
  },
  {
    icon: Headset,
    title: "Concierge",
    description:
      "Your dedicated concierge is available around the clock to manage every detail of your journey.",
  },
  {
    icon: Fingerprint,
    title: "Flexible Booking",
    description:
      "No long-term contracts. Pay as you fly with complete transparency on pricing.",
  },
  {
    icon: ShieldCheck,
    title: "Operator Excellence",
    description:
      "Raven uses only Part 135 certified operators with the highest records of safety.",
  },
];

export default function WhatYouReceive() {
  return (
    <section
      id="what-you-receive"
      className="section-padding bg-white transition-colors duration-300 dark:bg-[#0B1220]"
    >
      <div className="container-main">
        {/* Heading */}
        <div className="mb-6 space-y-3 md:mb-8">
          <span
            className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold
                       uppercase tracking-widest text-primary"
          >
            Benefits
          </span>
          <h2 className="title-text font-playfair">What You Receive</h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {items.map((item) => (
            <ReceiveCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}