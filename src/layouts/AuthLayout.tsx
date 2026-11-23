import { Link, NavLink, Outlet, useLocation } from "react-router";
import authImg from "@/assets/images/auth.png";

/* Text shown on the image for each page */
const content = {
  login: {
    title: "Begin Your Journey",
    text: "Experience private travel with unmatched comfort, exclusivity, and concierge support.",
  },
  register: {
    title: "Become a Flyx Member",
    text: "Complete your registration and gain access to exclusive charter flight opportunities.",
  },
};

// Tab link style (active tab is filled blue)
const tabClass = ({ isActive }: { isActive: boolean }): string =>
  `rounded-full px-6 py-1.5 text-xs font-medium transition-all duration-300 sm:px-8 sm:text-sm ${isActive
    ? "bg-primary text-white shadow-sm"
    : "text-(--heading-text) hover:text-primary"
  }`;

const AuthLayout = () => {
  const { pathname } = useLocation();
  const isRegister = pathname.startsWith("/register");
  const { title, text } = isRegister ? content.register : content.login;

  return (
    <main className="grid min-h-screen grid-cols-1 bg-[#F9FBFF] transition-colors duration-300 dark:bg-[#0B1220] lg:grid-cols-2">
      {/* ---------- Left: image (shudhu lg ba boro device e dekhabe) ---------- */}
      <aside className="relative isolate hidden overflow-hidden bg-[#0B1220] lg:sticky lg:top-0 lg:block lg:h-screen">
        <img
          src={authImg}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />

        {/* Soft gradient so the white text stays readable */}
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

        <div className="flex h-full flex-col items-center justify-center gap-2 px-6 pt-24 text-center">
          <p className="font-playfair text-4xl font-medium text-white">{title}</p>
          <p className="max-w-sm text-sm leading-relaxed text-white/90">{text}</p>
        </div>
      </aside>

      {/* ---------- Right: logo + home link + tabs + page content ---------- */}
      <section className="relative z-10 flex items-center justify-center px-4 py-8 sm:px-8 lg:px-12 lg:py-10">
        <div className="w-full max-w-xl space-y-6">
          {/* Top row: Logo (bame) + Back to Home (dane) */}
          <div className="relative z-10 flex items-center justify-between">
            <Link
              to="/"
              aria-label="Flyx home"
              className="group flex cursor-pointer flex-col items-center justify-center p-1 focus:outline-none"
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
                <path d="M2 11H16L14 14.5H4L2 11Z" fill="currentColor" />
              </svg>
              <span className="mt-1 text-[10px] font-extrabold tracking-[0.28em] text-secondary dark:text-white">
                Flyx
              </span>
            </Link>

          
          </div>

          {/* Login / Sign Up tabs */}
          <nav
            aria-label="Authentication"
            className="inline-flex rounded-full bg-primary/10 p-1"
          >
            <NavLink to="/login" className={tabClass}>
              Login
            </NavLink>
            <NavLink to="/register" className={tabClass}>
              Sign Up
            </NavLink>
          </nav>

          {/* LoginPage or RegisterPage renders here */}
          <Outlet />
        </div>
      </section>
    </main>
  );
};

export default AuthLayout;