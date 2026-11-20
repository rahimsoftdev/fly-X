const STEPS = [
  "Our concierge team will review your request within 24 hours",
  "You'll receive notifications when matching charter opportunities become available",
  "Government issued photo ID is required to travel.",
];

export default function WhatHappensNext() {
  return (
    <section className="mt-6 rounded-xl border border-(--border-color) bg-(--card) p-4 sm:p-5">
      <h2 className="text-base font-semibold text-(--heading-text)">
        What happens next?
      </h2>

      <ul className="mt-3 space-y-1.5">
        {STEPS.map((step) => (
          <li
            key={step}
            className="flex gap-2 text-sm text-(--paragraph-text)"
          >
            <span aria-hidden="true">•</span>
            <span>{step}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}