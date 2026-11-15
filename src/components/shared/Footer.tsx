import { Link } from "react-router";
import logo from "@/assets/images/logo.png";

/* lucide-react v1 e brand icon nai, tai inline SVG use korechi */
const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
        <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.4V21h3.1z" />
    </svg>
);

const TwitterIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
        <path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.300 1.800-2.200-.8.5-1.700.8-2.600 1a4.100 4.100 0 0 0-7 3.700A11.600 11.600 0 0 1 3.500 4.800a4.100 4.100 0 0 0 1.300 5.500c-.7 0-1.300-.2-1.900-.5 0 2 1.400 3.700 3.300 4.100-.6.2-1.200.2-1.800.1.500 1.600 2 2.800 3.800 2.900A8.200 8.200 0 0 1 2 18.600 11.600 11.600 0 0 0 8.300 20.400c7.500 0 11.700-6.300 11.700-11.700v-.5c.8-.6 1.500-1.300 2-2.100z" />
    </svg>
);

const InstagramIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="size-4"
        aria-hidden="true"
    >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.500" cy="6.500" r="1" fill="currentColor" stroke="none" />
    </svg>
);

const socials = [
    { label: "Facebook", href: "#", icon: FacebookIcon },
    { label: "Twitter", href: "#", icon: TwitterIcon },
    { label: "Instagram", href: "#", icon: InstagramIcon },
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
                                RAVEN
                            </span>
                        </Link>

                        <p className="text-sm leading-relaxed text-(--paragraph-text)">
                            The premier concierge-assisted private travel membership platform.
                            Transforming travel demand into shared charter excellence.
                        </p>

                        <ul className="flex items-center gap-4">
                            {socials.map(({ label, href, icon: Icon }) => (
                                <li key={label}>
                                    <Link
                                        to={href}
                                        aria-label={label}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex size-8 items-center justify-center rounded-full text-primary
                               transition-all duration-300 hover:bg-primary hover:text-white"
                                    >
                                        <Icon />
                                    </Link>
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
                    <p>© {new Date().getFullYear()} Raven Aviation. All rights reserved.</p>
                    <Link to="/terms" className="transition-colors hover:text-primary">
                        Terms &amp; Conditions
                    </Link>
                </div>
            </div>
        </footer>
    );
}