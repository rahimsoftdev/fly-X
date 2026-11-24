import { Link } from "react-router";
import { Globe } from "lucide-react";

/* lucide-react v1 e brand icon nai, tai inline SVG (currentColor, hover e color change kore) */
const FacebookIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.4V21h3.1z" />
    </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
);

/* links sora-sori ekhane */
const socials = [
    {
        label: "Facebook",
        href: "https://www.facebook.com/rahimsoftdev",
        icon: FacebookIcon,
        hover: "hover:bg-[#1877F2] hover:border-[#1877F2] hover:shadow-[#1877F2]/40",
    },
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/rahimsoftdev/",
        icon: LinkedinIcon,
        hover: "hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:shadow-[#0A66C2]/40",
    },
    {
        label: "GitHub",
        href: "https://github.com/rahimsoftdev",
        icon: GithubIcon,
        hover: "hover:bg-[#24292F] hover:border-[#24292F] hover:shadow-black/30 dark:hover:bg-white dark:hover:border-white dark:hover:text-[#24292F]",
    },
    {
        label: "Portfolio",
        href: "https://rahimsoftdev.vercel.app",
        icon: Globe,
        hover: "hover:bg-primary hover:border-primary hover:shadow-primary/40",
    },
];

const linkGroups = [
    {
        title: "Platform",
        links: [
            { label: "Home", to: "/" },
            { label: "Membership", to: "/#premium-benefits" },
            { label: "How it works", to: "/#how-it-works" },
            { label: "Routes", to: "/#curated-travel" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "Safety", to: "/#private-aviation" },
            { label: "FAQ", to: "/faq" },
            { label: "Contact", to: "/contact" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="border-t border-(--border-color) bg-[#FAFAFA] transition-colors duration-300 dark:bg-[#0B1220]">
            <div className="container-main pt-10 md:pt-12 xl:pt-14">
                <div className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-16">
                    {/* Brand */}
                    <div className="max-w-xs space-y-5">
                        <Link
                            to="/"
                            className="flex flex-col  group focus:outline-none"
                        >
                            <svg
                                width="38"
                                height="30"
                                viewBox="0 0 44 34"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-primary transition-transform duration-300 group-hover:scale-105"
                            >
                                <path
                                    d="M6 2H26C32.5 2 37 6 37 11.5C37 15.8 34.2 19.2 30 20.4L38 31H27.5L20.5 21H15L19 31H10L5 18H23.5C26.5 18 28.5 16.2 28.5 13.5C28.5 10.8 26.5 9 23.5 9H9L6 2Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M2 11H16L14 14.5H4L2 11Z"
                                    fill="currentColor"
                                />
                            </svg>
                            <span className="mt-1 text-[10px] font-extrabold tracking-[0.28em] text-secondary dark:text-white">
                                Flyx
                            </span>
                        </Link>

                        <p className="text-sm leading-relaxed text-(--paragraph-text)">
                            The premier concierge-assisted private travel membership platform.
                            Transforming travel demand into shared charter excellence.
                        </p>

                        <ul className="flex items-center gap-3">
                            {socials.map(({ label, href, icon: Icon, hover }) => (
                                <li key={label}>
                                    <a
                                        href={href}
                                        aria-label={label}
                                        title={label}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`group flex size-10 items-center justify-center rounded-full
                                            border border-(--border-color) bg-(--card) text-(--paragraph-text)
                                            transition-all duration-300 ease-out
                                            hover:-translate-y-1 hover:text-white hover:shadow-lg
                                            focus-visible:outline-2 focus-visible:outline-offset-2
                                            focus-visible:outline-primary active:translate-y-0 active:scale-95
                                            ${hover}`}
                                    >
                                        <Icon className="size-[18px] transition-transform duration-300 group-hover:scale-110" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Link columns */}
                    <div className="grid grid-cols-2 gap-8 sm:gap-16 lg:gap-24 xl:gap-40">
                        {linkGroups.map((group) => (
                            <nav key={group.title} aria-label={group.title}>
                                <h3 className="mb-4 text-base font-semibold text-(--heading-text)">
                                    {group.title}
                                </h3>
                                <ul className="space-y-3">
                                    {group.links.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                to={link.to}
                                                className="text-sm text-(--paragraph-text) transition-colors duration-200
                                   hover:text-primary"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        ))}
                    </div>
                </div>

                {/* Bottom bar */}
                <div
                    className="mt-10 flex flex-col items-center justify-between gap-3 border-t
                     border-(--border-color) py-5 text-center text-xs text-(--paragraph-text)
                     sm:flex-row sm:text-left md:mt-12"
                >
                    <p>© {new Date().getFullYear()} Flyx Aviation. All rights reserved.</p>
                    <Link to="/terms" className="transition-colors hover:text-primary">
                        Terms &amp; Conditions
                    </Link>
                </div>
            </div>
        </footer>
    );
}