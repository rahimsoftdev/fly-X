import { useState } from "react";
import { faqData, type FaqItem } from "@/data/faq.data";



export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number): void => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  //get 5 item
  const items: FaqItem[] = faqData.slice(0, 5);

  return (
    <section
      id="faq"
      className="section-padding bg-white transition-colors duration-300 dark:bg-(--background)"
    >
      <div className="container-main">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-16">
          {/* Left: heading */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <span
              className="mb-4 inline-block rounded-full bg-black px-3.5 py-1 text-xs font-semibold
                         uppercase tracking-wider text-white dark:bg-white dark:text-black"
            >
              FAQs
            </span>

            <h2 className="title-text font-playfair">
              Frequently{" "}
              <br className="hidden lg:block" />
              Asked{" "}
              <br className="hidden lg:block" />
              Questions
            </h2>
          </div>

          {/* Right: accordion */}
          <div
            className="divide-y divide-(--border-color) border-y border-(--border-color)
                       lg:col-span-7"
          >
            {items.map((item) => {
              const isOpen = openId === item.id;
              const panelId = `faq-panel-${item.id}`;
              const buttonId = `faq-button-${item.id}`;

              return (
                <div key={item.id}>
                  <h3>
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(item.id)}
                      className="group flex w-full cursor-pointer items-center justify-between gap-4
                                 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2
                                 focus-visible:outline-primary md:py-5"
                    >
                      <span
                        className="text-sm font-medium text-(--heading-text) transition-colors
                                   group-hover:text-primary sm:text-base"
                      >
                        {item.question}
                      </span>
                      <span
                        aria-hidden="true"
                        className="shrink-0 text-xl font-light leading-none text-(--paragraph-text)"
                      >
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                  </h3>

                  {/* Smooth open/close animation */}
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
                      <p className="pb-5 pr-8 text-sm leading-relaxed text-(--paragraph-text) sm:text-base">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}