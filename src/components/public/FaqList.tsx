import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqData, type FaqItem } from "@/data/faq.data";


export default function FaqList() {

  const [openId, setOpenId] = useState<number | null>(1);

  const toggle = (id: number): void => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq-list"
      className="section-padding bg-white transition-colors duration-300 dark:bg-[#0B1220]"
    >
      <div className="container-main">
        {/* Heading */}
        <h2 className="title-text mb-4 md:mb-8 text-center font-playfair ">
          Frequently Asked Questions
        </h2>

        {/* Accordion list */}
        <div className="w-full  flex-col gap-2.5 md:gap-3">
          {faqData.map((item: FaqItem) => {
            const isOpen = openId === item.id;
            const panelId = `faq-all-panel-${item.id}`;
            const buttonId = `faq-all-button-${item.id}`;

            return (
              <div
                key={item.id}
                className={`rounded-md border transition-colors duration-300 m-3 ${
                  isOpen
                    ? "border-primary/30 bg-[#EEF3FB] dark:border-primary/40 dark:bg-[#14438B]/25"
                    : "border-transparent bg-[#F4F5F7] hover:bg-[#EEF1F6] dark:bg-(--card) dark:hover:bg-[#243349]"
                }`}
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(item.id)}
                    className="flex w-full cursor-pointer items-center justify-between gap-4
                               px-4 py-3.5 text-left focus-visible:outline-2
                               focus-visible:-outline-offset-2 focus-visible:outline-primary
                               md:px-5 md:py-4"
                  >
                    <span className="text-sm font-semibold text-(--heading-text) md:text-base">
                      {item.question}
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`size-4 shrink-0 text-(--paragraph-text) transition-transform duration-300 md:size-5 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>
                </h3>

                {/* Smooth open/close */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-4 pb-4 text-xs leading-relaxed text-(--paragraph-text) md:px-5 md:text-sm">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}