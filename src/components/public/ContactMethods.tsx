import ContactCard from "@/components/ui/ContactCard";
import { Crown, Headset, Link2 } from "lucide-react";


const EMAIL = "webdesignrahim4061@gmail.com";
const methods = [
  {
    icon: Crown,
    title: "Membership Inquiries",
    description:
      "Questions about membership tiers, application process, or eligibility.",
    linkLabel: EMAIL,
    href: `mailto:${EMAIL}?subject=Membership%20Inquiry`,
    external: false,
  },
  {
    icon: Headset,
    title: "Concierge Support",
    description:
      "Existing members can reach their dedicated concierge team directly.",
    linkLabel: EMAIL,
    href: `mailto:${EMAIL}?subject=Membership%20Inquiry`,
    external: true,
  },
  {
    icon: Link2,
    title: "Partnership Requests",
    description:
      "Operators, airports, and service providers interested in partnership.",
    linkLabel: EMAIL,
    href: `mailto:${EMAIL}?subject=Membership%20Inquiry`,
    external: true,
  },
];

export default function ContactMethods() {
  return (
    <section
      id="contact-methods"
      className="section-padding bg-white transition-colors duration-300 dark:bg-[#0B1220]"
    >
      <div className="container-main">
        <div className="mb-6 space-y-2 md:mb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-[#14438B] dark:text-primary">
            Contact Methods
          </p>
          <h2 className="title-text font-playfair">How Can We Help?</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {methods.map((item) => (
            <ContactCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}