import { Plane } from "lucide-react";

type LoadingProps = {
    message?: string;
    fullScreen?: boolean; // false dile shudhu parent er moddhe dekhabe
};

export default function LoadingPage({
    message = "Preparing for takeoff",
    fullScreen = true,
}: LoadingProps) {
    return (
        <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className={`relative isolate flex w-full items-center justify-center overflow-hidden
                bg-[var(--background)] px-4
                ${fullScreen ? "fixed inset-0 z-[100] min-h-dvh" : "min-h-[60vh]"}`}
        >
            {/* Soft background glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-72 -translate-x-1/2 -translate-y-1/2
                    rounded-full bg-primary/15 blur-3xl sm:size-96 dark:bg-primary/20"
            />

            <div className="flex w-full max-w-xs flex-col items-center text-center sm:max-w-sm">
                {/* Logo with spinning ring */}
                <div className="relative flex size-24 items-center justify-center sm:size-28">
                    <span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full border-2 border-primary/20
                            border-t-primary animate-spin motion-reduce:animate-none"
                    />
                    <span
                        aria-hidden="true"
                        className="absolute inset-2 rounded-full bg-primary/10 animate-pulse motion-reduce:animate-none"
                    />
                    <svg
                        width="44"
                        height="34"
                        viewBox="0 0 44 34"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="relative text-primary sm:scale-110"
                        aria-hidden="true"
                    >
                        <path
                            d="M6 2H26C32.5 2 37 6 37 11.5C37 15.8 34.2 19.2 30 20.4L38 31H27.5L20.5 21H15L19 31H10L5 18H23.5C26.5 18 28.5 16.2 28.5 13.5C28.5 10.8 26.5 9 23.5 9H9L6 2Z"
                            fill="currentColor"
                        />
                        <path d="M2 11H16L14 14.5H4L2 11Z" fill="currentColor" />
                    </svg>
                </div>

                {/* Brand */}
                <h1 className="mt-6 text-2xl font-extrabold tracking-[0.28em] text-secondary sm:text-3xl dark:text-white">
                    Flyx
                </h1>
                <p className="mt-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[var(--paragraph-text)] sm:text-sm">
                    Jet Management Platform
                </p>

                {/* Flight track */}
                <div className="relative mt-8 h-6 w-48 sm:w-64" aria-hidden="true">
                    <div className="absolute left-0 right-0 top-1/2 border-t-2 border-dashed border-primary/30" />
                    <Plane
                        className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rotate-45
                            fill-primary text-primary animate-flight motion-reduce:animate-none"
                    />
                </div>

                {/* Message with bouncing dots */}
                <p className="mt-4 flex items-center gap-1 text-sm text-[var(--paragraph-text)]">
                    {message}
                    <span className="flex items-end gap-0.5" aria-hidden="true">
                        {[0, 150, 300].map((delay) => (
                            <span
                                key={delay}
                                className="size-1 rounded-full bg-primary animate-bounce motion-reduce:animate-none"
                                style={{ animationDelay: `${delay}ms` }}
                            />
                        ))}
                    </span>
                </p>

                <span className="sr-only">Loading, please wait</span>
            </div>
        </div>
    );
}