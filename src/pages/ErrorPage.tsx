import {  isRouteErrorResponse, useRouteError } from "react-router";
import { Home, Plane, RotateCw, TriangleAlert } from "lucide-react";

type ErrorPageProps = {
    fullScreen?: boolean; // false dile Navbar/Footer er majhe dekhabe
};

export default function ErrorPage({ fullScreen = true }: ErrorPageProps) {
    const error = useRouteError();

    // error theke status, title ar detail ber kori
    let status: number | null = null;
    let title = "Turbulence Ahead";
    let message =
        "Something went wrong on our end. Please try again, or head back to the home page.";
    let details = "";

    if (isRouteErrorResponse(error)) {
        status = error.status;
        if (error.status === 401) {
            title = "Access Denied";
            message = "You need to log in to view this page.";
        } else if (error.status === 403) {
            title = "Clearance Required";
            message = "You don't have permission to access this page.";
        } else if (error.status === 404) {
            title = "Flight Not Found";
            message = "The page you are looking for does not exist.";
        } else if (error.status >= 500) {
            title = "Engine Trouble";
            message = "Our servers are having a hard time. Please try again shortly.";
        }
        details = typeof error.data === "string" ? error.data : error.statusText;
    } else if (error instanceof Error) {
        details = error.message;
    } else if (typeof error === "string") {
        details = error;
    }

    return (
        <div
            role="alert"
            className={`relative isolate flex w-full items-center justify-center overflow-hidden
                bg-[var(--background)] px-4 py-10
                ${fullScreen ? "min-h-dvh" : "min-h-[calc(100dvh-5rem)]"}`}
        >
            {/* Soft background glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-72 -translate-x-1/2 -translate-y-1/2
                    rounded-full bg-red-500/10 blur-3xl sm:size-96 dark:bg-red-500/15"
            />

            <div className="flex w-full max-w-xs flex-col items-center text-center sm:max-w-md">
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

                {/* Status */}
                {status ? (
                    <p className="mt-6 text-6xl font-extrabold leading-none tracking-tight text-red-500 sm:text-7xl">
                        {status}
                    </p>
                ) : (
                    <TriangleAlert
                        className="mt-6 size-14 text-red-500 sm:size-16"
                        aria-hidden="true"
                    />
                )}

                <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[var(--heading-text)] sm:text-3xl">
                    {title}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-[var(--paragraph-text)] sm:text-base">
                    {message}
                </p>

                {/* Error detail: shudhu development e dekhabe */}
                {import.meta.env.DEV && details && (
                    <pre
                        className="mt-4 max-h-32 w-full overflow-auto rounded-lg border border-red-500/30
                            bg-red-500/5 p-3 text-left text-xs text-red-600 dark:text-red-400"
                    >
                        {details}
                    </pre>
                )}

                {/* Flight track */}
                <div className="relative mt-8 h-6 w-48 sm:w-64" aria-hidden="true">
                    <div className="absolute left-0 right-0 top-1/2 border-t-2 border-dashed border-primary/30" />
                    <Plane
                        className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rotate-45
                            fill-primary text-primary animate-flight motion-reduce:animate-none"
                    />
                </div>

                {/* Actions */}
                <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary
                            px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-primary/25
                            transition-all duration-300 hover:bg-secondary hover:shadow-lg
                            focus-visible:outline-2 focus-visible:outline-offset-2
                            focus-visible:outline-primary active:scale-95
                            dark:hover:bg-primary/80"
                    >
                        <RotateCw className="size-4" />
                        Try Again
                    </button>

                    {/* <a> use korechi jate full reload hoy ar error state clear hoy */}
                    <a
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-full border
                            border-[var(--border-color)] bg-[var(--card)] px-6 py-2.5 text-sm font-medium
                            text-[var(--foreground)] transition-all duration-300
                            hover:border-primary hover:text-primary
                            focus-visible:outline-2 focus-visible:outline-offset-2
                            focus-visible:outline-primary active:scale-95"
                    >
                        <Home className="size-4" />
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
}