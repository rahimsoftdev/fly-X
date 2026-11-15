import { useState, type ChangeEvent, type FormEvent } from "react";
import { Phone } from "lucide-react";

const PHONE_DISPLAY = "+880 1873-135444";
const PHONE_TEL = "+8801873135444";
const WHATSAPP_LINK = "https://wa.me/8801873135444";
const EMAIL = "webdesignrahim4061@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/rahimsoftdev/";
const FACEBOOK = "https://www.facebook.com/rahimsoftdev";

/* lucide-react v1 e brand icon nai, tai inline SVG */
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.200 8.200 0 0 1-4.200-1.200l-.3-.2-3 .8.8-2.900-.2-.3A8.200 8.200 0 1 1 12 20.200zm4.500-6.100c-.2-.1-1.500-.7-1.700-.8-.2-.1-.4-.1-.6.100l-.8 1c-.1.200-.3.200-.5.100a6.700 6.700 0 0 1-3.300-2.900c-.2-.4.200-.4.700-1.300.1-.2 0-.3 0-.5l-.8-1.800c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.300 3 3 0 0 0-.9 2.200c0 1.300.9 2.600 1 2.800.1.200 1.800 2.800 4.400 3.900 1.600.7 2.300.7 3.100.6.500-.1 1.500-.6 1.700-1.200.2-.6.200-1.100.2-1.200-.1-.1-.3-.2-.5-.3z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
    <path d="M4.500 3A1.800 1.800 0 1 0 4.500 6.600 1.800 1.800 0 0 0 4.500 3zM3 8.500h3V21H3zM9 8.500h2.900v1.700c.4-.8 1.500-1.900 3.400-1.900 3.500 0 4.200 2.300 4.200 5.300V21h-3v-6.600c0-1.600 0-3.600-2.200-3.600s-2.500 1.700-2.500 3.500V21H9z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
    <path d="M13.500 21v-7.500h2.600l.4-3h-3V8.600c0-.9.300-1.500 1.500-1.500h1.600V4.400c-.3 0-1.200-.1-2.300-.1-2.300 0-3.900 1.400-3.900 4v2.200H8v3h2.400V21h3.100z" />
  </svg>
);

const socials = [
  { label: "WhatsApp", href: WHATSAPP_LINK, icon: WhatsAppIcon },
  { label: "LinkedIn", href: LINKEDIN, icon: LinkedInIcon },
  { label: "Facebook", href: FACEBOOK, icon: FacebookIcon },
];

type FormState = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

const initialState: FormState = { name: "", phone: "", email: "", message: "" };

const inputClass =
  "w-full rounded-md border border-(--border-color) bg-white px-3.5 py-2.5 text-sm " +
  "text-(--heading-text) placeholder:text-(--paragraph-text)/70 transition-colors duration-200 " +
  "focus:border-primary focus:outline-2 focus:outline-primary/30 dark:bg-(--card)";

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [sent, setSent] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (sent) setSent(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    // Backend na thakle email app e khule jabe. API thakle ekhane fetch() boshao.
    const subject = encodeURIComponent(`Contact request from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\n\n${form.message}`,
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;

    setSent(true);
    setForm(initialState);
  };

  return (
    <section
      id="contact-form"
      className="pb-10 md:pb-12 xl:pb-section bg-[#ffffff] transition-colors duration-300 dark:bg-[#0B1220]"
    >
      <div className="container-main">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Left: info */}
          <div className="space-y-5 lg:col-span-5">
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-widest text-[#14438B] dark:text-primary">
                Get in Touch
              </p>
              <h2 className="title-text font-playfair">Have a Question?</h2>
              <p className="description-text max-w-md">
                Use this form or give us a call at the number below to speak
                with a concierge directly.
              </p>
            </div>

            {/* Phone */}
            <a
              href={`tel:${PHONE_TEL}`}
              className="group flex w-fit items-center gap-3 focus-visible:outline-2
                         focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <span
                className="flex size-10 items-center justify-center rounded-md border
                           border-(--border-color) bg-white text-(--paragraph-text)
                           transition-colors duration-300 group-hover:border-primary
                           group-hover:text-primary dark:bg-(--card)"
              >
                <Phone className="size-4" />
              </span>
              <span>
                <span className="block text-[10px] font-medium uppercase tracking-widest text-(--paragraph-text)">
                  Phone
                </span>
                <span className="block text-sm font-medium text-(--heading-text) transition-colors group-hover:text-primary">
                  {PHONE_DISPLAY}
                </span>
              </span>
            </a>

            {/* WhatsApp + socials */}
            <ul className="flex flex-wrap items-center gap-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="flex size-9 items-center justify-center rounded-full border
                               border-primary/40 text-primary transition-all duration-300
                               hover:bg-primary hover:text-white focus-visible:outline-2
                               focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <Icon />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: form */}
          <form onSubmit={handleSubmit} className="space-y-4 lg:col-span-7" noValidate={false}>
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-medium text-(--heading-text)">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-xs font-medium text-(--heading-text)">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                inputMode="tel"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-(--heading-text)">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="message" className="text-xs font-medium text-(--heading-text)">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                placeholder="Write your message..."
                value={form.message}
                onChange={handleChange}
                className={`${inputClass} resize-y`}
              />
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer rounded-md bg-primary px-5 py-3 text-sm font-medium
                         text-white transition-all duration-300 hover:bg-secondary
                         hover:shadow-lg hover:shadow-primary/20 focus-visible:outline-2
                         focus-visible:outline-offset-2 focus-visible:outline-primary
                         active:scale-[0.99] dark:hover:bg-primary/80"
            >
              Send Message
            </button>

            <p role="status" aria-live="polite" className="min-h-5 text-sm text-primary">
              {sent ? "Thanks! Your email app should open with your message." : ""}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}