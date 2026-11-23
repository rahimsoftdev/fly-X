import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Link } from "react-router";

type CallToActionProps = {
    image: string; // background image
    imageAlt?: string;
    heading: string;
    highlight?: string; // optional 2nd line
    description: string;
    buttonText: string;
    buttonLink: string;
    isDark?: boolean
};

export default function CallToAction({
    image,
    imageAlt = "",
    heading,
    highlight,
    description,
    buttonText,
    buttonLink,
    isDark
}: CallToActionProps) {

    const { user, role } = useCurrentUser()

    // user login thakle /role e jabe, text hobe "Dashboard"
    const finalLink = user ? `/${role}` : buttonLink;
    const finalText = user ? "Dashboard" : buttonText;

    return (
        <section
            id="call-to-action"
            className={`relative isolate overflow-hidden ${isDark && 'bg-[#0B1220]'}`}
        >
            {/* Background image */}
            <img
                src={image}
                alt={imageAlt}
                aria-hidden={imageAlt === ""}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
            />

            {/* Dark overlay: text readable thakar jonno (light/dark dui mode e same) */}
            <div className={`absolute inset-0 -z-10 ${isDark && 'bg-black/60'}`} />

            <div className="container-main section-padding">
                <div className="mx-auto flex min-h-64 max-w-3xl flex-col items-center justify-center gap-4 text-center md:min-h-72 md:gap-5 xl:min-h-80">
                    <h2 className="font-playfair text-2xl font-medium leading-tight tracking-tight text-white sm:text-3xl md:text-4xl  lg:text-[40px]">
                        {heading}
                        {highlight && (
                            <>
                                <br className="hidden sm:block" />
                                <span className="sm:hidden"> </span>
                                {highlight}
                            </>
                        )}
                    </h2>

                    <p className="max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
                        {description}
                    </p>

                    <Link
                        to={finalLink}
                        className="mt-1 inline-flex items-center justify-center rounded-full bg-primary
                       px-6 py-2.5 text-sm font-medium text-white transition-all duration-300
                       hover:bg-white hover:text-secondary hover:shadow-lg
                       focus-visible:outline-2 focus-visible:outline-offset-2
                       focus-visible:outline-white active:scale-95"
                    >
                        {finalText}
                    </Link>
                </div>
            </div>
        </section>
    );
}